import { createSlice } from "@reduxjs/toolkit";
import { IBaseState } from "@types";
import { handleAsyncAction } from "@utils";
import { getGameAchievementsProcess, getGameAdditionProcess, getGameDetailProcess, getGameRedditPostsProcess, getGamesByGenreProcess, getGameScreenshotsProcess, getGameSeriesProcess, getGamesProcess, getGameTrailersProcess, searchGamesProcess } from "../actions/gameActions";

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
            state.data.getGameTrailersProcess = undefined;
            state.data.getGameAchievementsProcess = undefined;
            state.data.getGameRedditPostsProcess = undefined;
        },
        resetSearch: (state) => {
            state.data.searchGamesProcess = undefined;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGamesProcess.pending, (state) => {
            state.isLoading['getGamesProcess'] = true;
            state.error['getGamesProcess'] = undefined;
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
                        ...(state.data['getGamesProcess']?.results || []),
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

        builder.addCase(getGamesByGenreProcess.pending, (state) => {
            state.isLoading['getGamesByGenreProcess'] = true;
        });
        builder.addCase(getGamesByGenreProcess.fulfilled, (state, action) => {
            state.isLoading['getGamesByGenreProcess'] = false;
            const { page } = action.meta.arg;
            if (page === 1) {
                state.data['getGamesByGenreProcess'] = action.payload;
            } else {
                state.data['getGamesByGenreProcess'] = {
                    ...action.payload,
                    results: [...(state.data['getGamesByGenreProcess']?.results || []), ...action.payload.results]
                };
            }
        });
        builder.addCase(getGamesByGenreProcess.rejected, (state, action) => {
            state.isLoading['getGamesByGenreProcess'] = false;
            state.error['getGamesByGenreProcess'] = action.payload || action.error;
        });


        handleAsyncAction(builder, getGameDetailProcess, 'getGameDetailProcess');
        handleAsyncAction(builder, searchGamesProcess, 'searchGamesProcess');
        handleAsyncAction(builder, getGameScreenshotsProcess, 'getGameScreenshotsProcess');
        handleAsyncAction(builder, getGameTrailersProcess, 'getGameTrailersProcess');
        handleAsyncAction(builder, getGameAchievementsProcess, 'getGameAchievementsProcess');
        handleAsyncAction(builder, getGameSeriesProcess, 'getGameSeriesProcess');
        handleAsyncAction(builder, getGameAdditionProcess, 'getGameAdditionProcess');
        handleAsyncAction(builder, getGameRedditPostsProcess, 'getGameRedditPostsProcess');
    },
});

export const { resetGameDetail, resetSearch } = gameSlice.actions;
export default gameSlice.reducer;