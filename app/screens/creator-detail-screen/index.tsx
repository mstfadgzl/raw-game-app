import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    FlatList,
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

interface FailedRequest {
    page: number;
    mode: LoadMode;
}

const mergeUniqueGames = (
    previous: IGame[],
    incoming: IGame[],
): IGame[] => {
    const gameMap = new Map<number, IGame>();

    [...previous, ...incoming].forEach(game => {
        if (game?.id) {
            gameMap.set(game.id, game);
        }
    });

    return Array.from(gameMap.values());
};

export const GenreDetailScreen = () => {
    const route = useRoute<GenreDetailRouteProp>();
    const navigation =
        useNavigation<DiscoverScreenNavigationProp>();

    const { slug, name } = route.params;
    const dispatch = useAppDispatch();

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
    const hasNextRef = useRef(false);
    const requestLockRef = useRef(false);
    const requestVersionRef = useRef(0);

    const loadPage = useCallback(
        async (requestedPage: number, mode: LoadMode) => {
            if (
                mode !== 'initial' &&
                requestLockRef.current
            ) {
                return;
            }

            if (
                mode === 'more' &&
                (
                    !hasNextRef.current ||
                    pageRef.current === 0
                )
            ) {
                return;
            }

            requestLockRef.current = true;

            const currentVersion =
                ++requestVersionRef.current;

            setLoading(mode);
            setFailedRequest(null);

            if (mode === 'initial') {
                pageRef.current = 0;
                hasNextRef.current = false;
                setGames([]);
            }

            try {
                const query = buildGameFilterQuery(filters);

                const action = await dispatch(
                    getGamesProcess({
                        page: requestedPage,
                        genres: slug,
                        ordering: query.ordering,
                        dates: query.dates,
                        metacritic: query.metacritic,
                    }),
                );

                if (currentVersion !== requestVersionRef.current) {
                    return;
                }

                if (!getGamesProcess.fulfilled.match(action)) {
                    throw new Error('Oyun listesi alınamadı.');
                }

                const response = action.payload;
                const incomingGames = response.results ?? [];

                setGames(previousGames =>
                    requestedPage === 1
                        ? mergeUniqueGames([], incomingGames)
                        : mergeUniqueGames(
                            previousGames,
                            incomingGames,
                        ),
                );

                pageRef.current = requestedPage;
                hasNextRef.current = Boolean(response.next);
            } catch {
                if (currentVersion === requestVersionRef.current) {
                    setFailedRequest({
                        page: requestedPage,
                        mode,
                    });
                }
            } finally {
                if (
                    currentVersion ===
                    requestVersionRef.current
                ) {
                    requestLockRef.current = false;
                    setLoading(null);
                }
            }
        },
        [dispatch, filters, slug],
    );

    useEffect(() => {
        void loadPage(1, 'initial');

        return () => {
            requestVersionRef.current += 1;
            requestLockRef.current = false;
        };
    }, [loadPage]);

    const handleFilterChange = useCallback(
        (nextFilters: GameFilterValue) => {
            // Eski isteğin sonucunu geçersiz kıl.
            requestVersionRef.current += 1;
            requestLockRef.current = false;

            pageRef.current = 0;
            hasNextRef.current = false;

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
        if (
            loading !== null ||
            failedRequest ||
            !hasNextRef.current
        ) {
            return;
        }

        void loadPage(pageRef.current + 1, 'more');
    }, [failedRequest, loadPage, loading]);

    const handleRefresh = useCallback(() => {
        void loadPage(1, 'refresh');
    }, [loadPage]);

    const handleRetry = useCallback(() => {
        if (!failedRequest) {
            return;
        }

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

    const renderEmptyState = () => {
        if (loading === 'initial') {
            return (
                <View style={styles.skeletonGrid}>
                    {[0, 1, 2, 3].map(index => (
                        <Skeleton
                            key={`genre-skeleton-${index}`}
                            style={styles.skeletonCard}
                        />
                    ))}
                </View>
            );
        }

        if (loading === 'refresh') {
            return (
                <View style={styles.feedback}>
                    <AppText color={colors.secondary}>
                        Oyunlar yenileniyor…
                    </AppText>
                </View>
            );
        }

        if (failedRequest) {
            return (
                <View style={styles.feedback}>
                    <AppText style={styles.feedbackText}>
                        Oyunlar yüklenemedi.
                    </AppText>

                    <AppText
                        color={colors.primary}
                        bold
                        onPress={handleRetry}
                    >
                        Tekrar dene
                    </AppText>
                </View>
            );
        }

        return (
            <View style={styles.feedback}>
                <EmptyState
                    message={`${name} türünde uygun oyun bulunamadı.`}
                />
            </View>
        );
    };

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
                ListEmptyComponent={renderEmptyState()}
                ListFooterComponent={
                    loading === 'more' ? (
                        <ActivityIndicator
                            color={colors.primary}
                            size="large"
                            style={styles.loader}
                        />
                    ) : failedRequest && games.length > 0 ? (
                        <View style={styles.feedback}>
                            <AppText
                                color={colors.primary}
                                bold
                                onPress={handleRetry}
                            >
                                Yüklenemedi · Tekrar dene
                            </AppText>
                        </View>
                    ) : (
                        <View style={styles.footerSpace} />
                    )
                }
            />
        </Container>
    );
};