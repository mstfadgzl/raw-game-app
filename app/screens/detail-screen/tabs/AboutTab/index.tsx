import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    View,
    Linking,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, GenreChip, StudioBrand } from '@components';
import { translateText } from '@utils';
import { useSettings } from '@hooks';
import type { ThemeColors } from '@theme';
import type { IGameDetail, GameRelationNavigationParamList } from '@types';
import { useStyles } from '../../styles';
import { GameStores } from '../../../../components/game-stores';
import { gameService } from '../../../../api/services/gameService';

type Props = {
    detail: IGameDetail;
};
type RelationItem = {
    id: number;
    name: string;
    image?: string | null;
    image_background?: string | null;
};
type SelectorState = {
    title: string;
    items: RelationItem[];
    onSelect: (item: RelationItem) => void;
} | null;
type Fact = {
    label: string;
    value: string;
    onPress?: () => void;
    brand?: RelationItem;
};

const translationCache = new Map<string, string>();

export const AboutTab = ({ detail }: Props) => {
    const styles = useStyles();
    const navigation = useNavigation<NavigationProp<GameRelationNavigationParamList>>();
    const insets = useSafeAreaInsets();
    const { language, colors, localize } = useSettings();
    const localStyles = useMemo(() => createLocalStyles(colors), [colors]);

    const source = detail?.description_raw?.trim() || '';
    const stores = useMemo(() => detail.stores?.map(item => item.store) ?? [], [detail.stores]);
    const [developmentTeam, setDevelopmentTeam] = useState<RelationItem[]>([]);
    const [selector, setSelector] = useState<SelectorState>(null);

    useEffect(() => {
        let active = true;
        setDevelopmentTeam([]);
        void gameService.getGameDevelopmentTeam(detail.id)
            .then(response => {
                if (active && Array.isArray(response.results)) setDevelopmentTeam(response.results);
            })
            .catch(() => { if (active) setDevelopmentTeam([]); });
        return () => { active = false; };
    }, [detail.id]);

    const [translation, setTranslation] = useState('');
    const [translating, setTranslating] = useState(false);
    const [translationError, setTranslationError] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const generation = useRef(0);
    const translationLock = useRef(false);

    useEffect(() => {
        generation.current += 1;
        translationLock.current = false;

        setTranslation(translationCache.get(source) || '');
        setTranslating(language === 'tr' && Boolean(source));
        setTranslationError(false);
        setExpanded(false);

        return () => {
            generation.current += 1;
        };
    }, [detail?.id, source, language]);

    useEffect(() => {
        if (language !== 'tr' || !source || translationLock.current) return;

        const cached = translationCache.get(source);
        if (cached) {
            setTranslation(cached);
            setTranslating(false);
            return;
        }

        translationLock.current = true;

        const current = generation.current;

        setTranslating(true);
        setTranslationError(false);

        const translate = async () => {
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

        void translate();
    }, [language, source]);

    const handleWebsite = async () => {
        const value = detail?.website?.trim();
        if (!value) return;

        if (
            /^[a-z][a-z\d+.-]*:/i.test(value) &&
            !/^https?:\/\//i.test(value)
        ) {
            Alert.alert(localize('Bağlantı açılamadı'), localize('Geçersiz web adresi.'));
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
        language === 'tr' && translation ? translation : source;

    const developers = detail.developers ?? [];
    const publishers = detail.publishers ?? [];
    const platforms = (detail.platforms ?? []).map(item => item.platform);
    const openSelector = (
        title: string,
        items: RelationItem[],
        onSelect: (item: RelationItem) => void,
    ) => {
        if (items.length > 0) setSelector({ title, items, onSelect });
    };
    const facts: Fact[] = [
        {
            label: 'GELİŞTİRİCİ',
            value: developers.map(item => item.name).join(', ') || 'Bilinmiyor',
            brand: developers[0],
            onPress: developers.length > 0 ? () => openSelector('Geliştiriciler', developers, item => navigation.navigate('DeveloperDetail', item)) : undefined,
        },
        {
            label: 'YAYINCI',
            value: publishers.map(item => item.name).join(', ') || 'Bilinmiyor',
            brand: publishers[0],
            onPress: publishers.length > 0 ? () => openSelector('Yayıncılar', publishers, item => navigation.navigate('PublisherDetail', item)) : undefined,
        },
        {
            label: 'ÇIKIŞ TARİHİ',
            value: detail.released ? detail.released.split('-').reverse().join('.') : 'Henüz açıklanmadı',
        },
        {
            label: 'PLATFORMLAR',
            value: platforms.map(item => item.name).join(', ') || 'Belirtilmemiş',
            onPress: platforms.length > 0 ? () => openSelector('Platformlar', platforms, item => navigation.navigate('PlatformDetail', item)) : undefined,
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
        ...(developmentTeam.length > 0 ? [{
            label: 'YARATICILAR',
            value: `${developmentTeam.length} kişi`,
            onPress: () => openSelector('Yaratıcılar', developmentTeam, item => navigation.navigate('CreatorDetail', item)),
        }] : []),
    ];

    return (
        <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <GameStores key={detail.id} gameId={detail.id} gameName={detail.name} stores={stores} />
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

                </View>
            )}

            {translating && (
                <AppText style={styles.muted}>
                    Çeviri yükleniyor…
                </AppText>
            )}

            {translationError && language === 'tr' && (
                <AppText style={styles.muted}>
                    Çeviri yapılamadı. Orijinal açıklama gösteriliyor.
                </AppText>
            )}

            <View style={localStyles.grid}>
                {facts.map(item => (
                    <TouchableOpacity
                        key={item.label}
                        style={localStyles.fact}
                        disabled={!item.onPress}
                        activeOpacity={0.75}
                        onPress={item.onPress}
                    >
                        {!!item.brand && (
                            <StudioBrand
                                name={item.brand.name}
                                image={item.brand.image}
                                imageBackground={item.brand.image_background}
                                size={34}
                            />
                        )}
                        <AppText style={item.brand ? [localStyles.factLabel, localStyles.factLabelWithBrand] : localStyles.factLabel}>
                            {item.label}
                        </AppText>

                        <AppText style={localStyles.factValue}>
                            {item.value}
                        </AppText>
                        {!!item.onPress && <AppText color={colors.primary} style={localStyles.factArrow}>›</AppText>}
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                visible={selector !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelector(null)}
                statusBarTranslucent
                navigationBarTranslucent
            >
                <View style={localStyles.modalRoot}>
                    <Pressable
                        style={localStyles.modalBackdrop}
                        accessibilityRole="button"
                        accessibilityLabel="Seçim panelini kapat"
                        onPress={() => setSelector(null)}
                    />
                    <View style={[localStyles.selectorSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                        <View style={localStyles.selectorHeader}>
                            <AppText style={styles.sectionTitle}>{selector?.title}</AppText>
                            <Pressable accessibilityRole="button" accessibilityLabel="Seçim panelini kapat" onPress={() => setSelector(null)} style={localStyles.closeButton}>
                                <AppText style={localStyles.closeText}>×</AppText>
                            </Pressable>
                        </View>
                        <FlatList
                            data={selector?.items ?? []}
                            keyExtractor={item => String(item.id)}
                            contentContainerStyle={localStyles.selectorList}
                            renderItem={({ item }) => (
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`${item.name}, detayını aç`}
                                    style={localStyles.selectorRow}
                                    onPress={() => {
                                        const current = selector;
                                        setSelector(null);
                                        current?.onSelect(item);
                                    }}
                                >
                                    <StudioBrand
                                        name={item.name}
                                        image={item.image}
                                        imageBackground={item.image_background}
                                        size={44}
                                    />
                                    <AppText bold numberOfLines={1} style={localStyles.selectorName}>{item.name}</AppText>
                                    <AppText color={colors.primary} style={localStyles.selectorArrow}>›</AppText>
                                </Pressable>
                            )}
                            ListEmptyComponent={<AppText style={styles.muted}>Bu alanda gösterilecek bilgi yok.</AppText>}
                        />
                    </View>
                </View>
            </Modal>

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

const createLocalStyles = (colors: ThemeColors) => StyleSheet.create({
    description: {
        fontSize: 14,
        lineHeight: 23,
        color: colors.text,
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
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
    },
    factLabel: {
        color: colors.secondary,
        fontSize: 10,
        fontWeight: '700',
        marginBottom: 7,
    },
    factLabelWithBrand: {
        marginTop: 8,
    },
    factValue: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '600',
    },
    factArrow: {
        position: 'absolute',
        top: 10,
        right: 12,
        fontSize: 22,
        lineHeight: 22,
    },
    modalRoot: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.68)',
    },
    selectorSheet: {
        maxHeight: '72%',
        backgroundColor: colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 16,
    },
    selectorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 28,
        color: colors.text,
    },
    selectorList: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    selectorRow: {
        minHeight: 56,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: 8,
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    selectorName: {
        flex: 1,
    },
    selectorArrow: {
        fontSize: 24,
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
        borderColor: colors.border,
    },
});
