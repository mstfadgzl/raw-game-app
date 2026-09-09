import type { IGameStoreLink } from '../types/store';

export type StoreMetadata = { id: number; name: string; slug?: string; domain?: string | null };
export type StoreOption = StoreMetadata & { key: string; url: string | null };

export function safeStoreUrl(value: string): string | null {
    const url = value.trim();
    // Yalnızca web adresleri: API yanıtından gelen özel şemaları çalıştırma.
    return /^https?:\/\/[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?(?::\d+)?(?:[/?#][^\s\\]*)?$/i.test(url) ? url : null;
}

export function buildStoreOptions(links: IGameStoreLink[], metadata: StoreMetadata[]): StoreOption[] {
    const stores = new Map(metadata.map(store => [Number(store.id), store]));
    const options = new Map<string, StoreOption>();
    const linked = new Set<number>();
    for (const link of links) {
        const id = Number(link.store_id);
        const url = typeof link.url === 'string' ? safeStoreUrl(link.url) : null;
        if (!Number.isInteger(id) || id <= 0 || !url) continue;
        const key = `${id}:${url}`;
        const store = stores.get(id) ?? { id, name: url.split('/')[2], slug: '' };
        options.set(key, { ...store, key, url });
        linked.add(id);
    }
    // Oyun detayında olup ürün bağlantısı verilmeyen mağazalar da görünür.
    for (const store of metadata) {
        if (!linked.has(store.id)) options.set(String(store.id), { ...store, key: String(store.id), url: null });
    }
    return [...options.values()];
}

export async function openStoreLink(url: string, openURL: (url: string) => Promise<unknown>): Promise<void> {
    const safe = safeStoreUrl(url);
    if (!safe) throw new Error('Geçersiz mağaza adresi');
    // HTTPS bağlantılarını işletim sistemi destekleyen uygulamaya veya tarayıcıya yönlendirir.
    await openURL(safe);
}
