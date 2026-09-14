import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { darkColors, lightColors, type ThemeColors } from '../theme/colors';
import {
    defaultPreferences,
    preferencesStorage,
    type AppPreferences,
    type ThemeMode,
} from '../services/preferences-storage';
import {
    localizeUiText,
    translateKey,
    type Language,
    type TranslationKey,
} from '../i18n';

type SettingsContextValue = {
    language: Language;
    themeMode: ThemeMode;
    colors: ThemeColors;
    setLanguage: (language: Language) => void;
    setThemeMode: (themeMode: ThemeMode) => void;
    t: (key: TranslationKey) => string;
    localize: (text: string) => string;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);

    useEffect(() => {
        let active = true;

        void preferencesStorage.get().then(value => {
            if (active) setPreferences(value);
        });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        void preferencesStorage.save(preferences);
    }, [preferences]);

    const value = useMemo<SettingsContextValue>(() => ({
        language: preferences.language,
        themeMode: preferences.themeMode,
        colors: preferences.themeMode === 'light' ? lightColors : darkColors,
        setLanguage: language => setPreferences(current => ({ ...current, language })),
        setThemeMode: themeMode => setPreferences(current => ({ ...current, themeMode })),
        t: key => translateKey(preferences.language, key),
        localize: text => localizeUiText(preferences.language, text),
    }), [preferences]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used inside SettingsProvider');
    }

    return context;
};
