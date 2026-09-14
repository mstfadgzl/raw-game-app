import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IGame } from '../../types/game';

type GameState = { data: { favorites: IGame[] } };
const initialState: GameState = { data: { favorites: [] } };

// Request results belong to their screens and the API cache. Only the library is shared.
export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<IGame>) => {
            const game = action.payload;
            if (!Number.isInteger(game.id) || game.id <= 0) return;
            const index = state.data.favorites.findIndex(item => item.id === game.id);
            if (index >= 0) state.data.favorites.splice(index, 1);
            else state.data.favorites.push(game);
        },
    },
});

export const { toggleFavorite } = gameSlice.actions;
export default gameSlice.reducer;
