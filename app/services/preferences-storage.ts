import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Language } from '../i18n';

const STORAGE_KEY = '@rawg/preferences';

export type ThemeMode = 'dark' | 'light';

export type AppPreferences = {
    themeMode: ThemeMode;
    language: Language;
};

export const defaultPreferences: AppPreferences = {
    themeMode: 'dark',
    language: 'en',
};

export const preferencesStorage = {
    async get(): Promise<AppPreferences> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultPreferences;

            const parsed = JSON.parse(raw) as Partial<AppPreferences>;

            return {
                themeMode: parsed.themeMode === 'light' ? 'light' : 'dark',
                language: parsed.language === 'tr' ? 'tr' : 'en',
            };
        } catch {
            return defaultPreferences;
        }
    },

    async save(preferences: AppPreferences): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    },
};
