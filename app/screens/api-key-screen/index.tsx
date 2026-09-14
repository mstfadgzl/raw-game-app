import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from 'react-native';

import { AppMark, AppText, Container } from '@components';
import { useSettings } from '@hooks';

import { apiKeyStorage } from '../../services/api-key-storage';
import { runtimeApiKey } from '../../services/runtime-api-key';
import { validateRawgKey } from '../../services/validate-rawg-key';

import { styles } from './styles';

type Props = {
    onAuthenticated: () => void;
};

export const ApiKeyScreen = ({ onAuthenticated }: Props) => {
    const { colors: themeColors, language, setLanguage, themeMode, setThemeMode } = useSettings();
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const mounted = useRef(true);

    React.useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const openRawgPage = async () => {
        try {
            await Linking.openURL('https://rawg.io/apidocs');
        } catch {
            setError('RAWG sayfası açılamadı.');
        }
    };

    const handleSubmit = async () => {
        const cleanKey = apiKey.trim();

        if (!cleanKey) {
            setError('Lütfen RAWG API key girin.');
            return;
        }

        if (loading) {
            return;
        }

        Keyboard.dismiss();
        setLoading(true);
        setError('');

        try {
            const valid = await validateRawgKey(cleanKey);

            if (!valid) {
                throw new Error('Geçersiz API key');
            }

            await apiKeyStorage.save(cleanKey);
            runtimeApiKey.set(cleanKey);

            if (mounted.current) {
                onAuthenticated();
            }
        } catch {
            if (mounted.current) {
                setError(
                    'API key geçersiz veya RAWG servisine ulaşılamıyor.',
                );
            }
        } finally {
            if (mounted.current) {
                setLoading(false);
            }
        }
    };

    const isDisabled = loading || apiKey.trim().length === 0;

    return (
        <Container style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.languageRow}>
                <View style={[styles.languagePicker, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    {(['dark', 'light'] as const).map(value => (
                        <Pressable
                            key={value}
                            accessibilityRole="radio"
                            accessibilityLabel={value === 'dark' ? (language === 'tr' ? 'Karanlık mod' : 'Dark mode') : (language === 'tr' ? 'Aydınlık mod' : 'Light mode')}
                            accessibilityState={{ checked: themeMode === value }}
                            onPress={() => setThemeMode(value)}
                            style={[styles.languageOption, themeMode === value && { backgroundColor: themeColors.primary }]}
                        >
                            <AppText style={styles.themeSymbol} color={themeMode === value ? (themeMode === 'light' ? '#FFFFFF' : '#07110F') : themeColors.secondary}>
                                {value === 'dark' ? '☾' : '☀'}
                            </AppText>
                        </Pressable>
                    ))}
                </View>
                <View style={[styles.languagePicker, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    {(['en', 'tr'] as const).map(value => (
                        <Pressable
                            key={value}
                            accessibilityRole="radio"
                            accessibilityLabel={value === 'en' ? 'English' : 'Türkçe'}
                            accessibilityState={{ checked: language === value }}
                            onPress={() => setLanguage(value)}
                            style={[styles.languageOption, language === value && { backgroundColor: themeColors.primary }]}
                        >
                            <AppText bold style={styles.languageLabel} color={language === value ? (themeMode === 'light' ? '#FFFFFF' : '#07110F') : themeColors.secondary}>
                                {value.toUpperCase()}
                            </AppText>
                        </Pressable>
                    ))}
                </View>
            </View>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                        <View style={styles.brand}>
                            <AppMark size={84} />
                        </View>

                        <AppText style={[styles.eyebrow, { color: themeColors.primary }]}>
                            GameCodex
                        </AppText>

                        <AppText variant="h1" style={[styles.title, { color: themeColors.text }]}>
                            RAWG API key’inizi girin
                        </AppText>

                        <AppText style={[styles.description, { color: themeColors.secondary }]}>
                            Oyunları ve geliştirici bilgilerini gösterebilmek
                            için kendi RAWG API key’inizi kullanmalısınız.
                        </AppText>

                        <AppText style={[styles.inputLabel, { color: themeColors.secondary }]}>
                            API KEY
                        </AppText>

                        <View style={[styles.inputWrapper, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                            <TextInput
                                value={apiKey}
                                onChangeText={value => {
                                    setApiKey(value);
                                    if (error) {
                                        setError('');
                                    }
                                }}
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder={language === 'en' ? 'Enter your RAWG API key' : 'RAWG API key’inizi yazın'}
                                placeholderTextColor={themeColors.secondary}
                                autoCapitalize="none"
                                autoCorrect={false}
                                spellCheck={false}
                                autoComplete="off"
                                secureTextEntry={!showKey}
                                editable={!loading}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />

                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showKey
                                        ? 'API key’i gizle'
                                        : 'API key’i göster'
                                }
                                onPress={() => setShowKey(value => !value)}
                                style={styles.showButton}
                            >
                                <AppText color={themeColors.primary} bold>
                                    {showKey ? 'Gizle' : 'Göster'}
                                </AppText>
                            </Pressable>
                        </View>

                        {!!error && (
                            <AppText style={[styles.error, { color: themeColors.error }]}>
                                {error}
                            </AppText>
                        )}

                        <Pressable
                            accessibilityRole="button"
                            disabled={isDisabled}
                            onPress={handleSubmit}
                            style={[
                                [styles.primaryButton, { backgroundColor: themeColors.primary }],
                                isDisabled && styles.disabledButton,
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator color={themeMode === 'light' ? '#FFFFFF' : '#101817'} />
                            ) : (
                                <AppText
                                    color={themeMode === 'light' ? '#FFFFFF' : '#101817'}
                                    bold
                                    style={styles.primaryText}
                                >
                                    Key’i doğrula ve devam et
                                </AppText>
                            )}
                        </Pressable>

                        <View style={[styles.helpBox, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
                            <AppText style={[styles.helpTitle, { color: themeColors.text }]}>
                                API key’iniz yok mu?
                            </AppText>

                            <AppText style={[styles.helpText, { color: themeColors.secondary }]}>
                                RAWG hesabınıza giriş yapıp ücretsiz API
                                key’inizi alabilirsiniz.
                            </AppText>

                            <Pressable
                                accessibilityRole="link"
                                onPress={openRawgPage}
                                style={styles.linkButton}
                            >
                                <AppText color={themeColors.primary} bold>
                                    RAWG API key alma sayfasını aç ↗
                                </AppText>
                            </Pressable>
                        </View>

                        <AppText style={[styles.privacy, { color: themeColors.secondary }]}>
                            Key yalnızca bu cihazda kullanılır ve 7 gün sonra
                            yeniden istenir.
                        </AppText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};
