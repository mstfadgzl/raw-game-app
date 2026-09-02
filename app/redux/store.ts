import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import genreReducer from './slices/genreSlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        genre: genreReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
