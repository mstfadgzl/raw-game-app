export type Page<T> = { results: T[]; next?: string | null };
export type PageState<T> = {
    items: T[];
    loading: boolean;
    error: boolean;
    hasMore: boolean;
};

// Her arama/profil kendi oturumuna sahiptir; kapanan oturum sonuç yayınlayamaz.
export function createPaginatedList<T extends { id: number }>(
    fetchPage: (page: number) => Promise<Page<T>>,
    onChange: (state: PageState<T>) => void,
) {
    let state: PageState<T> = { items: [], loading: false, error: false, hasMore: true };
    let page = 0;
    let active = true;

    const load = async (retry = false) => {
        if (!active || state.loading || !state.hasMore || (state.error && !retry)) return;
        state = { ...state, loading: true, error: false };
        onChange(state);
        try {
            const response = await fetchPage(page + 1);
            if (!Array.isArray(response.results)) throw new Error('Geçersiz oyun listesi');
            if (!active) return;
            const unique = new Map(state.items.map(item => [item.id, item]));
            response.results.forEach(item => unique.set(item.id, item));
            page += 1;
            state = { items: [...unique.values()], loading: false, error: false, hasMore: Boolean(response.next) };
        } catch {
            if (!active) return;
            state = { ...state, loading: false, error: true };
        }
        onChange(state);
    };

    return { load, dispose: () => { active = false; } };
}
