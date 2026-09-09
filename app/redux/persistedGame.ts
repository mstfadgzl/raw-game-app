import type { IBaseState, IGame } from '../types';

// Accept both legacy full game state and the new favorites-only storage format.
export const favoritesOnlyState = (state: unknown): IBaseState => {
    const saved = state as { data?: { favorites?: IGame[] } } | null;
    return {
        data: { favorites: Array.isArray(saved?.data?.favorites) ? saved.data.favorites : [] },
        isLoading: {},
        error: {},
        status: {},
        message: {},
    };
};
