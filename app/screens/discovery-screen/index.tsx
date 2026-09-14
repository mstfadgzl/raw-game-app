import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector, useSettings } from '@hooks';
import { localizeCatalogName } from '../../i18n';

import {
    getGamesProcess,
    getGenresProcess,
    getPlatformsProcess,
} from '@actions';

import {
    AppText,
    Container,
    DEFAULT_GAME_FILTERS,
    GameCard,
    GameSortFilter,
    PlatformCard,
    Skeleton,
    buildGameFilterQuery,
} from '@components';

import type { GameFilterValue } from '@components';

import type {
    DiscoveryScreenNavigationProp,
    IGame,
} from '@types';

import { useStyles } from './styles';

type PresetId =
    | 'weekly'
    | 'monthly'
    | 'popular'
    | 'year'
    | 'upcoming'
    | 'custom';

type RequestMode = 'initial' | 'refresh' | 'more';

interface Selection {
    preset: PresetId;
    filters: GameFilterValue;
}

interface FailedRequest {
    page: number;
    mode: RequestMode;
}

const PRESETS: ReadonlyArray<{
    id: Exclude<PresetId, 'custom'>;
    label: string;
}> = [
        { id: 'weekly', label: 'Son 7 gün' },
        { id: 'monthly', label: 'Son 30 gün' },
        { id: 'popular', label: 'Popüler' },
        { id: 'year', label: 'Bu yıl' },
        { id: 'upcoming', label: 'Yakında' },
    ];

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const createPreset = (
    preset: Exclude<PresetId, 'custom'>,
): Selection => {
    const filters: GameFilterValue = {
        ...DEFAULT_GAME_FILTERS,
    };

    if (preset === 'year') {
        const year = new Date().getFullYear();

        filters.ordering = '-metacritic';
        filters.startYear = year;
        filters.endYear = year;
    }

    if (preset === 'upcoming') {
        filters.releaseStatus = 'upcoming';
    }

    return { preset, filters };
};

const buildDiscoveryQuery = (
    selection: Selection,
    now: Date = new Date(),
) => {
    const query = buildGameFilterQuery(
        selection.filters,
        now,
    );

    // Bu hazır seçimler yıl yerine gün hassasiyetinde çalışır.
    if (
        selection.preset === 'weekly' ||
        selection.preset === 'monthly'
    ) {
        const numberOfDays =
            selection.preset === 'weekly' ? 7 : 30;

        const start = new Date(now);

        // Bugün dahil toplam 7 veya 30 takvim günü.
        start.setDate(start.getDate() - (numberOfDays - 1));

        query.dates = `${formatDate(start)},${formatDate(now)}`;
    }

    return query;
};

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

export const DiscoveryScreen = () => {
    const { colors, language } = useSettings();
    const styles = useStyles();
    const dispatch = useAppDispatch();

    const navigation =
        useNavigation<DiscoveryScreenNavigationProp>();

    const platforms = useAppSelector(
        state =>
            state.discovery.data.getPlatformsProcess?.results,
    );

    const genres = useAppSelector(
        state => state.genre.data.getGenresProcess?.results,
    );

    const [selection, setSelection] = useState<Selection>(
        () => createPreset('weekly'),
    );

    const [games, setGames] = useState<IGame[]>([]);
    const [loading, setLoading] =
        useState<RequestMode | null>('initial');

    const [failedRequest, setFailedRequest] =
        useState<FailedRequest | null>(null);

    const pageRef = useRef(0);
    const hasNextRef = useRef(false);
    const requestLockRef = useRef(false);
    const generationRef = useRef(0);

    // Aynı listenin bütün sayfalarında aynı tarih aralığı kullanılır.
    // Yenileme veya filtre değişiminde yeniden oluşturulur.
    const queryRef = useRef<
        ReturnType<typeof buildDiscoveryQuery> | null
    >(null);

    const sectionTitle = useMemo(() => {
        const { preset, filters } = selection;

        if (preset === 'weekly') {
            return 'Son 7 günde çıkanlar';
        }

        if (preset === 'monthly') {
            return 'Son 30 günde çıkanlar';
        }

        if (preset === 'year') {
            return `${filters.startYear} oyunları`;
        }

        if (preset === 'upcoming') {
            return 'Yakında çıkacak oyunlar';
        }

        if (
            preset === 'popular' &&
            filters.ordering === '-added'
        ) {
            return 'Popüler oyunlar';
        }

        return 'Oyunlar';
    }, [selection]);

    // Oyun filtreleri değişince bu istekler tekrarlanmaz.
    useEffect(() => {
        dispatch(getPlatformsProcess({ page: 1 }));
        dispatch(getGenresProcess());
    }, [dispatch]);

    const fetchGames = useCallback(
        async (
            requestedPage: number,
            mode: RequestMode,
        ) => {
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

            const generation = ++generationRef.current;

            setLoading(mode);
            setFailedRequest(null);

            if (mode === 'initial') {
                pageRef.current = 0;
                hasNextRef.current = false;
                queryRef.current = null;
                setGames([]);
            }

            try {
                const query =
                    requestedPage === 1
                        ? buildDiscoveryQuery(selection)
                        : queryRef.current;

                if (!query) {
                    throw new Error('Liste filtresi bulunamadı.');
                }

                const response = await dispatch(
                    getGamesProcess({
                        page: requestedPage,
                        ...query,
                        forceRefresh: mode === 'refresh',
                    }),
                ).unwrap();

                if (generation !== generationRef.current) {
                    return;
                }

                if (!Array.isArray(response.results)) {
                    throw new Error('Geçersiz oyun listesi.');
                }

                setGames(previous =>
                    requestedPage === 1
                        ? mergeGames([], response.results)
                        : mergeGames(
                            previous,
                            response.results,
                        ),
                );

                queryRef.current = query;
                pageRef.current = requestedPage;
                hasNextRef.current = Boolean(response.next);
            } catch {
                if (generation === generationRef.current) {
                    setFailedRequest({
                        page: requestedPage,
                        mode,
                    });
                }
            } finally {
                if (generation === generationRef.current) {
                    requestLockRef.current = false;
                    setLoading(null);
                }
            }
        },
        [dispatch, selection],
    );

    useEffect(() => {
        void fetchGames(1, 'initial');

        return () => {
            generationRef.current += 1;
        };
    }, [fetchGames]);

    const applySelection = useCallback(
        (nextSelection: Selection) => {
            // Yeni effect başlamadan eski istekleri geçersiz kıl.
            generationRef.current += 1;
            requestLockRef.current = true;

            pageRef.current = 0;
            hasNextRef.current = false;
            queryRef.current = null;

            setGames([]);
            setFailedRequest(null);
            setLoading('initial');
            setSelection(nextSelection);
        },
        [],
    );

    const handlePresetChange = (
        preset: Exclude<PresetId, 'custom'>,
    ) => {
        const next = createPreset(preset);
        const currentFilters = selection.filters;
        const nextFilters = next.filters;

        const unchanged =
            selection.preset === next.preset &&
            currentFilters.ordering === nextFilters.ordering &&
            currentFilters.releaseStatus ===
            nextFilters.releaseStatus &&
            currentFilters.startYear === nextFilters.startYear &&
            currentFilters.endYear === nextFilters.endYear &&
            currentFilters.minMetacritic ===
            nextFilters.minMetacritic;

        if (!unchanged) {
            applySelection(next);
        }
    };

    const handleFilterChange = (
        nextFilters: GameFilterValue,
    ) => {
        const previous = selection.filters;

        const dateFilterChanged =
            previous.releaseStatus !==
            nextFilters.releaseStatus ||
            previous.startYear !== nextFilters.startYear ||
            previous.endYear !== nextFilters.endYear;

        // Tarih/çıkış durumu değişirse hazır dönemi bırak.
        // Yalnızca sıralama veya puan değişirse dönemi koru.
        const preset: PresetId = dateFilterChanged
            ? 'custom'
            : selection.preset === 'popular' &&
                nextFilters.ordering !== '-added'
                ? 'custom'
                : selection.preset;

        applySelection({
            preset,
            filters: nextFilters,
        });
    };

    const handleLoadMore = useCallback(() => {
        if (failedRequest) {
            return;
        }

        void fetchGames(pageRef.current + 1, 'more');
    }, [failedRequest, fetchGames]);

    const handleRefresh = useCallback(() => {
        void fetchGames(1, 'refresh');
    }, [fetchGames]);

    const handleRetry = useCallback(() => {
        if (!failedRequest) {
            return;
        }

        void fetchGames(
            failedRequest.page,
            failedRequest.mode,
        );
    }, [failedRequest, fetchGames]);

    const handleGamePress = useCallback(
        (gameId: number, gameName: string) => {
            navigation.navigate('GameDetail', {
                gameId,
                gameName,
            });
        },
        [navigation],
    );

    const renderGame = useCallback(({ item }: { item: IGame }) => (
        <View style={styles.gameColumn}>
            <GameCard game={item} onPress={handleGamePress} />
        </View>
    ), [handleGamePress, styles]);

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <AppText style={styles.mainTitle}>
                    Sıradaki oyununu bul.
                </AppText>

                <AppText style={styles.subtitle}>
                    Platformları ve oyun türlerini keşfet.
                </AppText>
            </View>

            {!!platforms?.length && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AppText style={styles.sectionTitle}>
                            Platformlar
                        </AppText>
                    </View>

                    <FlatList
                        horizontal
                        data={platforms}
                        keyExtractor={item =>
                            `platform-${item.id}`
                        }
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={
                            styles.horizontalContent
                        }
                        renderItem={({ item }) => (
                            <PlatformCard
                                name={item.name}
                                image={item.image_background}
                                gamesCount={item.games_count}
                                onPress={() =>
                                    navigation.navigate(
                                        'PlatformDetail',
                                        {
                                            id: item.id,
                                            name: item.name,
                                        },
                                    )
                                }
                            />
                        )}
                    />
                </View>
            )}

            {!!genres?.length && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AppText style={styles.sectionTitle}>
                            Oyun türleri
                        </AppText>
                    </View>

                    <FlatList
                        horizontal
                        data={genres}
                        keyExtractor={item =>
                            `genre-${item.id}`
                        }
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={
                            styles.horizontalContent
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.8}
                                style={styles.genreChip}
                                onPress={() =>
                                    navigation.navigate(
                                        'GenreDetail',
                                        {
                                            slug: item.slug,
                                            name: item.name,
                                        },
                                    )
                                }
                            >
                                <AppText style={styles.genreText}>
                                    {localizeCatalogName(language, item.name)}
                                </AppText>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <View style={styles.separator} />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContent}
            >
                {PRESETS.map(preset => {
                    const selected =
                        selection.preset === preset.id;

                    return (
                        <TouchableOpacity
                            key={preset.id}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            activeOpacity={0.8}
                            onPress={() =>
                                handlePresetChange(preset.id)
                            }
                            style={[
                                styles.filterChip,
                                selected
                                    ? styles.selectedFilterChip
                                    : {},
                            ]}
                        >
                            <AppText
                                style={[
                                    styles.filterText,
                                    selected
                                        ? styles.selectedFilterText
                                        : {},
                                ]}
                            >
                                {preset.label}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}

                {selection.preset === 'custom' && (
                    <View
                        style={[
                            styles.filterChip,
                            styles.selectedFilterChip,
                        ]}
                    >
                        <AppText
                            style={[
                                styles.filterText,
                                styles.selectedFilterText,
                            ]}
                        >
                            Özel
                        </AppText>
                    </View>
                )}
            </ScrollView>

            <View style={styles.gamesHeader}>
                <AppText style={styles.gamesTitle}>
                    {sectionTitle}
                </AppText>

                <GameSortFilter
                    value={selection.filters}
                    onChange={handleFilterChange}
                />
            </View>
        </View>
    );

    const renderEmpty = () => {
        if (loading === 'initial') {
            return (
                <View style={styles.skeletonGrid}>
                    {[0, 1, 2, 3].map(item => (
                        <View
                            key={item}
                            style={styles.skeletonColumn}
                        >
                            <Skeleton
                                style={styles.skeletonImage}
                            />
                            <Skeleton
                                style={styles.skeletonText}
                            />
                            <Skeleton
                                style={styles.skeletonSmallText}
                            />
                        </View>
                    ))}
                </View>
            );
        }

        if (loading === 'refresh') {
            return (
                <View style={styles.feedback}>
                    <AppText style={styles.feedbackText}>
                        Oyunlar yenileniyor…
                    </AppText>
                </View>
            );
        }

        return (
            <View style={styles.feedback}>
                <AppText style={styles.feedbackTitle}>
                    {failedRequest
                        ? 'Oyunlar yüklenemedi'
                        : 'Uygun oyun bulunamadı'}
                </AppText>

                <AppText style={styles.feedbackText}>
                    {failedRequest
                        ? 'Bağlantını kontrol edip tekrar deneyebilirsin.'
                        : 'Filtreleri değiştirebilir veya başka bir dönem seçebilirsin.'}
                </AppText>

                {failedRequest && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.retryButton}
                        onPress={handleRetry}
                    >
                        <AppText style={styles.retryText}>
                            Tekrar dene
                        </AppText>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <Container style={styles.container}>
            <FlatList
                data={games}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={7}
                numColumns={2}
                keyExtractor={item => `game-${item.id}`}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader()}
                renderItem={renderGame}
                ListEmptyComponent={renderEmpty()}
                refreshControl={
                    <RefreshControl
                        refreshing={loading === 'refresh'}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                    loading === 'more' ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={styles.footerLoader}
                        />
                    ) : failedRequest && games.length > 0 ? (
                        <TouchableOpacity
                            accessibilityRole="button"
                            onPress={handleRetry}
                            style={styles.footerRetry}
                        >
                            <AppText style={styles.retryText}>
                                Yüklenemedi · Tekrar dene
                            </AppText>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.footerSpace} />
                    )
                }
            />
        </Container>
    );
};
