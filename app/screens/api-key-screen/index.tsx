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
    const { colors: themeColors, language } = useSettings();
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const mounted = useRef(true);

    React.useEffect(() => {
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

            runtimeApiKey.set(cleanKey);
            await apiKeyStorage.save(cleanKey);

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
        <Container style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
                        <View style={styles.brand}>
                            <AppMark size={84} />
                        </View>

                        <AppText style={styles.eyebrow}>
                            İLK KURULUM
                        </AppText>

                        <AppText variant="h1" style={styles.title}>
                            RAWG API key’inizi girin
                        </AppText>

                        <AppText style={styles.description}>
                            Oyunları ve geliştirici bilgilerini gösterebilmek
                            için kendi RAWG API key’inizi kullanmalısınız.
                        </AppText>

                        <AppText style={styles.inputLabel}>
                            API KEY
                        </AppText>

                        <View style={styles.inputWrapper}>
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
                                placeholderTextColor="#68758A"
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
                            <AppText style={styles.error}>
                                {error}
                            </AppText>
                        )}

                        <Pressable
                            accessibilityRole="button"
                            disabled={isDisabled}
                            onPress={handleSubmit}
                            style={[
                                styles.primaryButton,
                                isDisabled && styles.disabledButton,
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#101817" />
                            ) : (
                                <AppText
                                    color="#101817"
                                    bold
                                    style={styles.primaryText}
                                >
                                    Key’i doğrula ve devam et
                                </AppText>
                            )}
                        </Pressable>

                        <View style={styles.helpBox}>
                            <AppText style={styles.helpTitle}>
                                API key’iniz yok mu?
                            </AppText>

                            <AppText style={styles.helpText}>
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

                        <AppText style={styles.privacy}>
                            Key yalnızca bu cihazda kullanılır ve 7 gün sonra
                            yeniden istenir.
                        </AppText>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};
