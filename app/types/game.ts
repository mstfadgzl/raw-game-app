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