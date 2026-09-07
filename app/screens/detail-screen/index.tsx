import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
    getGameDetailProcess,
    getGameTrailersProcess,
    getGameAchievementsProcess,
    getGameRedditPostsProcess,
    getGameSeriesProcess,
    getGameScreenshotsProcess
} from '@actions';
import { Container, AppText, Skeleton, VideoPlayer, EmptyState, GenreChip } from '@components';
import { translateText } from '@utils';
import { colors, spacing } from '@theme';
import { toggleFavorite } from '../../redux/slices/gameSlice';

export const DetailScreen = () => {
    const route = useRoute<any>();
    const dispatch = useAppDispatch();
    const safeGameId = Number(route.params.gameId);

    const { data, isLoading } = useAppSelector(state => state.game);
    const favorites = useAppSelector(state => state.game.data.favorites || []);

    const detail = data.getGameDetailProcess;
    const screenshots = data.getGameScreenshotsProcess?.results || [];
    const trailer = data.getGameTrailersProcess?.results?.[0];

    const isFav = favorites.some((f: any) => f.id === detail?.id);
    const isFetching = isLoading['getGameDetailProcess'];

    const [trDescription, setTrDescription] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getGameDetailProcess(safeGameId));
        dispatch(getGameTrailersProcess(safeGameId));
        dispatch(getGameAchievementsProcess({ id: safeGameId, page: 1 }));
        dispatch(getGameRedditPostsProcess({ id: safeGameId, page: 1 }));
        dispatch(getGameSeriesProcess(safeGameId));
        dispatch(getGameScreenshotsProcess(safeGameId));
    }, [safeGameId, dispatch]);

    useEffect(() => {
        if (detail?.description_raw) {
            setTrDescription('');
            setIsTranslating(true);
            translateText(detail.description_raw)
                .then((translated) => {
                    setTrDescription(translated || detail.description_raw);
                })
                .catch(() => {
                    setTrDescription(detail.description_raw);
                })
                .finally(() => setIsTranslating(false));
        }
    }, [detail?.description_raw]);

    const handleFavorites = () => {
        if (detail) {
            dispatch(toggleFavorite({
                id: detail.id,
                name: detail.name,
                background_image: detail.background_image,
                rating: detail.rating,
                released: detail.released,
            } as any));
        }
    };

    const handlePressWebsite = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) await Linking.openURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    if (isFetching || !detail || detail.id !== safeGameId) {
        return <Container><Skeleton style={{ flex: 1 }} /></Container>;
    }

    return (
        <Container style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 0 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

                {/* 1. KOMPAKT KAPAK VE VİDEO/RESİM ALANI */}
                <View style={localStyles.heroContainer}>
                    {trailer ? (
                        <VideoPlayer trailer={trailer} />
                    ) : (
                        <Image source={{ uri: detail.background_image }} style={localStyles.heroImage} resizeMode="cover" />
                    )}
                    <TouchableOpacity style={localStyles.favButton} onPress={handleFavorites} activeOpacity={0.7}>
                        <AppText style={{ fontSize: 22 }}>{isFav ? '❤️' : '🤍'}</AppText>
                    </TouchableOpacity>
                </View>

                {/* 2. ANA BİLGİLER */}
                <View style={localStyles.contentPadding}>
                    <AppText variant="h1" style={localStyles.title}>{detail.name}</AppText>

                    <View style={localStyles.subMetaRow}>
                        {detail.developers?.[0] && (
                            <AppText color={colors.secondary} bold>
                                {detail.developers[0].name}
                            </AppText>
                        )}
                        <AppText color={colors.secondary}> • </AppText>
                        <AppText color={colors.primary} bold>★ {detail.rating} / 5</AppText>
                        <AppText color={colors.secondary}> • </AppText>
                        <AppText color={colors.secondary}>{detail.released?.split('-')[0]}</AppText>
                    </View>

                    {/* 3. TEKNİK KÜNYE (GRID KUTULAR) */}
                    <View style={localStyles.gridContainer}>
                        <View style={localStyles.gridItem}>
                            <AppText variant="caption" color={colors.primary} bold>SÜRE</AppText>
                            <AppText bold>{detail.playtime > 0 ? `${detail.playtime} Saat` : 'Veri yok'}</AppText>
                        </View>
                        <View style={localStyles.gridItem}>
                            <AppText variant="caption" color={colors.primary} bold>YAŞ SINIRI</AppText>
                            <AppText bold numberOfLines={1}>{detail.esrb_rating?.name || 'Yok'}</AppText>
                        </View>
                    </View>

                    {/* 4. OYUN HİKAYESİ */}
                    <AppText variant="h2" style={{ marginTop: 16, marginBottom: 8 }}>Hakkında</AppText>
                    <AppText style={localStyles.description}>
                        {!detail.description_raw
                            ? 'Bu oyun için açıklama bulunmuyor.'
                            : isTranslating
                                ? 'Türkçeye çevriliyor...'
                                : (trDescription || detail.description_raw)}
                    </AppText>

                    {/* 5. EKRAN GÖRÜNTÜLERİ (YATAY KAYDIRMALI) */}
                    {screenshots.length > 0 && (
                        <View style={{ marginTop: 16 }}>
                            <AppText variant="h2" style={{ marginBottom: 8 }}>Ekran Görüntüleri</AppText>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                                {screenshots.map((shot: any) => (
                                    <Image key={shot.id} source={{ uri: shot.image }} style={localStyles.screenshotThumb} />
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* 6. ETİKETLER */}
                    {detail.tags && detail.tags.length > 0 && (
                        <View style={{ marginTop: 20 }}>
                            <AppText variant="h2" style={{ marginBottom: 8 }}>Etiketler</AppText>
                            <View style={localStyles.tagsContainer}>
                                {detail.tags.slice(0, 10).map((tag: any) => (
                                    <GenreChip key={`tag-${tag.id}`} name={tag.name} onPress={() => { }} />
                                ))}
                            </View>
                        </View>
                    )}

                    {/* 7. WEB SİTESİ BUTONU */}
                    {detail.website && (
                        <TouchableOpacity onPress={() => handlePressWebsite(detail.website)} style={localStyles.websiteButton}>
                            <AppText bold color={colors.background}>Resmi Web Sitesini Ziyaret Et</AppText>
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
        </Container>
    );
};

const localStyles = StyleSheet.create({
    heroContainer: {
        width: '100%',
        height: 200, // Artık ekranı boğmuyor, zarif bir banner yüksekliğinde
        backgroundColor: '#111',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    favButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    contentPadding: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 4,
    },
    subMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    gridItem: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    description: {
        lineHeight: 22,
        color: '#D0D0D0',
        fontSize: 14,
    },
    screenshotThumb: {
        width: 200,
        height: 120,
        borderRadius: 10,
        backgroundColor: '#222',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    websiteButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    }
});