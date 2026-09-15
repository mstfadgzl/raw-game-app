import {
    IAchievementResponse,
    IGameDetail,
    IGameListResponse,
    IRedditResponse,
    ITrailerResponse,
    IScreenshotResponse,
    IGamePersonResponse,
} from '../../types';

import { cachedGet, peekCached } from '../request-cache';

export interface GetGamesParams {
    page: number;
    pageSize?: number;
    platforms?: number;
    genres?: string;
    tags?: string;
    ordering?: string;
    dates?: string;
    metacritic?: string;
    forceRefresh?: boolean;
    creators?: string;
}

export const gameService = {
    getGameScreenshots: (id: number): Promise<IScreenshotResponse> =>
        cachedGet<IScreenshotResponse>(`/games/${id}/screenshots`),
    peekGameDetail: (id: number): IGameDetail | null =>
        peekCached<IGameDetail>(`/games/${id}`),
    getCompanyGames: (id: number, page: number, ordering: '-added' | '-metacritic', kind: 'developer' | 'publisher' = 'developer'): Promise<IGameListResponse> =>
        cachedGet<IGameListResponse>('/games', { [kind === 'publisher' ? 'publishers' : 'developers']: id, page, page_size: 20, ordering }),
    getGames: async (
        params: GetGamesParams,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>(
            '/games',
            {

                    page: params.page,
                    page_size: params.pageSize ?? 20,
                    platforms: params.platforms,
                    genres: params.genres,
                    tags: params.tags,
                    ordering: params.ordering,
                    dates: params.dates,
                    metacritic: params.metacritic,
                    creators: params.creators,
            },
            { forceRefresh: params.forceRefresh },
        );
    },

    getGameDetail: (
        id: number,
    ): Promise<IGameDetail> => {
        return cachedGet<IGameDetail>(`/games/${id}`);
    },
    getGameDevelopmentTeam: (id: number, page: number = 1): Promise<IGamePersonResponse> =>
        cachedGet<IGamePersonResponse>(`/games/${id}/development-team`, { page, page_size: 40 }),

    searchGames: (
        query: string,
        page: number = 1,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>('/games', {
            search: query.trim(),
            search_precise: false,
            search_exact: false,
            ordering: '-added',
            page,
            page_size: 20,
        });
    },

    getGameTrailers: (
        id: number,
    ): Promise<ITrailerResponse> => {
        return cachedGet<ITrailerResponse>(
            `/games/${id}/movies`,
        );
    },

    getGameAchievements: (
        id: number | string,
        page: number = 1,
        pageSize: number = 40,
    ): Promise<IAchievementResponse> => {
        return cachedGet<IAchievementResponse>(
            `/games/${id}/achievements`,
            {
                page,
                page_size: pageSize,
            },
        );
    },

    getGameSeries: (
        id: number,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>(
            `/games/${id}/game-series`,
        );
    },

    getGameAddition: (
        id: number,
    ): Promise<IGameListResponse> => {
        return cachedGet<IGameListResponse>(
            `/games/${id}/additions`,
        );
    },

    getGameRedditPosts: (
        id: number,
        page: number = 1,
    ): Promise<IRedditResponse> => {
        return cachedGet<IRedditResponse>(
            `/games/${id}/reddit`,
            { page },
        );
    },
};
