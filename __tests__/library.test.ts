import reducer, { toggleFavorite } from '../app/redux/slices/gameSlice';
import { favoritesOnlyState } from '../app/redux/persistedGame';
import type { IGame } from '../app/types/game';
const game = { id: 1, name: 'The Witcher' } as IGame;

it('adds and removes a favorite without duplication', () => {
    const saved = reducer(undefined, toggleFavorite(game));
    expect(saved.data.favorites).toEqual([game]);
    expect(reducer(saved, toggleFavorite(game)).data.favorites).toEqual([]);
});
it('does not duplicate request results in the library state', () => {
    const state = reducer(undefined, { type: 'init' });
    expect(reducer(state, { type: 'game/getGamesProcess/fulfilled', payload: { results: [game] } })).toBe(state);
});
it('keeps existing favorites while removing transient API data and invalid records', () => {
    expect(favoritesOnlyState({ data: { favorites: [game, null, {}, game], getGamesProcess: { results: [] } }, isLoading: { request: true } }))
        .toEqual({ data: { favorites: [game] } });
    expect(favoritesOnlyState(null)).toEqual({ data: { favorites: [] } });
});
