import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    View,
} from 'react-native';

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@hooks';
import { getCreatorDetailProcess, getGamesProcess } from '@actions';
import {
    AppText,
    Container,
    GameCard,
    Skeleton,
} from '@components';

import { translateText } from '@utils';

import {
    IGame,
    type CreatorDetailRouteProp,
    type DiscoverScreenNavigationProp,
} from '@types';

import { colors } from '@theme';
import { styles } from './styles';

export const CreatorDetailScreen = () => {
    const route = useRoute<CreatorDetailRouteProp>();
    const navigation =
        useNavigation<DiscoverScreenNavigationProp>();

    const { id, name } = route.params;
    const dispatch = useAppDispatch();

    const { data } = useAppSelector(state => state.entity);

    // Başka kişiden kalan profilin görünmesini engeller.
    const storedCreator = data.getCreatorDetailProcess;

    const creator =
        Number(storedCreator?.id) === Number(id)
            ? storedCreator
            : undefined;

    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const [trBio, setTrBio] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const [games, setGames] = useState<IGame[]>([]);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [gamesError, setGamesError] = useState(false);
    const positions = creator?.positions ?? [];

    const description = (creator?.description ?? '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .trim();

    useEffect(() => {
        let active = true;

        setGames([]);
        setGamesLoading(true);
        setGamesError(false);

        const fetchCreatorGames = async () => {
            try {
                const action = await dispatch(
                    getGamesProcess({
                        page: requestedPage,
                        genres: slug,
                        ...query,
                    }),
                );

                if (getGamesProcess.fulfilled.match(action)) {
                    const response = action.payload;

                    const incomingGames = response.results ?? [];

                    setGames(previous =>
                        requestedPage === 1
                            ? incomingGames
                            : mergeGames(previous, incomingGames),
                    );

                    queryRef.current = query;
                    pageRef.current = requestedPage;
                    hasMoreRef.current = Boolean(response.next);
                } else {
                    throw new Error('Oyunlar alınamadı.');
                }
            } catch {
                if (active) {
                    setGamesError(true);
                }
            } finally {
                if (active) {
                    setGamesLoading(false);
                }
            }
        };

        void fetchCreatorGames();

        return () => {
            active = false;
        };
    }, [dispatch, id]);

    useEffect(() => {
        let active = true;

        setTrBio('');
        setExpanded(false);
        setIsTranslating(Boolean(description));

        if (!description) {
            return;
        }

        const translateBiography = async () => {
            try {
                const translated = await translateText(description);

                if (active) {
                    setTrBio(translated?.trim() || '');
                }
            } catch {
                // Çeviri başarısızsa orijinal açıklama görünür.
                if (active) {
                    setTrBio('');
                }
            } finally {
                if (active) {
                    setIsTranslating(false);
                }
            }
        };

        void translateBiography();

        return () => {
            active = false;
        };
    }, [description, id]);

    const handleRetry = () => {
        setRetryCount(value => value + 1);
    };

    if (loading && !creator) {
        return (
            <Container style={styles.container}>
                <Skeleton style={styles.heroSkeleton} />

                <View style={styles.content}>
                    <Skeleton style={styles.titleSkeleton} />
                    <Skeleton style={styles.bioSkeleton} />
                </View>

                <View style={styles.skeletonGrid}>
                    {[0, 1].map(index => (
                        <Skeleton
                            key={index}
                            style={styles.cardSkeleton}
                        />
                    ))}
                </View>
            </Container>
        );
    }

    if (!creator) {
        return (
            <Container style={styles.container}>
                <View style={styles.feedback}>
                    <AppText style={styles.subTitle}>
                        Profil yüklenemedi
                    </AppText>

                    <AppText style={styles.secondaryText}>
                        Bağlantını kontrol edip tekrar deneyebilirsin.
                    </AppText>

                    <Pressable
                        onPress={handleRetry}
                        accessibilityRole="button"
                        style={styles.retryButton}
                    >
                        <AppText color={colors.primary} bold>
                            Tekrar dene
                        </AppText>
                    </Pressable>
                </View>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <FlatList
                key={`creator-${id}`}
                data={games}
                numColumns={2}
                keyExtractor={item => `creator-game-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                ListHeaderComponent={
                    <View>
                        <View style={styles.heroContainer}>
                            {creator.image && !imageFailed ? (
                                <Image
                                    source={{ uri: creator.image }}
                                    style={styles.heroImage}
                                    resizeMode="cover"
                                    onError={() => setImageFailed(true)}
                                />
                            ) : (
                                <View style={styles.imageFallback}>
                                    <AppText style={styles.fallbackLetter}>
                                        {(creator.name || name)
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AppText>
                                </View>
                            )}
                        </View>

                        <View style={styles.content}>
                            <AppText style={styles.title}>
                                {creator.name}
                            </AppText>

                            {positions.length > 0 && (
                                <AppText style={styles.role}>
                                    {positions
                                        .map((position: any) => position.name)
                                        .join(' · ')}
                                </AppText>
                            )}

                            {hasError && (
                                <AppText style={styles.errorText}>
                                    Bilgiler yenilenemedi. Önceki profil
                                    bilgileri gösteriliyor.
                                </AppText>
                            )}

                            <AppText style={styles.subTitle}>
                                Hakkında
                            </AppText>

                            <AppText
                                style={styles.bio}
                                numberOfLines={expanded ? undefined : 6}
                            >
                                {trBio ||
                                    description ||
                                    'Bu kişi için biyografi bulunmuyor.'}
                            </AppText>

                            {isTranslating && (
                                <View style={styles.translationRow}>
                                    <ActivityIndicator
                                        size="small"
                                        color={colors.primary}
                                    />

                                    <AppText style={styles.translationText}>
                                        Türkçeye çevriliyor…
                                    </AppText>
                                </View>
                            )}

                            {!!description && (
                                <Pressable
                                    onPress={() =>
                                        setExpanded(value => !value)
                                    }
                                    accessibilityRole="button"
                                    accessibilityState={{ expanded }}
                                    style={styles.expandButton}
                                >
                                    <AppText color={colors.primary} bold>
                                        {expanded
                                            ? 'Daha az göster'
                                            : 'Tamamını göster'}
                                    </AppText>
                                </Pressable>
                            )}

                            <AppText style={styles.gamesTitle}>
                                Yer aldığı oyunlar
                            </AppText>
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardColumn}>
                        <GameCard
                            game={item}
                            onPress={(gameId, gameName) =>
                                navigation.navigate('GameDetail', {
                                    gameId,
                                    gameName,
                                })
                            }
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {gamesLoading ? (
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                            />
                        ) : (
                            <AppText style={styles.secondaryText}>
                                {gamesError
                                    ? 'Oyunlar yüklenemedi.'
                                    : 'Bu kişi için oyun bulunamadı.'}
                            </AppText>
                        )}
                    </View>
                }
            />
        </Container>
    );
};