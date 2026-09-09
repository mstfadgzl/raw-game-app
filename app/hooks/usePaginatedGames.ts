import { useEffect, useRef, useState } from 'react';
import type { IGame } from '@types';
import { createPaginatedList, type Page, type PageState } from '../utils/paginated-list';

type Loader = (page: number) => Promise<Page<IGame>>;
const empty: PageState<IGame> = { items: [], loading: false, error: false, hasMore: false };

// Loader useCallback ile sabit tutulmalı; değiştiğinde liste ilk sayfadan başlar.
export function usePaginatedGames(loader: Loader | null) {
    const [result, setResult] = useState<{ loader: Loader | null; state: PageState<IGame> }>({ loader: null, state: empty });
    const session = useRef<ReturnType<typeof createPaginatedList<IGame>> | null>(null);

    useEffect(() => {
        if (!loader) {
            session.current = null;
            return;
        }
        const current = createPaginatedList(loader, state => setResult({ loader, state }));
        session.current = current;
        void current.load();
        return () => {
            current.dispose();
            session.current = null;
        };
    }, [loader]);

    const state = result.loader === loader ? result.state : { ...empty, loading: Boolean(loader) };
    return {
        ...state,
        loadMore: () => { if (result.loader === loader) void session.current?.load(); },
        retry: () => { if (result.loader === loader) void session.current?.load(true); },
    };
}
