import { createSlice } from "@reduxjs/toolkit";
import { IBaseState } from "@types";
import { handleAsyncAction } from "@utils/reduxHelper";
import { getGameDetailProcess, getGamesProcess } from "../actions/gameActions";

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
        resetGame: (state) => {
            Object.assign(state, initialState);
        },
        clearErrors: (state) => {
            state.error = {};
        },
    },
    extraReducers: (builder) => {
        handleAsyncAction(builder, getGamesProcess, 'getGameProcess');
        handleAsyncAction(builder, getGameDetailProcess, 'getGameDetailProcess');
    },
});

export const { resetGame, clearErrors } = gameSlice.actions;
export default gameSlice.reducer;