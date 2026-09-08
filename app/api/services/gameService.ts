import {
    IAchievementResponse,
    IGameDetail,
    IGameListResponse,
    IRedditResponse,
    ITrailerResponse,
} from '../../types';

import apiClient from '../client';

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
};

export interface GetGamesParams {
    page: number;
    pageSize?: number;
    platforms?: number;
    genres?: string;
    tags?: string;
    ordering?: string;
    dates?: string;
    metacritic?: string;
    forceRefresh?: boolean;
}

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

async function cachedGet<T>(
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

    if (pending) {
        return pending as Promise<T>;
    }

    const cached = cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
        // Kullanılan kaydı sıranın sonuna taşı.
        cache.delete(key);
        cache.set(key, cached);

        return cached.data as T;
    }

    cache.delete(key);

    const request = (async (): Promise<T> => {
        const startedAt = Date.now();

        try {
            const response = await apiClient.get<T>(url, {
                params,
            });

            saveToCache(key, response.data);

            return response.data;
        } finally {
            if (__DEV__) {
                console.log(
                    `[Game API] ${url} · sayfa ${params.page ?? 1}`,
                    `${Date.now() - startedAt} ms`,
                );
            }
        }
    })();

    pendingRequests.set(key, request);

    try {
        return await request;
    } finally {
        pendingRequests.delete(key);
    }
}

export const gameService = {
    getGames: async (
        params: GetGamesParams,
    ): Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>(
            '/games',
            {
                params: {

                    page: params.page,
                    page_size: params.pageSize ?? 20,
                    platforms: params.platforms,
                    genres: params.genres,
                    tags: params.tags,
                    ordering: params.ordering,
                    dates: params.dates,
                    metacritic: params.metacritic,
                },
            },
        );
        return response.data;
    },

    getGameDetail: (
        id: number,
    ): Promise<IGameDetail> => {
        return cachedGet<IGameDetail>(`/games/${id}`);
    },

    searchGames: (
        query: string,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>('/games', {
            search: query.trim(),
            search_precise: true,
            search_exact: false,
            ordering: '-added',
            metacritic: '1,100',
            page: 1,
            page_size: 20,
        });
    },

    getGamesByGenre: (
        genreSlug: string,
        page: number = 1,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>('/games', {
            genres: genreSlug,
            page,
            page_size: 20,
        });
    },

    getGameTrailers: (
        id: number,
    ): Promise<ITrailerResponse> => {
        return cachedGet<ITrailerResponse>(
            `/games/${id}/movies`,
        );
    },

    getGameAchievements: (
        id: number | string,
        page: number = 1,
        pageSize: number = 40,
    ): Promise<IAchievementResponse> => {
        return cachedGet<IAchievementResponse>(
            `/games/${id}/achievements`,
            {
                page,
                page_size: pageSize,
            },
        );
    },

    getGameSeries: (
        id: number,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>(
            `/games/${id}/game-series`,
        );
    },

    getGameAddition: (
        id: number,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>(
            `/games/${id}/additions`,
        );
    },

    getGameRedditPosts: (
        id: number,
        page: number = 1,
    ): Promise<IRedditResponse> => {
        return cachedGet<IRedditResponse>(
            `/games/${id}/reddit`,
            { page },
        );
    },
};