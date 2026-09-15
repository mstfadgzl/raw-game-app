import { buildGameFilterQuery, validateGameFilters } from '../app/utils/game-sort-filter';
import { DEFAULT_GAME_FILTERS } from '../app/types/game-sort-filter';
const today = new Date(2026, 8, 15);
it('limits released games to today', () => {
    expect(buildGameFilterQuery({ ...DEFAULT_GAME_FILTERS, releaseStatus: 'released', startYear: 2020, endYear: 2028 }, today).dates)
        .toBe('2020-01-01,2026-09-15');
});
it('rejects inverted ranges and invalid scores', () => {
    expect(validateGameFilters({ ...DEFAULT_GAME_FILTERS, startYear: 2025, endYear: 2024 }, today)).not.toBeNull();
    expect(validateGameFilters({ ...DEFAULT_GAME_FILTERS, minMetacritic: 101 }, today)).not.toBeNull();
});
