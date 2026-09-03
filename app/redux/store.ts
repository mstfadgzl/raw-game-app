import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import genreReducer from './slices/genreSlice';
import discoveryReducer from './slices/discoverySlice'
import entityReducer from './slices/entitySlice';

export const store = configureStore({
    reducer: {
        game: gameReducer,
        genre: genreReducer,
        discovery: discoveryReducer,
        entity: entityReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
