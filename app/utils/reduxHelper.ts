import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const handleAsyncAction = (
    builder: ActionReducerMapBuilder<any>,
    thunk: any,
    key: string,
) => {
    builder
        .addCase(thunk.pending, (state) => {
            state.isLoading = { ...state.isLoading, [key]: true };
            state.status = { ...state.status, [key]: 'loading' };
        })
        .addCase(thunk.fulfilled, (state, action) => {
            state.isLoading = { ...state.isLoading, [key]: false };
            state.status = { ...state.status, [key]: 'success' };
            state.data = { ...state.data, [key]: action.payload };
            state.message = { ...state.message, [key]: action.payload?.message || 'Success' };
        })
        .addCase(thunk.rejected, (state, action) => {
            state.isLoading = { ...state.isLoading, [key]: false };
            state.status = { ...state.status, [key]: 'error' };
            state.error = { ...state.error, [key]: action.payload || action.error };
        });
};