import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAchievementResponse, IGameDetail, IGameListResponse, IRedditResponse, IScreenshotResponse, ITrailerResponse } from "@types";
import { gameService, screenshotService } from "@services";
import { createAppAsyncThunk } from "@utils";


export const getGamesProcess = createAsyncThunk<
    IGameListResponse,
    { page: number; platforms?: number; genres?: string }>(
        'game/getGamesProcess',
        async (params, { rejectWithValue }) => {
            try {
                // gameService.getGames'e tüm params objesini gönderiyoruz
                return await gameService.getGames(
                    params.page,
                    20,
                    params.platforms,
                    params.genres
                );
            } catch (error: any) {
                return rejectWithValue(error);
            }
        }
    );

export const getGameDetailProcess = createAsyncThunk<IGameDetail, number>(
    'game/getGameDetailProcess',
    async (id, { rejectWithValue }) => {
        try {
            return await gameService.getGameDetail(id);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    },
);

export const searchGamesProcess = createAsyncThunk<IGameListResponse, string>(
    'game/searchGamesProcess',
    async (query, { rejectWithValue }) => {
        try {
            return await gameService.searchGames(query);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const getGameScreenshotsProcess = createAsyncThunk<IScreenshotResponse, number>(
    'game/getGameScreenshotsProcess',
    async (id, { rejectWithValue }) => {
        try {
            return await screenshotService.getGameScreenshots(id);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);
export const getGamesByGenreProcess = createAppAsyncThunk<IGameListResponse, { genreSlug: string, page: number }>(
    'game/getGamesByGenreProcess',
    ({ genreSlug, page }) => gameService.getGamesByGenre(genreSlug, page)
);


export const getGameTrailersProcess = createAsyncThunk<ITrailerResponse, number>(
    'game/getGameTrailerProcess',
    async (id, { rejectWithValue }) => {
        try {
            return await gameService.getGameTrailers(id);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);
export const getGameAchievementsProcess = createAsyncThunk<IAchievementResponse, number>(
    'game/getGameAchievementProcess',
    async (id, { rejectWithValue }) => {
        try {
            return await gameService.getGameAchievements(id);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);
export const getGameSeriesProcess = createAppAsyncThunk<IGameListResponse, number>(
    'game/getGameSeriesProcess',
    (id) => gameService.getGameSeries(id)
);
export const getGameAdditionProcess = createAppAsyncThunk<IGameListResponse, number>(
    'game/getGameAdditionProcess',
    (id) => gameService.getGameSeries(id)
);
export const getGameRedditPostsProcess = createAppAsyncThunk<IRedditResponse, { id: number, page: number }>(
    'game/getGameRedditPostsProcess',
    ({ id, page }) => gameService.getGameRedditPosts(id, page)
);
