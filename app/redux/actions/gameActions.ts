import { createAsyncThunk } from "@reduxjs/toolkit";
import { IGameDetail, IGameListResponse } from "@types";
import { gameService } from "@services/index";

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