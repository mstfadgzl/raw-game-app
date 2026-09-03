import { IGameDetail, IGameListResponse } from "@types";

export interface IBaseState<T = any> {
    isLoading: { [key: string]: boolean };
    data: { [key: string]: T | any };
    error: { [key: string]: any };
    status: { [key: string]: 'idle' | 'loading' | 'success' | 'error' };
    message: { [key: string]: string | undefined };
}

export interface IGameState {
    isLoading: { [key: string]: boolean };
    data: {
        getGamesProcess?: IGameListResponse;
        getGameDetailProcess?: IGameDetail;
    };
    error: { [key: string]: any };
}