import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBaseState, IGame } from "@types";
import { handleAsyncAction } from "@utils";
import {
    getGameAchievementsProcess,
    getGameAdditionProcess,
    getGameDetailProcess,
    getGameRedditPostsProcess,
    getGamesByGenreProcess,
    getGameScreenshotsProcess,
    getGameSeriesProcess,
    getGamesProcess,
    getGameTrailersProcess,
    searchGamesProcess
} from "../actions/gameActions";

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
        },
        toggleFavorite: (state, action: PayloadAction<IGame>) => {
            const game = action.payload;
            if (!state.data.favorites) {
                state.data.favorites = [];
            }
            const isFavorite = state.data.favorites.some((f: any) => f.id === game.id);
            if (isFavorite) {
                state.data.favorites = state.data.favorites.filter((f: any) => f.id !== game.id);
            } else {
                state.data.favorites.push(game);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGamesProcess.pending, (state, action) => {
            const firstPage = action.meta.arg.page === 1;

            state.isLoading['getGamesProcess'] = firstPage;
            state.isLoading['getGamesMoreLoading'] = !firstPage;

            state.status['getGamesProcess'] = 'loading';
            state.error['getGamesProcess'] = undefined;
        });
        builder.addCase(getGamesProcess.fulfilled, (state, action) => {
            state.isLoading['getGamesProcess'] = false;
            state.isLoading['getGamesMoreLoading'] = false;
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
            state.isLoading['getGamesMoreLoading'] = false;
            state.status['getGamesProcess'] = 'error';
            state.error['getGamesProcess'] = action.payload || action.error;
        });


        //// GENRES


        builder.addCase(getGamesByGenreProcess.pending, (state, action) => {
            const { page } = action.meta.arg;

            if (page === 1) {
                state.isLoading['getGamesByGenreProcess'] = true;
            } else {
                state.isLoading['getGamesByGenreProcess'] = false;
                state.isLoading['getGamesByGenreMoreLoading'] = true;
            }
            state.error['getGamesByGenreProcess'] = undefined;
        });

        builder.addCase(getGamesByGenreProcess.fulfilled, (state, action) => {
            state.isLoading['getGamesByGenreProcess'] = false;
            state.isLoading['getGamesByGenreMoreLoading'] = false;

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
            state.isLoading['getGamesByGenreMoreLoading'] = false;
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

export const { resetGameDetail, resetSearch, toggleFavorite } = gameSlice.actions;
export default gameSlice.reducer;