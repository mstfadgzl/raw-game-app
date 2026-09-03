import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAchievementResponse, IGameDetail, IGameListResponse, IScreenshotResponse, ITrailerResponse } from "@types";
import { gameService, screenshotService } from "@services";

export const getGamesProcess = createAsyncThunk<IGameListResponse, { page: number }>(
    'game/getGamesProcess',
    async ({ page }, { rejectWithValue }) => {
        try {
            return await gameService.getGames(page);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    },
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
export const getGameAdditionProcess = createAsyncThunk<IGameListResponse, number>(
    'game/getGameAdditionProcess',
    async (id, { rejectWithValue }) => {
        try {
            return await gameService.getGameSeries(id);
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);