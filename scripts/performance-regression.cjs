const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, client, clock = Date) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: () => ({ __esModule: true, default: client }), Date: clock, __DEV__: false, console });
  return exports;
}
const serviceFile = 'app/api/services/gameService.ts';
const response = name => ({ data: { results: [{ id: 1, name }], next: null } });

test('same request shares network work; cached reads avoid network; filters remain separate', async () => {
  let calls = 0;
  const { gameService: api } = load(serviceFile, { get: async () => { calls++; return response('game'); } });
  await Promise.all([api.getGames({ page: 1 }), api.getGames({ page: 1 })]);
  await api.getGames({ page: 1 });
  assert.equal(calls, 1);
  await api.getGames({ page: 1, genres: 'action' });
  assert.equal(calls, 2);
});

test('forced refresh wins even when the older request finishes later', async () => {
  const pending = [];
  const { gameService: api } = load(serviceFile, { get: () => new Promise(resolve => pending.push(resolve)) });
  const old = api.getGames({ page: 1 });
  const fresh = api.getGames({ page: 1, forceRefresh: true });
  assert.equal(pending.length, 2);
  pending[1](response('fresh'));
  await fresh;
  pending[0](response('old'));
  await old;
  assert.equal((await api.getGames({ page: 1 })).results[0].name, 'fresh');
});

test('expired data is fetched again and errors are not cached', async () => {
  let now = 0, calls = 0;
  const { gameService: api } = load(serviceFile, { get: async () => {
    calls++;
    if (calls === 1) throw new Error('offline');
    return response('game');
  } }, { now: () => now });
  await assert.rejects(api.getGames({ page: 1 }));
  await api.getGames({ page: 1 });
  now = 300001;
  await api.getGames({ page: 1 });
  assert.equal(calls, 3);
});

test('cache retains at most 80 responses', async () => {
  let calls = 0;
  const { gameService: api } = load(serviceFile, { get: async () => { calls++; return response('game'); } });
  for (let page = 1; page <= 81; page++) await api.getGames({ page });
  await api.getGames({ page: 1 });
  assert.equal(calls, 82);
});

test('legacy persistence keeps favorites and removes transient API/loading data', () => {
  const { favoritesOnlyState } = load('app/redux/persistedGame.ts');
  const favorites = [{ id: 42, name: 'Favorite' }];
  const old = { data: { favorites, getGamesProcess: { results: Array(1000).fill({ name: 'Game' }) } }, isLoading: { games: true }, error: { games: 'offline' } };
  const clean = favoritesOnlyState(old);
  assert.equal(clean.data.favorites, favorites);
  assert.equal(clean.data.getGamesProcess, undefined);
  assert.equal(Object.keys(clean.isLoading).length, 0);
  assert.equal(Object.keys(clean.error).length, 0);
  assert.equal(JSON.stringify(favoritesOnlyState(clean)), JSON.stringify(clean));
  assert.ok(JSON.stringify(clean).length < JSON.stringify(old).length / 10);
  assert.equal(favoritesOnlyState(null).data.favorites.length, 0);
});


test('card thumbnails resize RAWG originals without rewriting other URLs', () => {
  const { cardImageUrl } = load('app/utils/card-image.ts');
  const original = 'https://media.rawg.io/media/games/abc/cover.jpg';
  assert.equal(cardImageUrl(original), 'https://media.rawg.io/media/resize/420/-/games/abc/cover.jpg');
  const resized = 'https://media.rawg.io/media/resize/200/-/games/abc/cover.jpg';
  assert.equal(cardImageUrl(resized), resized);
  assert.equal(cardImageUrl(original + '?signature=example'), original + '?signature=example');
  assert.equal(cardImageUrl('https://example.com/media/cover.jpg'), 'https://example.com/media/cover.jpg');
  assert.equal(cardImageUrl(null), '');
});
