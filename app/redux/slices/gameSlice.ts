import { createSlice } from "@reduxjs/toolkit";
import { IBaseState } from "@types";
import { handleAsyncAction } from "@utils/reduxHelper";
import { getGameDetailProcess, getGameScreenshotsProcess, getGamesProcess, searchGamesProcess } from "../actions/gameActions";

const initialState: IBaseState = {
    isLoading: {},
    data: {},
    error: {},
    status: {},
    message: {},
};
export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetGameDetail: (state) => {
            state.data.getGameDetailProcess = undefined;
            state.data.getGameScreenshotsProcess = undefined;
        },
        resetSearch: (state) => {
            state.data.searchGamesProcess = undefined;
        }
    },
    extraReducers: (builder) => {
        handleAsyncAction(builder, getGamesProcess, 'getGamesProcess');
        handleAsyncAction(builder, getGameDetailProcess, 'getGameDetailProcess');
        handleAsyncAction(builder, searchGamesProcess, 'searchGamesProcess');
        handleAsyncAction(builder, getGameScreenshotsProcess, 'getGameScreenshotsProcess');
    },
});

export const { resetGameDetail, resetSearch } = gameSlice.actions;
export default gameSlice.reducer;