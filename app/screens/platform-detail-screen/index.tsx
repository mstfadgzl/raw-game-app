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
    ErrorState,
    GameCard,
    GameSortFilter,
    Skeleton,
    buildGameFilterQuery,
} from '@components';

import type { GameFilterValue } from '@components';

import type {
    DiscoverScreenNavigationProp,
    IGame,
    PlatformDetailRouteProp,
} from '@types';

import { colors } from '@theme';
import { styles } from './styles';

type LoadMode = 'initial' | 'refresh' | 'more';

interface PlatformGamesProps {
    platformId: number;
    name: string;
}

const mergeUniqueGames = (
    previous: IGame[],
    incoming: IGame[],
): IGame[] => {
    const gamesById = new Map<number, IGame>();

    for (const game of previous) {
        gamesById.set(game.id, game);
    }

    for (const game of incoming) {
        gamesById.set(game.id, game);
    }

    return Array.from(gamesById.values());
};

const PlatformGames = ({
    platformId,
    name,
}: PlatformGamesProps) => {
    const dispatch = useAppDispatch();

    const navigation =
        useNavigation<DiscoverScreenNavigationProp>();

    const listRef = useRef<FlatList<IGame>>(null);

    const [filters, setFilters] = useState<GameFilterValue>(
        () => ({ ...DEFAULT_GAME_FILTERS }),
    );

    const [games, setGames] = useState<IGame[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Son başarıyla yüklenen sayfa.
    const pageRef = useRef(0);
    const hasMoreRef = useRef(false);

    // State güncellemesini beklemeden tekrar isteği engeller.
    const requestBusyRef = useRef(false);

    // Eski isteğin yeni filtre sonuçlarını ezmesini engeller.
    const requestVersionRef = useRef(0);

    const loadPage = useCallback(
        async (requestedPage: number, mode: LoadMode) => {
            if (
                mode !== 'initial' &&
                requestBusyRef.current
            ) {
                return;
            }

            if (
                mode === 'more' &&
                (!hasMoreRef.current || pageRef.current === 0)
            ) {
                return;
            }

            requestBusyRef.current = true;

            const requestVersion =
                ++requestVersionRef.current;

            setHasError(false);
            setInitialLoading(mode === 'initial');
            setRefreshing(mode === 'refresh');
            setLoadingMore(mode === 'more');

            if (mode === 'initial') {
                setGames([]);
                pageRef.current = 0;
                hasMoreRef.current = false;
            }

            try {
                if (
                    !Number.isInteger(platformId) ||
                    platformId <= 0
                ) {
                    throw new Error('Geçersiz platform.');
                }

                const query = buildGameFilterQuery(filters);

                const response = await dispatch(
                    getGamesProcess({
                        page: requestedPage,
                        platforms: platformId,
                        ...query,
                    }),
                ).unwrap();

                if (
                    requestVersion !==
                    requestVersionRef.current
                ) {
                    return;
                }

                const incomingGames = response.results ?? [];

                setGames(previous =>
                    requestedPage === 1
                        ? mergeUniqueGames([], incomingGames)
                        : mergeUniqueGames(
                            previous,
                            incomingGames,
                        ),
                );

                // Başarısız istekte sayfa artırılmaz.
                pageRef.current = requestedPage;
                hasMoreRef.current = Boolean(response.next);
            } catch {
                if (
                    requestVersion ===
                    requestVersionRef.current
                ) {
                    setHasError(true);
                }
            } finally {
                if (
                    requestVersion ===
                    requestVersionRef.current
                ) {
                    requestBusyRef.current = false;

                    setInitialLoading(false);
                    setRefreshing(false);
                    setLoadingMore(false);
                }
            }
        },
        [dispatch, platformId, filters],
    );

    useEffect(() => {
        void loadPage(1, 'initial');

        return () => {
            // Ekran kapanınca veya filtre değişince
            // önceki isteğin yerel state'i değiştirmesine izin verme.
            requestVersionRef.current += 1;
        };
    }, [loadPage]);

    const handleFilterChange = useCallback(
        (nextFilters: GameFilterValue) => {
            // Yeni effect çalışana kadar eski yanıtı ve
            // eski listeye ait sayfalama olaylarını engelle.
            requestVersionRef.current += 1;
            requestBusyRef.current = true;
            hasMoreRef.current = false;
            pageRef.current = 0;

            setGames([]);
            setHasError(false);
            setInitialLoading(true);
            setRefreshing(false);
            setLoadingMore(false);

            listRef.current?.scrollToOffset({
                offset: 0,
                animated: false,
            });

            setFilters(nextFilters);
        },
        [],
    );

    const handleRefresh = useCallback(() => {
        void loadPage(1, 'refresh');
    }, [loadPage]);

    const handleLoadMore = useCallback(() => {
        // Hata varsa otomatik tekrar deneme döngüsü başlatma.
        if (hasError) {
            return;
        }

        void loadPage(pageRef.current + 1, 'more');
    }, [hasError, loadPage]);

    const handleRetry = useCallback(() => {
        if (pageRef.current === 0) {
            void loadPage(1, 'initial');
            return;
        }

        // Yenileme veya sayfalama hatasında mevcut liste korunur.
        void loadPage(1, 'refresh');
    }, [loadPage]);

    const handleGamePress = useCallback(
        (gameId: number, gameName: string) => {
            navigation.navigate('GameDetail', {
                gameId,
                gameName,
            });
        },
        [navigation],
    );

    return (
        <Container style={styles.container}>
            <FlatList
                ref={listRef}
                data={games}
                numColumns={2}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.35}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
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
                    <View style={styles.cardWrapper}>
                        <GameCard
                            game={item}
                            onPress={handleGamePress}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    initialLoading ? (
                        <View style={styles.skeletonGrid}>
                            {[0, 1, 2, 3].map(index => (
                                <Skeleton
                                    key={index}
                                    style={styles.skeletonCard}
                                />
                            ))}
                        </View>
                    ) : refreshing ? (
                        <View style={styles.emptyContainer}>
                            <AppText color={colors.secondary}>
                                Oyunlar yenileniyor…
                            </AppText>
                        </View>
                    ) : hasError ? (
                        <View style={styles.emptyContainer}>
                            <ErrorState onRetry={handleRetry} />
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <EmptyState
                                message="Bu filtrelere uygun oyun bulunamadı."
                            />
                        </View>
                    )
                }
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={styles.loader}
                        />
                    ) : hasError && games.length > 0 ? (
                        <View style={styles.footerError}>
                            <AppText
                                style={styles.footerErrorText}
                            >
                                Oyunlar yüklenemedi.
                            </AppText>

                            <Pressable
                                onPress={handleRetry}
                                accessibilityRole="button"
                                style={styles.retryButton}
                            >
                                <AppText
                                    color={colors.primary}
                                    bold
                                >
                                    Tekrar dene
                                </AppText>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.footerSpace} />
                    )
                }
            />
        </Container>
    );
};

export const PlatformDetailScreen = () => {
    const route = useRoute<PlatformDetailRouteProp>();
    const { id, name } = route.params;

    const platformId = Number(id);

    return (
        <PlatformGames
            key={platformId}
            platformId={platformId}
            name={name}
        />
    );
};