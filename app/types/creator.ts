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

export interface ICreator {
    id: number;
    name: string;
    image: string;
    image_background: string;
    description: string;
    games_count: number;
    rating: string;
    positions: [];
}
