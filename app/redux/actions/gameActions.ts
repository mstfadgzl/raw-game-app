import { createAsyncThunk } from "@reduxjs/toolkit";
import { IGameDetail, IGameListResponse, IScreenshotResponse } from "@types";
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