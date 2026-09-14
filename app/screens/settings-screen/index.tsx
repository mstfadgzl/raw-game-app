import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    View,
} from 'react-native';

import { AppText, Container } from '@components';
import { useSession, useSettings } from '@hooks';

import { styles } from './styles';

const Choice = ({
    label,
    selected,
    onPress,
}: {
    label: string;
    selected: boolean;
    onPress: () => void;
}) => {
    const { colors } = useSettings();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={onPress}
            style={[
                styles.choice,
                { borderColor: colors.border },
                selected && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
        >
            <AppText
                bold={selected}
                color={selected ? '#07110F' : colors.text}
                style={styles.choiceText}
            >
                {label}
            </AppText>
        </Pressable>
    );
};

export const SettingsScreen = () => {
    const { colors, language, themeMode, setLanguage, setThemeMode, t } = useSettings();
    const { logout } = useSession();
    const [loggingOut, setLoggingOut] = useState(false);

    const confirmLogout = () => {
        Alert.alert(
            t('logoutConfirmTitle'),
            t('logoutConfirmMessage'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('confirmLogout'),
                    style: 'destructive',
                    onPress: () => {
                        setLoggingOut(true);
                        void logout().finally(() => setLoggingOut(false));
                    },
                },
            ],
        );
    };

    return (
        <Container style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <AppText variant="h1" color={colors.text}>
                        {t('settingsTitle')}
                    </AppText>
                    <AppText color={colors.secondary} style={styles.headerSubtitle}>
                        {t('appearanceDescription')}
                    </AppText>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <AppText style={styles.sectionLabel} color={colors.primary}>
                        {t('appearance')}
                    </AppText>

                    <View style={styles.settingRow}>
                        <View style={styles.copy}>
                            <AppText bold color={colors.text}>{t('appearance')}</AppText>
                            <AppText color={colors.secondary} style={styles.description}>
                                {t('appearanceDescription')}
                            </AppText>
                        </View>
                        <View style={[styles.choices, { backgroundColor: colors.background }]}>
                            <Choice
                                label={t('darkMode')}
                                selected={themeMode === 'dark'}
                                onPress={() => setThemeMode('dark')}
                            />
                            <Choice
                                label={t('lightMode')}
                                selected={themeMode === 'light'}
                                onPress={() => setThemeMode('light')}
                            />
                        </View>
                    </View>

                    <View style={[styles.separator, { backgroundColor: colors.border }]} />

                    <View style={styles.settingRow}>
                        <View style={styles.copy}>
                            <AppText bold color={colors.text}>{t('language')}</AppText>
                            <AppText color={colors.secondary} style={styles.description}>
                                {t('languageDescription')}
                            </AppText>
                        </View>
                        <View style={[styles.choices, { backgroundColor: colors.background }]}>
                            <Choice
                                label={t('english')}
                                selected={language === 'en'}
                                onPress={() => setLanguage('en')}
                            />
                            <Choice
                                label={t('turkish')}
                                selected={language === 'tr'}
                                onPress={() => setLanguage('tr')}
                            />
                        </View>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <AppText style={styles.sectionLabel} color={colors.primary}>
                        {t('account')}
                    </AppText>

                    <View style={styles.accountCopy}>
                        <AppText bold color={colors.text}>{t('apiKeySession')}</AppText>
                        <AppText color={colors.secondary} style={styles.description}>
                            {t('apiKeySessionDescription')}
                        </AppText>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        disabled={loggingOut}
                        onPress={confirmLogout}
                        style={[styles.logoutButton, { borderColor: colors.error }]}
                    >
                        <AppText color={colors.error} bold>
                            {loggingOut ? '…' : t('logout')}
                        </AppText>
                    </Pressable>
                    <AppText color={colors.secondary} style={styles.description}>
                        {t('logoutDescription')}
                    </AppText>
                </View>

                <View style={styles.footer}>
                    <AppText color={colors.secondary}>{t('rawgAttribution')}</AppText>
                    <AppText color={colors.secondary} style={styles.version}>{t('version')}</AppText>
                </View>
            </ScrollView>
        </Container>
    );
};
