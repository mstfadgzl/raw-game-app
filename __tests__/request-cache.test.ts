import apiClient from '../app/api/client';
import { cachedGet } from '../app/api/request-cache';

jest.mock('../app/api/client', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

const get = apiClient.get as jest.Mock;

beforeEach(() => get.mockReset());
afterEach(() => jest.restoreAllMocks());

it('allows retry after a failed game request', async () => {
    get.mockRejectedValueOnce(new Error('Network unavailable'));
    await expect(cachedGet('/games', { genres: 'action' })).rejects.toThrow('Network unavailable');
    const data = { results: [{ id: 1 }], next: null };
    get.mockResolvedValueOnce({ data });
    await expect(cachedGet('/games', { genres: 'action' })).resolves.toEqual(data);
    expect(get).toHaveBeenCalledTimes(2);
});

it('shares pending requests and caches the successful result', async () => {
    const data = { results: [{ id: 2 }] };
    get.mockResolvedValueOnce({ data });
    const params = { tags: 'open-world' };
    await expect(Promise.all([
        cachedGet('/games', params), cachedGet('/games', params),
    ])).resolves.toEqual([data, data]);
    await expect(cachedGet('/games', params)).resolves.toEqual(data);
    expect(get).toHaveBeenCalledTimes(1);
});

it('returns stale data immediately while one background request refreshes it', async () => {
    const now = Date.now();
    const clock = jest.spyOn(Date, 'now').mockReturnValue(now);
    const oldData = { id: 301, name: 'Old title' };
    get.mockResolvedValueOnce({ data: oldData });
    await cachedGet('/games/301');
    clock.mockReturnValue(now + 6 * 60 * 1000);
    let resolve!: (value: unknown) => void;
    get.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    await expect(cachedGet('/games/301')).resolves.toEqual(oldData);
    await expect(cachedGet('/games/301')).resolves.toEqual(oldData);
    expect(get).toHaveBeenCalledTimes(2);
    resolve({ data: { id: 301, name: 'Updated title' } });
    await Promise.resolve();
    await expect(cachedGet('/games/301')).resolves.toEqual({ id: 301, name: 'Updated title' });
});

it('retains usable data if background refresh fails, but expires old entries', async () => {
    const now = Date.now();
    const clock = jest.spyOn(Date, 'now').mockReturnValue(now);
    const data = { id: 302 };
    get.mockResolvedValueOnce({ data });
    await cachedGet('/games/302');
    clock.mockReturnValue(now + 6 * 60 * 1000);
    get.mockRejectedValue(new Error('Offline'));
    await expect(cachedGet('/games/302')).resolves.toEqual(data);
    await Promise.resolve();
    await expect(cachedGet('/games/302')).resolves.toEqual(data);
    await Promise.resolve();
    clock.mockReturnValue(now + 36 * 60 * 1000);
    await expect(cachedGet('/games/302')).rejects.toThrow('Offline');
});

it('explicit refresh bypasses cached data', async () => {
    get.mockResolvedValueOnce({ data: { id: 303, name: 'Old' } });
    await cachedGet('/games/303');
    get.mockResolvedValueOnce({ data: { id: 303, name: 'New' } });
    await expect(cachedGet('/games/303', {}, { forceRefresh: true }))
        .resolves.toEqual({ id: 303, name: 'New' });
});
