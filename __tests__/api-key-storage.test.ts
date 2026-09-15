import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiKeyStorage } from '../app/services/api-key-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));
const read = AsyncStorage.getItem as jest.Mock;
beforeEach(() => jest.clearAllMocks());

it.each([null, 'not json', 'null', '{"key":123,"expiresAt":9999999999999}', '{"key":"test","expiresAt":"tomorrow"}'])('rejects invalid stored session %s', async raw => {
    read.mockResolvedValue(raw);
    expect(await apiKeyStorage.get()).toBeNull();
});
it('rejects expired keys and clears the record', async () => {
    read.mockResolvedValue(JSON.stringify({ key: 'test', expiresAt: Date.now() - 1 }));
    expect(await apiKeyStorage.get()).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalled();
});
it('handles storage failure without rejecting', async () => {
    read.mockRejectedValue(new Error('Unavailable'));
    expect(await apiKeyStorage.get()).toBeNull();
});
it('restores a valid key', async () => {
    read.mockResolvedValue(JSON.stringify({ key: ' test ', expiresAt: Date.now() + 10000 }));
    expect(await apiKeyStorage.get()).toBe('test');
});
