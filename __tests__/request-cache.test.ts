import apiClient from '../app/api/client';
import { cachedGet } from '../app/api/request-cache';

jest.mock('../app/api/client', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

const get = apiClient.get as jest.Mock;

beforeEach(() => get.mockReset());

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
