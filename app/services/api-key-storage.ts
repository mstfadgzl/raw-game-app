import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@rawg/api-key-session';
const KEY_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredApiKey = {
    key: string;
    expiresAt: number;
};

export const apiKeyStorage = {
    async get(): Promise<string | null> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const session = JSON.parse(raw) as StoredApiKey;

            if (
                !session ||
                typeof session.key !== 'string' ||
                !session.key.trim() ||
                typeof session.expiresAt !== 'number' ||
                !Number.isFinite(session.expiresAt) ||
                session.expiresAt <= Date.now()
            ) {
                await AsyncStorage.removeItem(STORAGE_KEY);
                return null;
            }

            return session.key.trim();
        } catch {
            return null;
        }
    },

    async save(key: string): Promise<void> {
        const session: StoredApiKey = {
            key,
            expiresAt: Date.now() + KEY_TTL_MS,
        };

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(session),
        );
    },

    async clear(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
    },
};
