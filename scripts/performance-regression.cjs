const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, client, clock = Date, modules = new Map()) {
  const path = require('node:path');
  const absolute = path.resolve(file);
  if (modules.has(absolute)) return modules.get(absolute);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  modules.set(absolute, exports);
  const resolve = name => {
    if (name.endsWith('/client')) return { __esModule: true, default: client };
    if (!name.startsWith('.')) throw new Error('Unexpected dependency: ' + name);
    return load(path.resolve(path.dirname(absolute), name + '.ts'), client, clock, modules);
  };
  vm.runInNewContext(code, { exports, require: resolve, Date: clock, __DEV__: false, console });
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

test('detail is readable synchronously only while fresh', async () => {
  let now = 0;
  const { gameService: api } = load(serviceFile, { get: async () => ({ data: { id: 42, name: 'Detail' } }) }, { now: () => now });
  assert.equal(api.peekGameDetail(42), null);
  await api.getGameDetail(42);
  assert.equal(api.peekGameDetail(42).name, 'Detail');
  assert.equal(api.peekGameDetail(43), null);
  now = 300001;
  assert.equal(api.peekGameDetail(42), null);
});

test('screenshots share requests and remain isolated by game', async () => {
  let calls = 0;
  const { gameService: api } = load(serviceFile, { get: async () => { calls++; return response('shot'); } });
  await Promise.all([api.getGameScreenshots(1), api.getGameScreenshots(1)]);
  await api.getGameScreenshots(1);
  assert.equal(calls, 1);
  await api.getGameScreenshots(2);
  assert.equal(calls, 2);
});

test('profiles deduplicate requests, retain distinct identities and expire', async () => {
  let now = 0;
  const calls = [];
  const { entityService: api } = load('app/api/services/entityService.ts', { get: async url => {
    calls.push(url);
    return { data: { id: Number(url.split('/').pop()), name: url } };
  } }, { now: () => now });
  await Promise.all([api.getCreatorDetail(1), api.getCreatorDetail(1)]);
  await api.getCreatorDetail(1);
  assert.equal(calls.length, 1);
  await api.getCreatorDetail(2);
  await api.getDeveloperDetail(1);
  assert.equal(api.peekCreatorDetail(1).name, '/creators/1');
  assert.equal(api.peekCreatorDetail(2).name, '/creators/2');
  assert.equal(api.peekDeveloperDetail(1).name, '/developers/1');
  now = 300001;
  assert.equal(api.peekCreatorDetail(1), null);
  await api.getCreatorDetail(1);
  assert.equal(calls.length, 4);
});

test('profile refresh bypasses cache and an older response cannot overwrite it', async () => {
  const pending = [];
  const { entityService: api } = load('app/api/services/entityService.ts', {
    get: () => new Promise((resolve, reject) => pending.push({ resolve, reject })),
  });
  const old = api.getDeveloperDetail(7);
  const fresh = api.getDeveloperDetail(7, true);
  pending[1].resolve({ data: { id: 7, name: 'Fresh' } });
  await fresh;
  pending[0].resolve({ data: { id: 7, name: 'Old' } });
  await old;
  assert.equal(api.peekDeveloperDetail(7).name, 'Fresh');
  const failed = api.getDeveloperDetail(7, true);
  pending[2].reject(new Error('offline'));
  await assert.rejects(failed);
  assert.equal(api.peekDeveloperDetail(7), null);
});

test('manual refresh replaces cached filtered results', async () => {
  let calls = 0;
  const { gameService: api } = load(serviceFile, { get: async () => response(String(++calls)) });
  for (const filter of [{ platforms: 4 }, { genres: 'action' }, { tags: 'singleplayer' }]) {
    const params = { page: 1, ...filter };
    const before = await api.getGames(params);
    const after = await api.getGames({ ...params, forceRefresh: true });
    assert.notEqual(before.results[0].name, after.results[0].name);
    assert.equal((await api.getGames(params)).results[0].name, after.results[0].name);
  }
  assert.equal(calls, 6);
});

test('incorrect profile identities are rejected and never cached', async () => {
  let calls = 0;
  const { entityService: api } = load('app/api/services/entityService.ts', {
    get: async () => ({ data: { id: ++calls === 1 ? 99 : 7, name: 'Profile' } }),
  });
  await assert.rejects(api.getCreatorDetail(7));
  assert.equal(api.peekCreatorDetail(7), null);
  await api.getCreatorDetail(7);
  assert.equal(api.peekCreatorDetail(7).id, 7);
  assert.equal(calls, 2);
});
