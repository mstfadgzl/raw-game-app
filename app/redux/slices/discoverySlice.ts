import { createSlice } from "@reduxjs/toolkit";
import { IBaseState } from "@types";
import { handleAsyncAction } from "@utils";
import * as actions from "../actions/discoveryAction";


const initialState: IBaseState = {
    isLoading: {},
    data: {},
    error: {},
    status: {},
    message: {},
};

export const discoverySlice = createSlice({
    name: 'discovery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const discoveryListActions = [
            { thunk: actions.getPlatformsProcess, key: 'getPlatformsProcess' },
            { thunk: actions.getStoresProcess, key: 'getStoresProcess' },
            { thunk: actions.getTagsProcess, key: 'getTagsProcess' }
        ];
        discoveryListActions.forEach(({ thunk, key }) => {
            builder.addCase(thunk.pending, (state) => {

                state.isLoading[key] = true;
                state.error[key] = undefined;
            });
            builder.addCase(thunk.fulfilled, (state, action) => {
                state.isLoading[key] = false;
                const { page } = action.meta.arg as any;

                if (page === 1) {
                    state.data[key] = action.payload;
                } else {
                    state.data[key] = {
                        ...action.payload,
                        results: [...(state.data[key]?.results || []), ...action.payload.results]
                    };
                }
            });
            builder.addCase(thunk.rejected, (state, action) => {
                state.isLoading[key] = false;
                state.error[key] = action.payload || action.error;
            });

        });
        handleAsyncAction(builder, actions.getPlatfomrDetailProcess, 'getPlatformDetailProcess');
        handleAsyncAction(builder, actions.getTagDetailProcess, 'getTagDetailProcess');
    }
});

export default discoverySlice.reducer;