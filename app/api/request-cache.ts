import apiClient from './client';

type QueryParams = Record<
    string,
    string | number | boolean | undefined
>;

type CacheEntry = {
    data: unknown;
    expiresAt: number;
};

type RequestOptions = {
    forceRefresh?: boolean;
    validate?: (data: unknown) => boolean;
};

const CACHE_TTL = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 80;

const cache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<unknown>>();

const createCacheKey = (
    url: string,
    params: QueryParams,
): string => {
    const entries = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .sort(([first], [second]) => first.localeCompare(second));

    return JSON.stringify([url, entries]);
};

const saveToCache = (key: string, data: unknown) => {
    const now = Date.now();

    // Süresi dolmuş kayıtları temizle.
    for (const [entryKey, entry] of cache) {
        if (entry.expiresAt <= now) {
            cache.delete(entryKey);
        }
    }

    cache.delete(key);

    while (cache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = cache.keys().next().value;

        if (oldestKey === undefined) break;

        cache.delete(oldestKey);
    }

    cache.set(key, {
        data,
        expiresAt: now + CACHE_TTL,
    });
};

export async function cachedGet<T>(
    url: string,
    params: QueryParams = {},
    options: RequestOptions = {},
): Promise<T> {
    const key = createCacheKey(url, params);

    if (options.forceRefresh) {
        cache.delete(key);
    }

    // Devam eden aynı ağ isteği varsa onu paylaş.
    const pending = pendingRequests.get(key);

    if (pending && !options.forceRefresh) {
        if (__DEV__) console.log(`[API shared] ${url}`);
        return pending as Promise<T>;
    }

    const cached = cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
        // Kullanılan kaydı sıranın sonuna taşı.
        cache.delete(key);
        cache.set(key, cached);

        if (__DEV__) console.log(`[API cache] ${url}`);
        return cached.data as T;
    }

    cache.delete(key);

    let request!: Promise<T>;
    request = (async (): Promise<T> => {
        const startedAt = Date.now();

        try {
            const response = await apiClient.get<T>(url, {
                params,
            });

            if (options.validate && !options.validate(response.data)) {
                throw new Error('Geçersiz API yanıtı');
            }

            // A forced refresh may have superseded this request.
            if (pendingRequests.get(key) === request) {
                saveToCache(key, response.data);
            }

            return response.data;
        } finally {
            if (__DEV__) {
                console.log(
                    `[API network] ${url} · sayfa ${params.page ?? 1}`,
                    `${Date.now() - startedAt} ms`,
                );
            }
        }
    })();

    pendingRequests.set(key, request);

    try {
        return await request;
    } finally {
        if (pendingRequests.get(key) === request) {
            pendingRequests.delete(key);
        }
    }
}


export function peekCached<T>(url: string): T | null {
    const entry = cache.get(createCacheKey(url, {}));
    return entry && entry.expiresAt > Date.now() ? entry.data as T : null;
}
