import React, { useCallback, useEffect, useState } from 'react';
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

import { entityService, gameService } from '@services';
import {
    AppText,
    Container,
    GameCard,
    Skeleton,
} from '@components';

import { translateText } from '@utils';
import { useSettings } from '@hooks';

import {
    ICreator,
    type CreatorDetailRouteProp,
    type DiscoverScreenNavigationProp,
} from '@types';

import { colors } from '@theme';
import { styles } from './styles';
import { usePaginatedGames } from '../../hooks/usePaginatedGames';

export const CreatorDetailScreen = () => {
    const { params } = useRoute<CreatorDetailRouteProp>();
    return <CreatorContent key={params.id} id={Number(params.id)} name={params.name} />;
};

const CreatorContent = ({ id, name }: { id: number; name: string }) => {
    const navigation =
        useNavigation<DiscoverScreenNavigationProp>();
    const { language } = useSettings();

    const [creator, setCreator] = useState<ICreator | null>(() => entityService.peekCreatorDetail(id));
    const [loading, setLoading] = useState(() => !entityService.peekCreatorDetail(id));
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const [trBio, setTrBio] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    const loadGames = useCallback((page: number) => gameService.getGames({
        page, creators: String(id), ordering: '-added',
    }), [id]);
    const { items: games, loading: gamesLoading, error: gamesError, loadMore, retry } = usePaginatedGames(loadGames);
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

        setLoading(!entityService.peekCreatorDetail(id));
        setHasError(false);
        setImageFailed(false);

        const fetchCreator = async () => {
            try {
                const creatorId = Number(id);
                if (!Number.isInteger(creatorId) || creatorId <= 0) {
                    throw new Error('Geçersiz kişi kimliği');
                }

                const response = await entityService.getCreatorDetail(creatorId, retryCount > 0);

                if (!response || Number(response.id) !== creatorId) {
                    throw new Error('Geçersiz profil yanıtı');
                }
                if (active) setCreator(response);
            } catch {
                if (active) {
                    setHasError(true);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void fetchCreator();

        return () => {
            active = false;
        };
    }, [id, retryCount]);

    useEffect(() => {
        let active = true;

        setTrBio('');
        setExpanded(false);
        setIsTranslating(language === 'tr' && Boolean(description));

        if (!description || language !== 'tr') {
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
    }, [description, id, language]);

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
                                        .map(position => position.name)
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
                                {(language === 'tr' && trBio) ||
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
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={5}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListFooterComponent={
                    <View style={styles.emptyContainer}>
                        {games.length > 0 && gamesLoading && <ActivityIndicator color={colors.primary} />}
                        {gamesError && (
                            <Pressable accessibilityRole="button" style={styles.retryButton} onPress={retry}>
                                <AppText color={colors.primary}>Oyunları yüklemeyi tekrar dene</AppText>
                            </Pressable>
                        )}
                    </View>
                }
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
