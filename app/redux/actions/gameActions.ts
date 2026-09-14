import { createAsyncThunk } from "@reduxjs/toolkit";
import { AchievementParams, IAchievementResponse, IGameListResponse, IRedditResponse, IScreenshotResponse, ITrailerResponse } from "@types";
import { gameService } from "@services";
import { createAppAsyncThunk } from "@utils";


export const getGamesProcess = createAsyncThunk<
    IGameListResponse,
    {
        page: number;
        pageSize?: number;
        ordering?: string;
        platforms?: number;
        genres?: string;
        tags?: string;
        dates?: string;
        forceRefresh?: boolean;
        metacritic?: string;
        creators?: string;
    },
    {
        rejectValue: string;
    }
>(
    'game/getGamesProcess',
    async (params, { rejectWithValue }) => {
        try {
            return await gameService.getGames(params);
        } catch {
            return rejectWithValue(
                'Oyunlar yüklenemedi. Lütfen tekrar deneyin.',
            );
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
            return await gameService.getGameScreenshots(id);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
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
export const getGameAchievementsProcess = createAsyncThunk<IAchievementResponse, AchievementParams>(
    'game/getGameAchievementProcess',
    async ({ id, page }, { rejectWithValue }) => {
        try {
            return await gameService.getGameAchievements(id, page);
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
    id => gameService.getGameAddition(id)
);
export const getGameRedditPostsProcess = createAppAsyncThunk<IRedditResponse, { id: number, page: number }>(
    'game/getGameRedditPostsProcess',
    ({ id, page }) => gameService.getGameRedditPosts(id, page)
);
