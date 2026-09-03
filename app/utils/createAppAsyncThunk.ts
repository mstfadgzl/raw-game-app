import { createAsyncThunk } from "@reduxjs/toolkit"


export const createAppAsyncThunk = <Returned, ThunkArg = void>(
    typePrefix: string,
    asyncFn: (arg: ThunkArg) => Promise<Returned>) => {
    return createAsyncThunk<Returned, ThunkArg>(
        typePrefix,
        async (arg: ThunkArg, { rejectWithValue }) => {
            try {
                return await asyncFn(arg);
            } catch (error: any) {
                return rejectWithValue(error);
            }
        }
    );
};