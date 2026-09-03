import { createSlice } from "@reduxjs/toolkit";
import { IBaseState } from "@types";
import { handleAsyncAction } from "@utils";
import * as actions from "../actions/entityAction";

const initialState: IBaseState = {
    isLoading: {}, data: {}, error: {}, status: {}, message: {},
};

export const entitySlice = createSlice({
    name: 'entity',
    initialState,
    reducers: {
        resetEntityDetail: (state) => {
            state.data.getCreatorDetailProcess = undefined;
            state.data.getDeveloperDetailProcess = undefined;
            state.data.getPublisherDetailProcess = undefined;
        }
    },
    extraReducers: (builder) => {
        const listActions = [
            { thunk: actions.getCreatorsProcess, key: 'getCreatorsProcess' },
            { thunk: actions.getDevelopersProcess, key: 'getDevelopersProcess' },
            { thunk: actions.getPublishersProcess, key: 'getPublishersProcess' }
        ];
        listActions.forEach(({ thunk, key }) => {

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
        handleAsyncAction(builder, actions.getCreatorDetailProcess, 'getCreatorDetailProcess');
        handleAsyncAction(builder, actions.getDeveloperDetailProcess, 'getDeveloperDetailProcess');
        handleAsyncAction(builder, actions.getPublisherDetailProcess, 'getPublisherDetailProcess');
    }
});

export const { resetEntityDetail } = entitySlice.actions;
export default entitySlice.reducer;