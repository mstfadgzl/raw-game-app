import { createSlice } from '@reduxjs/toolkit';
import type { IBaseState } from '../../types/redux';
import { handleAsyncAction } from '../../utils/reduxHelper';
import { getPlatformsProcess } from '../actions/discoveryAction';

const initialState: IBaseState = { data: {}, isLoading: {}, error: {}, status: {}, message: {} };

const discoverySlice = createSlice({
    name: 'discovery',
    initialState,
    reducers: {},
    extraReducers: builder => {
        handleAsyncAction(builder, getPlatformsProcess, 'getPlatformsProcess');
    },
});
export default discoverySlice.reducer;
