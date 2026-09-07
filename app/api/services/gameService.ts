import { IAchievementResponse, IGameDetail, IGameListResponse, IRedditResponse, ITrailer, ITrailerResponse } from "../../types";
import apiClient from '../client';

export const gameService = {
    getGames: async (params: {
        page: number,
        pageSize?: number,
        platforms?: number,
        genres?: string,
        ordering?: string,
        dates?: string,
    }): Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>('/games', {
            params: {
                page: params.page || 1,
                page_size: params.pageSize || 20,
                platforms: params.platforms,
                genres: params.genres,
                ordering: params.ordering,
                dates: params.dates,
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
    getGameTrailers: async (id: number): Promise<ITrailerResponse> => {
        const response = await apiClient.get<ITrailerResponse>(`/games/${id}/movies`);
        return response.data;
    },
    getGameAchievements: async (id: number, page: number = 1): Promise<IAchievementResponse> => {
        const response = await apiClient.get<IAchievementResponse>(`/games/${id}/achievements`, {
            params: { page }
        });
        return response.data;
    },
    getGameSeries: async (id: number): Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>(`/games/${id}/game-series`);
        return response.data;
    },
    getGameAddition: async (id: number): Promise<IGameListResponse> => {
        const response = await apiClient.get<IGameListResponse>(`/games/${id}/additions`);
        return response.data;
    },
    getGameRedditPosts: async (id: number, page: number = 1): Promise<IRedditResponse> => {
        const response = await apiClient.get<IRedditResponse>(`/games/${id}/reddit`, {
            params: { page }
        });
        return response.data;
    },
};