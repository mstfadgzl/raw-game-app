export interface IParentPlatform {
    platform: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface IPlatform {
    platform: {
        id: number;
        name: string;
        slug: string;
        image_background?: string;
    };
    released_at?: string;
    requirements?: {
        minimum?: string;
        recommended?: string;
    };
}

export interface IGenre {
    id: number;
    name: string;
    slug: string;
    image_background: string;
    games_count: number;
}
export interface ITag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

export interface IGame {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    metacritic: number;
    added: number;
    parent_platforms?: IParentPlatform[];
    platforms?: IPlatform[];
    genres?: IGenre[];
}

export interface IGameDetail extends IGame {
    description_raw: string;
    achievement_count: number;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    metacritic_url: string;
    metacritic_platforms: {
        metascore: number;
        url: string,
        platform: {
            platform: number;
            name: string;
            slug: string;
        };
    }[];
    tags: ITag[];
    website: string;
    playtime: number;
    developers: {
        id: number;
        name: string;
        image_background: string;
    }[];
    publishers: {
        id: number;
        name: string;
        image_background: string;
    }[];
    stores: {
        id: number;
        store: {
            id: number;
            name: string;
            domain: string;
        };
    }[];
}

export interface IScreenshot {
    id: number;
    image: string;
    width: number;
    height: number;
}

export interface IGameListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IGame[];
}

export interface IScreenshotResponse {
    count: number;
    results: IScreenshot[];
}
export interface IGenreResponse {
    count: number;
    results: IGenre[];
}

export interface IGameState {
    isLoading: { [key: string]: boolean };
    data: {
        getGamesProcess?: IGameListResponse;
        getGameDetailProcess?: IGameDetail;
    };
    error: { [key: string]: any };
}
export interface ITrailer {
    id: number;
    name: string;
    preview: string;
    data: {
        480: string;
        max: string;
    };
}
export interface ITrailerResponse {
    count: number;
    results: ITrailer[];
}
export interface IAchievements {
    id: number;
    name: string;
    description: string;
    image: string;
}
export interface IAchievementsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IAchievements[];
}