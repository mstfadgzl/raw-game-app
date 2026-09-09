import type { IStoreDetail, IStoreResponse, IGameStoreLink, IGameStoreResponse } from '../../types/store';
import { cachedGet } from '../request-cache';

async function allPages<T>(fetchPage: (page: number) => Promise<{ results: T[]; next: string | null }>): Promise<T[]> {
    const items: T[] = [];
    const seen = new Set<string>();
    for (let page = 1; ; page++) {
        const response = await fetchPage(page);
        if (!Array.isArray(response.results)) throw new Error('Geçersiz mağaza yanıtı');
        items.push(...response.results);
        if (!response.next) return items;
        if (seen.has(response.next)) throw new Error('Mağaza sayfası tekrarlanıyor');
        seen.add(response.next);
        // API'nin next adresini açmak yerine aynı uçtan sayfa numarasıyla devam et.
    }
}

export const storeService = {
    getGameLinks: (gameId: number, forceRefresh = false): Promise<IGameStoreLink[]> =>
        allPages(page => cachedGet<IGameStoreResponse>(`/games/${gameId}/stores`, { page, page_size: 40 }, { forceRefresh })),
    getStores: (): Promise<IStoreDetail[]> =>
        allPages(page => cachedGet<IStoreResponse>('/stores', { page, page_size: 40 })),
};
