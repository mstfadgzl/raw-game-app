export type GameOrdering =
    | '-added'
    | '-rating'
    | '-metacritic'
    | '-released'
    | 'released'
    | 'name'
    | '-name';

export type ReleaseStatus = 'released' | 'upcoming' | 'all';

export interface GameFilterValue {
    ordering: GameOrdering;
    releaseStatus: ReleaseStatus;
    startYear: number | null;
    endYear: number | null;
    minMetacritic: number | null;
}

export interface GameFilterQuery {
    ordering: GameOrdering;
    dates?: string;
    metacritic?: string;
}

export const DEFAULT_GAME_FILTERS: GameFilterValue = {
    ordering: '-added',
    releaseStatus: 'released',
    startYear: null,
    endYear: null,
    minMetacritic: null,
};

export const SORT_OPTIONS: ReadonlyArray<{
    value: GameOrdering;
    label: string;
}> = [
        { value: '-added', label: 'Popüler' },
        { value: '-rating', label: 'Oyuncu puanı' },
        { value: '-metacritic', label: 'Metacritic' },
        { value: '-released', label: 'En yeni' },
        { value: 'released', label: 'En eski' },
        { value: 'name', label: 'İsim: A–Z' },
        { value: '-name', label: 'İsim: Z–A' },
    ];

export const RELEASE_OPTIONS: ReadonlyArray<{
    value: ReleaseStatus;
    label: string;
}> = [
        { value: 'released', label: 'Çıkmış oyunlar' },
        { value: 'upcoming', label: 'Gelecek oyunlar' },
        { value: 'all', label: 'Tümü' },
    ];

export const SCORE_OPTIONS: ReadonlyArray<{
    value: number | null;
    label: string;
}> = [
        { value: null, label: 'Sınır yok' },
        { value: 60, label: '60+' },
        { value: 70, label: '70+' },
        { value: 80, label: '80+' },
        { value: 90, label: '90+' },
    ];