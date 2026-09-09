import { IPaginatedResponse } from "@types";

export interface IStoreDetail {
    id: number;
    name: string;
    slug: string;
    domain: string;
    games_count: number;
    image_background: string;
}
export type IStoreResponse = IPaginatedResponse<IStoreDetail>;

export interface IGameStoreLink {
    id: number;
    game_id: number | string;
    store_id: number | string;
    url: string;
}
export type IGameStoreResponse = IPaginatedResponse<IGameStoreLink>;
