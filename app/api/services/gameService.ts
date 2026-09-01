import { IGameDetail, IGameListResponse } from "../../types";
import apiClient from '../client';

export const gameService = {
    getGames: async (page: number = 1, pageSize: number = 20):
        Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>('/games', {
            params: {
                page: page,
                page_size: pageSize,
            },
        });
        return response.data;
    },
    getGameDetail: async (id: number): Promise<IGameDetail> => {
        const response = await apiClient.get<IGameDetail>(`/games/${id}`,);
        return response.data;
    },
    searchGames: async (query: string): Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>('/games', {
            params: {
                search: query,
                search_precise: true,
            },
        });
        return response.data;
    },
    getGamesByGenre: async (genreSlug: string, page: number = 1):
        Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>('/games', {
            params: {
                genres: genreSlug,
                page: page,
            },
        });
        return response.data;
    },
};