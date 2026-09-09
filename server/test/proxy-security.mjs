import test from 'node:test';
import assert from 'node:assert/strict';
import { getUpstreamUrl, redactApiKeys } from '../src/upstream-url.js';

const options = { baseUrl: 'https://api.rawg.io/api/', apiKey: 'server-secret', port: 3000 };

test('proxy resolves only relative RAWG paths and replaces client keys', () => {
  const url = getUpstreamUrl('/api/games?search=wit&key=client-key', options);
  assert.equal(url.origin, 'https://api.rawg.io');
  assert.equal(url.pathname, '/api/games');
  assert.equal(url.searchParams.get('search'), 'wit');
  assert.equal(url.searchParams.get('key'), 'server-secret');
});

test('proxy rejects absolute hosts, traversal and malformed paths', () => {
  for (const path of [
    '/api/https://evil.example/test',
    '/api//evil.example/test',
    '/api/games/../secrets',
    '/api/games/%2e%2e/secrets',
    '/api/games\\evil',
    '/private/health',
    '/api/',
  ]) {
    assert.equal(getUpstreamUrl(path, options), null, path);
  }
});

test('redaction removes API keys from nested next links without changing other data', () => {
  const result = redactApiKeys({
    next: 'https://api.rawg.io/api/games?page=2&key=server-secret',
    previous: null,
    results: [{ url: 'https://example.test/game?ref=rawg' }],
  });
  assert.equal(result.next, 'https://api.rawg.io/api/games?page=2');
  assert.equal(result.results[0].url, 'https://example.test/game?ref=rawg');
});
