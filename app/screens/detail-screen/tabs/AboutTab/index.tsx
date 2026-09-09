import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    View,
    Linking,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import { AppText, GenreChip } from '@components';
import { translateText } from '@utils';
import { colors } from '@theme';
import type { IGameDetail, DiscoverStackParamList } from '@types';
import { styles } from '../../styles';

type Props = {
    detail: IGameDetail;
};

const translationCache = new Map<string, string>();

export const AboutTab = ({ detail }: Props) => {
    const navigation = useNavigation<NavigationProp<Pick<DiscoverStackParamList, 'TagDetail'>>>();

    const source = detail?.description_raw?.trim() || '';

    const [translation, setTranslation] = useState('');
    const [translating, setTranslating] = useState(false);
    const [translationError, setTranslationError] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const generation = useRef(0);
    const translationLock = useRef(false);

    useEffect(() => {
        generation.current += 1;
        translationLock.current = false;

        setTranslation(translationCache.get(source) || '');
        setTranslating(false);
        setTranslationError(false);
        setShowOriginal(false);
        setExpanded(false);

        return () => {
            generation.current += 1;
        };
    }, [detail?.id, source]);

    const handleTranslate = async () => {
        if (!source || translationLock.current) return;

        translationLock.current = true;

        const current = generation.current;

        setTranslating(true);
        setTranslationError(false);

        try {
            const result = (await translateText(source))?.trim();

            if (!result) {
                throw new Error('Boş çeviri');
            }

            if (translationCache.size >= 20) {
                const oldestKey = translationCache.keys().next().value;

                if (oldestKey !== undefined) {
                    translationCache.delete(oldestKey);
                }
            }

            translationCache.set(source, result);

            if (current === generation.current) {
                setTranslation(result);
                setShowOriginal(false);
            }
        } catch {
            if (current === generation.current) {
                setTranslationError(true);
            }
        } finally {
            if (current === generation.current) {
                translationLock.current = false;
                setTranslating(false);
            }
        }
    };

    const handleWebsite = async () => {
        const value = detail?.website?.trim();
        if (!value) return;

        if (
            /^[a-z][a-z\d+.-]*:/i.test(value) &&
            !/^https?:\/\//i.test(value)
        ) {
            Alert.alert('Bağlantı açılamadı', 'Geçersiz web adresi.');
            return;
        }

        const url = /^https?:\/\//i.test(value)
            ? value
            : `https://${value.replace(/^\/\//, '')}`;

        try {
            await Linking.openURL(url);
        } catch {
            Alert.alert(
                'Bağlantı açılamadı',
                'Lütfen daha sonra tekrar deneyin.',
            );
        }
    };

    if (!detail) return null;

    const description =
        translation && !showOriginal ? translation : source;

    const facts = [
        {
            label: 'GELİŞTİRİCİ',
            value:
                detail.developers
                    ?.map(item => item.name)
                    .join(', ') || 'Bilinmiyor',
        },
        {
            label: 'YAYINCI',
            value:
                detail.publishers
                    ?.map(item => item.name)
                    .join(', ') || 'Bilinmiyor',
        },
        {
            label: 'ÇIKIŞ TARİHİ',
            value: detail.released ? detail.released.split('-').reverse().join('.') : 'Henüz açıklanmadı',
        },
        {
            label: 'PLATFORMLAR',
            value: detail.platforms?.map(item => item.platform.name).join(', ') || 'Belirtilmemiş',
        },
        {
            label: 'ORTALAMA SÜRE',
            value:
                detail.playtime > 0
                    ? `${detail.playtime} saat`
                    : 'Veri yok',
        },
        {
            label: 'YAŞ DERECELENDİRMESİ',
            value:
                detail.esrb_rating?.name || 'Derecelendirilmemiş',
        },
    ];

    return (
        <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <AppText style={styles.sectionTitle}>
                Oyun hakkında
            </AppText>

            <AppText
                style={localStyles.description}
                numberOfLines={expanded ? undefined : 7}
            >
                {description || 'Bu oyun için açıklama bulunmuyor.'}
            </AppText>

            {!!source && (
                <View style={localStyles.actions}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        style={localStyles.textButton}
                        onPress={() => setExpanded(value => !value)}
                    >
                        <AppText color={colors.primary} bold>
                            {expanded ? 'Daha az göster' : 'Devamını oku'}
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityRole="button"
                        style={localStyles.textButton}
                        disabled={translating}
                        onPress={() => {
                            if (translation) {
                                setShowOriginal(value => !value);
                            } else {
                                void handleTranslate();
                            }
                        }}
                    >
                        <AppText color={colors.primary}>
                            {translating
                                ? 'Çevriliyor…'
                                : translation
                                    ? showOriginal
                                        ? 'Türkçesini göster'
                                        : 'Orijinali göster'
                                    : 'Türkçeye çevir'}
                        </AppText>
                    </TouchableOpacity>
                </View>
            )}

            {translationError && (
                <AppText style={styles.muted}>
                    Çeviri yapılamadı. Düğmeye basarak tekrar deneyebilirsin.
                </AppText>
            )}

            <View style={localStyles.grid}>
                {facts.map(item => (
                    <View
                        key={item.label}
                        style={localStyles.fact}
                    >
                        <AppText style={localStyles.factLabel}>
                            {item.label}
                        </AppText>

                        <AppText style={localStyles.factValue}>
                            {item.value}
                        </AppText>
                    </View>
                ))}
            </View>

            {!!detail.tags?.length && (
                <>
                    <AppText style={styles.sectionTitle}>
                        Etiketler
                    </AppText>

                    <View style={localStyles.tags}>
                        {detail.tags
                            .filter(tag => Boolean(tag.slug))
                            .slice(0, 15)
                            .map(tag => (
                                <GenreChip
                                    key={tag.id}
                                    name={tag.name}
                                    onPress={() =>
                                        navigation.navigate('TagDetail', {
                                            slug: tag.slug,
                                            name: tag.name,
                                        })
                                    }
                                />
                            ))}
                    </View>
                </>
            )}

            {!!detail.website && (
                <TouchableOpacity
                    accessibilityRole="link"
                    style={localStyles.website}
                    onPress={handleWebsite}
                >
                    <AppText color={colors.primary} bold>
                        Resmi web sitesi ↗
                    </AppText>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    description: {
        fontSize: 14,
        lineHeight: 23,
        color: '#D5DAE5',
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    textButton: {
        paddingVertical: 12,
        paddingRight: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 12,
    },
    fact: {
        width: '48%',
        padding: 13,
        borderRadius: 12,
        backgroundColor: '#1D2226',
        borderWidth: 1,
        borderColor: '#2D353B',
        marginBottom: 12,
    },
    factLabel: {
        color: '#98A3BC',
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 7,
    },
    factValue: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '600',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    website: {
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#343C50',
    },
});
