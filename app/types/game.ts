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

export interface IGame {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    metacritic: number;
    parent_platforms?: IParentPlatform[];
    platforms?: IPlatform[];
    genres?: IGenre[];
}

export interface IGameDetail extends IGame {
    description_raw: string;
    website: string;
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