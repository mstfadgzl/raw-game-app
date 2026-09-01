import { createAsyncThunk } from "@reduxjs/toolkit";
import { genreService } from "@services/index";

export const getGenresProcess = createAsyncThunk(
    'genre/getGenresProcess',
    async (_, { rejectWithValue }) => {
        try {
            return await genreService.getGenres();
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);