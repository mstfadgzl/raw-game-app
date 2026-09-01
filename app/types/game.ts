export interface IGame {
    id: number,
    slug: string,
    name: string,
    relased: Date,
    bacground_image: string,
    rating: number,
    metacritic: number,
}

export interface IGameListResponse {
    count: number,
    next: string,
    results: IGame[],
}

export interface IGameDetail {
    description: string,
    website: string,
    developers: [],
    publisher: [],
    stores: [],
}
export interface IScreenshot {
    id: number,
    image: string,
    width: number,
    height: number,
}
export interface IScreenshotResponse {
    results: IScreenshot[],
}
export interface IGenre {
    id: number,
    name: string,
    image_bacground: string,
    games_count: number,
}