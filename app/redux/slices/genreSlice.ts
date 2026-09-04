import { createSlice } from '@reduxjs/toolkit';
import { getGenresProcess } from '../actions/genreActions';
import { IBaseState } from '../../types/redux';
import { handleAsyncAction } from '@utils';

const initialState: IBaseState = {
    isLoading: {},
    data: {},
    error: {},
    status: {},
    message: {},
};

export const genreSlice = createSlice({
    name: 'genre',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        handleAsyncAction(builder, getGenresProcess, 'getGenresProcess');
    },
});

export default genreSlice.reducer;