import { createSlice } from "@reduxjs/toolkit";
import { IBaseState } from "@types";
import { handleAsyncAction } from "@utils";
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
        builder.addCase(getGamesProcess.pending, (state) => {
            state.isLoading['getGamesProcess'] = true;
        });
        builder.addCase(getGamesProcess.fulfilled, (state, action) => {
            state.isLoading['getGamesProcess'] = false;
            state.status['getGamesProcess'] = 'success';
            const { page } = action.meta.arg;
            if (page === 1) {
                state.data['getGamesProcess'] = action.payload;
            } else {
                state.data['getGamesProcess'] = {
                    ...action.payload,
                    results: [
                        ...(state.data['getGameProcess']?.results || []),
                        ...action.payload.results
                    ]
                };
            }
        });
        builder.addCase(getGamesProcess.rejected, (state, action) => {
            state.isLoading['getGamesProcess'] = false;
            state.status['getGamesProcess'] = 'error';
            state.error['getGamesProcess'] = action.payload || action.error;
        });
        handleAsyncAction(builder, getGameDetailProcess, 'getGameDetailProcess');
        handleAsyncAction(builder, searchGamesProcess, 'searchGamesProcess');
        handleAsyncAction(builder, getGameScreenshotsProcess, 'getGameScreenshotsProcess');
    },
});

export const { resetGameDetail, resetSearch } = gameSlice.actions;
export default gameSlice.reducer;