import { combineReducers, configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import genreReducer from './slices/genreSlice';
import discoveryReducer from './slices/discoverySlice'
import entityReducer from './slices/entitySlice';
import { favoritesOnlyState } from './persistedGame';
import AsyncStorage from '@react-native-async-storage/async-storage';;
import {
    persistStore,
    persistReducer,
    createTransform,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';




const rootReducer = combineReducers({
    game: gameReducer,
    genre: genreReducer,
    discovery: discoveryReducer,
    entity: entityReducer
});
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['game'],
    transforms: [createTransform(favoritesOnlyState, favoritesOnlyState, { whitelist: ['game'] })],
};
const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
