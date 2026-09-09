import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    View,
} from 'react-native';

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

import { useAppDispatch } from '@hooks';
import { getGamesProcess } from '@actions';

import {
    AppText,
    Container,
    DEFAULT_GAME_FILTERS,
    EmptyState,
    GameCard,
    GameSortFilter,
    Skeleton,
    buildGameFilterQuery,
} from '@components';

import type { GameFilterValue } from '@components';

import type {
    DiscoverScreenNavigationProp,
    GenreDetailRouteProp,
    IGame,
} from '@types';

import { colors } from '@theme';
import { styles } from './style';

type LoadMode = 'initial' | 'refresh' | 'more';

interface GenreGamesProps {
    slug: string;
    name: string;
}

interface FailedRequest {
    page: number;
    mode: LoadMode;
}

const mergeGames = (
    previous: IGame[],
    incoming: IGame[],
): IGame[] => {
    const unique = new Map<number, IGame>();

    for (const game of previous) {
        unique.set(game.id, game);
    }

    for (const game of incoming) {
        unique.set(game.id, game);
    }

    return Array.from(unique.values());
};

const GenreGames = ({ slug, name }: GenreGamesProps) => {
    const dispatch = useAppDispatch();

    const navigation =
        useNavigation<DiscoverScreenNavigationProp>();

    const listRef = useRef<FlatList<IGame>>(null);

    const [filters, setFilters] = useState<GameFilterValue>(
        () => ({ ...DEFAULT_GAME_FILTERS }),
    );

    const [games, setGames] = useState<IGame[]>([]);
    const [loading, setLoading] =
        useState<LoadMode | null>('initial');

    const [failedRequest, setFailedRequest] =
        useState<FailedRequest | null>(null);

    const pageRef = useRef(0);
    const hasMoreRef = useRef(false);
    const busyRef = useRef(false);
    const requestVersionRef = useRef(0);

    // Sayfalama boyunca aynı tarih aralığını korur.
    const queryRef = useRef<
        ReturnType<typeof buildGameFilterQuery> | null
    >(null);

    const loadPage = useCallback(
        async (requestedPage: number, mode: LoadMode) => {
            if (mode !== 'initial' && busyRef.current) {
                return;
            }

            if (
                mode === 'more' &&
                (!hasMoreRef.current || pageRef.current === 0)
            ) {
                return;
            }

            busyRef.current = true;

            const version = ++requestVersionRef.current;

            setLoading(mode);
            setFailedRequest(null);

            if (mode === 'initial') {
                pageRef.current = 0;
                hasMoreRef.current = false;
                queryRef.current = null;
                setGames([]);
            }

            try {
                const query =
                    requestedPage === 1
                        ? buildGameFilterQuery(filters)
                        : queryRef.current;

                if (!query) {
                    throw new Error('Liste filtresi bulunamadı.');
                }

                const response = await dispatch(
                    getGamesProcess({
                        page: requestedPage,
                        forceRefresh: mode === 'refresh',
                        genres: slug,
                        ...query,
                    }),
                ).unwrap();

                // Önceki filtreye ait yanıtı ekrana yazma.
                if (version !== requestVersionRef.current) {
                    return;
                }

                if (!Array.isArray(response.results)) {
                    throw new Error('Geçersiz oyun listesi.');
                }

                setGames(previous =>
                    requestedPage === 1
                        ? mergeGames([], response.results)
                        : mergeGames(previous, response.results),
                );

                queryRef.current = query;
                pageRef.current = requestedPage;
                hasMoreRef.current = Boolean(response.next);
            } catch {
                if (version === requestVersionRef.current) {
                    setFailedRequest({
                        page: requestedPage,
                        mode,
                    });
                }
            } finally {
                if (version === requestVersionRef.current) {
                    busyRef.current = false;
                    setLoading(null);
                }
            }
        },
        [dispatch, slug, filters],
    );

    useEffect(() => {
        void loadPage(1, 'initial');

        return () => {
            requestVersionRef.current += 1;
        };
    }, [loadPage]);

    const handleFilterChange = useCallback(
        (nextFilters: GameFilterValue) => {
            requestVersionRef.current += 1;
            busyRef.current = true;

            pageRef.current = 0;
            hasMoreRef.current = false;
            queryRef.current = null;

            setGames([]);
            setFailedRequest(null);
            setLoading('initial');

            listRef.current?.scrollToOffset({
                offset: 0,
                animated: false,
            });

            setFilters(nextFilters);
        },
        [],
    );

    const handleLoadMore = useCallback(() => {
        if (failedRequest) {
            return;
        }

        void loadPage(pageRef.current + 1, 'more');
    }, [failedRequest, loadPage]);

    const handleRefresh = useCallback(() => {
        void loadPage(1, 'refresh');
    }, [loadPage]);

    const handleRetry = useCallback(() => {
        if (!failedRequest) {
            return;
        }

        // Başarısız olan sayfayı tekrar dene.
        void loadPage(
            failedRequest.page,
            failedRequest.mode,
        );
    }, [failedRequest, loadPage]);

    const handleGamePress = useCallback(
        (gameId: number, gameName: string) => {
            navigation.navigate('GameDetail', {
                gameId,
                gameName,
            });
        },
        [navigation],
    );

    const errorContent = (
        <View style={styles.feedback}>
            <AppText style={styles.feedbackText}>
                Oyunlar yüklenemedi. Tekrar deneyebilirsin.
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
    );

    return (
        <Container style={styles.container}>
            <FlatList
                ref={listRef}
                data={games}
                numColumns={2}
                keyExtractor={item => `genre-game-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.35}
                refreshControl={
                    <RefreshControl
                        refreshing={loading === 'refresh'}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <AppText
                            style={styles.header}
                            numberOfLines={2}
                        >
                            {name}
                        </AppText>

                        <GameSortFilter
                            value={filters}
                            onChange={handleFilterChange}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.cardColumn}>
                        <GameCard
                            game={item}
                            onPress={handleGamePress}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    loading === 'initial' ? (
                        <View style={styles.skeletonGrid}>
                            {[0, 1, 2, 3].map(index => (
                                <Skeleton
                                    key={index}
                                    style={styles.skeletonCard}
                                />
                            ))}
                        </View>
                    ) : loading === 'refresh' ? (
                        <View style={styles.feedback}>
                            <AppText color={colors.secondary}>
                                Oyunlar yenileniyor…
                            </AppText>
                        </View>
                    ) : failedRequest ? (
                        errorContent
                    ) : (
                        <View style={styles.feedback}>
                            <EmptyState
                                message={`${name} türünde bu filtrelere uygun oyun bulunamadı.`}
                            />
                        </View>
                    )
                }
                ListFooterComponent={
                    loading === 'more' ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={styles.loader}
                        />
                    ) : failedRequest && games.length > 0 ? (
                        errorContent
                    ) : (
                        <View style={styles.footerSpace} />
                    )
                }
            />
        </Container>
    );
};

export const GenreDetailScreen = () => {
    const route = useRoute<GenreDetailRouteProp>();
    const { slug, name } = route.params;

    return (
        <GenreGames
            key={slug}
            slug={slug}
            name={name}
        />
    );
};