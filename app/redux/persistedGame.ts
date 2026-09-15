import type { IGame } from '../types/game';

// Keep compatibility with older storage while discarding corrupt and duplicate entries.
export const favoritesOnlyState = (state: unknown): { data: { favorites: IGame[] } } => {
    const saved = state as { data?: { favorites?: unknown } } | null;
    const items = Array.isArray(saved?.data?.favorites) ? saved.data.favorites : [];
    const favorites = new Map<number, IGame>();
    for (const item of items) {
        if (item && Number.isInteger(item.id) && item.id > 0 && typeof item.name === 'string') {
            favorites.set(item.id, item as IGame);
        }
    }
    return { data: { favorites: [...favorites.values()] } };
};
