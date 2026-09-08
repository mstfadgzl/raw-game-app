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
    TouchableOpacity,
    View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
    getCreatorsProcess,
    getTagsProcess,
} from '@actions';

import { useAppDispatch } from '@hooks';

import {
    AppText,
    Container,
    CreatorCard,
    Skeleton,
} from '@components';

import { DiscoverMainNavigationProp } from '@types';
import { colors } from '@theme';

import { styles } from './styles';

type RawgTag = {
    id: number;
    name: string;
    slug: string;
    games_count?: number;
};

type CreatorItem = {
    id: number;
    name: string;
    image?: string | null;
    image_background?: string | null;
    games?: {
        id: number;
        name: string;
        slug?: string;
    }[];
    games_count?: number;
};

const normalizeTags = (
    items: RawgTag[],
): RawgTag[] => {
    const uniqueTags = new Map<string, RawgTag>();

    items.forEach(tag => {
        if (!tag?.id || !tag?.slug || !tag?.name) {
            return;
        }

        uniqueTags.set(tag.slug, tag);
    });

    return [...uniqueTags.values()].sort(
        (first, second) =>
            (second.games_count || 0) -
            (first.games_count || 0),
    );
};

const formatCount = (value?: number) => {
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value)
    ) {
        return '';
    }

    return Math.trunc(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const DiscoverMainScreen = () => {
    const dispatch = useAppDispatch();

    const navigation =
        useNavigation<DiscoverMainNavigationProp>();

    const [tags, setTags] = useState<RawgTag[]>([]);
    const [creators, setCreators] =
        useState<CreatorItem[]>([]);

    const [tagsLoading, setTagsLoading] = useState(false);
    const [creatorLoading, setCreatorLoading] =
        useState(false);

    const [creatorMoreLoading, setCreatorMoreLoading] =
        useState(false);

    const [tagsError, setTagsError] = useState(false);
    const [creatorError, setCreatorError] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const tagsPage = useRef(0);
    const tagsHasNext = useRef(false);
    const tagsRequestLock = useRef(false);
    const tagsGeneration = useRef(0);

    const creatorsPage = useRef(0);
    const creatorsHasNext = useRef(false);
    const creatorsRequestLock = useRef(false);
    const creatorsGeneration = useRef(0);

    const refreshLock = useRef(false);

    const fetchTags = useCallback(
        async (
            page: number,
            reset: boolean = false,
        ) => {
            if (tagsRequestLock.current) {
                return;
            }

            if (
                !reset &&
                !tagsHasNext.current
            ) {
                return;
            }

            if (reset) {
                tagsGeneration.current += 1;
                tagsPage.current = 0;
                tagsHasNext.current = false;
                setTags([]);
            }

            const currentGeneration =
                tagsGeneration.current;

            tagsRequestLock.current = true;
            setTagsLoading(true);
            setTagsError(false);

            try {
                const response = await dispatch(
                    getTagsProcess({
                        page,
                        pageSize: 40,
                    } as any),
                ).unwrap();

                if (
                    currentGeneration !==
                    tagsGeneration.current
                ) {
                    return;
                }

                const newTags: RawgTag[] =
                    Array.isArray(response?.results)
                        ? response.results
                        : [];

                setTags(previous =>
                    normalizeTags(
                        reset
                            ? newTags
                            : [
                                ...previous,
                                ...newTags,
                            ],
                    ),
                );

                tagsPage.current = page;
                tagsHasNext.current = Boolean(
                    response?.next,
                );
            } catch {
                if (
                    currentGeneration ===
                    tagsGeneration.current
                ) {
                    setTagsError(true);
                }
            } finally {
                if (
                    currentGeneration ===
                    tagsGeneration.current
                ) {
                    tagsRequestLock.current = false;
                    setTagsLoading(false);
                }
            }
        },
        [dispatch],
    );

    const fetchCreators = useCallback(
        async (
            page: number,
            reset: boolean = false,
        ) => {
            if (creatorsRequestLock.current) {
                return;
            }

            if (
                !reset &&
                !creatorsHasNext.current
            ) {
                return;
            }

            if (reset) {
                creatorsGeneration.current += 1;
                creatorsPage.current = 0;
                creatorsHasNext.current = false;
                setCreators([]);
                setCreatorLoading(true);
            } else {
                setCreatorMoreLoading(true);
            }

            const currentGeneration =
                creatorsGeneration.current;

            creatorsRequestLock.current = true;
            setCreatorError(false);

            try {
                const response = await dispatch(
                    getCreatorsProcess({
                        page,
                        pageSize: 40,
                    } as any),
                ).unwrap();

                if (
                    currentGeneration !==
                    creatorsGeneration.current
                ) {
                    return;
                }

                const newCreators: CreatorItem[] =
                    Array.isArray(response?.results)
                        ? response.results
                        : [];

                setCreators(previous => {
                    const creatorMap = new Map<
                        number,
                        CreatorItem
                    >();

                    const allCreators = reset
                        ? newCreators
                        : [
                            ...previous,
                            ...newCreators,
                        ];

                    allCreators.forEach(creator => {
                        if (
                            creator?.id &&
                            creator?.name
                        ) {
                            creatorMap.set(
                                creator.id,
                                creator,
                            );
                        }
                    });

                    return [...creatorMap.values()];
                });

                creatorsPage.current = page;
                creatorsHasNext.current = Boolean(
                    response?.next,
                );
            } catch {
                if (
                    currentGeneration ===
                    creatorsGeneration.current
                ) {
                    setCreatorError(true);
                }
            } finally {
                if (
                    currentGeneration ===
                    creatorsGeneration.current
                ) {
                    creatorsRequestLock.current = false;
                    setCreatorLoading(false);
                    setCreatorMoreLoading(false);
                }
            }
        },
        [dispatch],
    );

    const fetchData = useCallback(async () => {
        await Promise.allSettled([
            fetchTags(1, true),
            fetchCreators(1, true),
        ]);
    }, [fetchTags, fetchCreators]);

    useEffect(() => {
        void fetchData();

        return () => {
            tagsGeneration.current += 1;
            creatorsGeneration.current += 1;
        };
    }, [fetchData]);

    const handleRefresh = async () => {
        if (refreshLock.current) {
            return;
        }

        refreshLock.current = true;
        setRefreshing(true);

        try {
            await fetchData();
        } finally {
            refreshLock.current = false;
            setRefreshing(false);
        }
    };

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <AppText style={styles.eyebrow}>
                    OYUN DÜNYASI
                </AppText>

                <AppText style={styles.mainTitle}>
                    Keşfetmenin başka yolları.
                </AppText>

                <AppText style={styles.subtitle}>
                    Etiketleri incele, oyunların arkasındaki isimleri keşfet.
                </AppText>
            </View>

            <View style={styles.creatorSection}>
                <View style={styles.sectionHeader}>
                    <View>
                        <AppText style={styles.sectionTitle}>
                            Oyunların arkasındaki isimler
                        </AppText>

                        <AppText style={styles.sectionSubtitle}>
                            Sevdiğin oyunları geliştiren kişileri keşfet.
                        </AppText>
                    </View>
                </View>

                {creatorLoading && creators.length === 0 ? (
                    <View style={styles.creatorLoading}>
                        <ActivityIndicator
                            color={colors.primary}
                        />
                    </View>
                ) : creatorError &&
                    creators.length === 0 ? (
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() =>
                            void fetchCreators(1, true)
                        }
                    >
                        <AppText style={styles.retryText}>
                            Yaratıcıları tekrar yükle
                        </AppText>
                    </TouchableOpacity>
                ) : creators.length > 0 ? (
                    <FlatList
                        horizontal
                        data={creators}
                        keyExtractor={item =>
                            `creator-${item.id}`
                        }
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={
                            styles.horizontalPadding
                        }
                        initialNumToRender={4}
                        maxToRenderPerBatch={4}
                        windowSize={5}
                        removeClippedSubviews={false}
                        onEndReached={() => {
                            if (
                                !creatorMoreLoading &&
                                creatorsHasNext.current
                            ) {
                                void fetchCreators(
                                    creatorsPage.current + 1,
                                );
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <CreatorCard
                                creator={item as any}
                                onPress={() =>
                                    navigation.navigate(
                                        'CreatorDetail',
                                        {
                                            id: item.id,
                                            name: item.name,
                                        },
                                    )
                                }
                            />
                        )}
                        ListFooterComponent={
                            creatorMoreLoading ? (
                                <View
                                    style={
                                        styles.creatorFooter
                                    }
                                >
                                    <ActivityIndicator
                                        color={colors.primary}
                                    />
                                </View>
                            ) : creatorError ? (
                                <TouchableOpacity
                                    style={
                                        styles.creatorRetry
                                    }
                                    onPress={() =>
                                        void fetchCreators(
                                            creatorsPage.current + 1,
                                        )
                                    }
                                >
                                    <AppText
                                        style={
                                            styles.retryText
                                        }
                                    >
                                        Tekrar dene
                                    </AppText>
                                </TouchableOpacity>
                            ) : undefined
                        }
                    />
                ) : null}
            </View>

            <View style={styles.tagHeader}>
                <AppText style={styles.sectionTitle}>
                    Tüm etiketler
                </AppText>

                <AppText style={styles.sectionSubtitle}>
                    Bir etikete dokunarak ilgili oyunları görüntüle.
                </AppText>
            </View>
        </View>
    );

    const renderEmpty = () => {
        if (
            tagsLoading &&
            tags.length === 0
        ) {
            return (
                <View style={styles.tagSkeletonGrid}>
                    {[0, 1, 2, 3, 4, 5].map(item => (
                        <View
                            key={item}
                            style={styles.tagColumn}
                        >
                            <Skeleton
                                style={styles.tagSkeleton}
                            />
                        </View>
                    ))}
                </View>
            );
        }

        if (
            tagsError &&
            tags.length === 0
        ) {
            return (
                <View style={styles.feedback}>
                    <AppText style={styles.feedbackTitle}>
                        Etiketler yüklenemedi.
                    </AppText>

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() =>
                            void fetchTags(1, true)
                        }
                    >
                        <AppText style={styles.retryText}>
                            Tekrar dene
                        </AppText>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.feedback}>
                <AppText style={styles.feedbackTitle}>
                    Etiket bulunamadı.
                </AppText>
            </View>
        );
    };

    const isInitialLoading =
        tagsLoading && tags.length === 0;

    if (isInitialLoading) {
        return (
            <Container style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Skeleton style={styles.fullSkeleton} />
                    <Skeleton style={styles.fullSkeleton} />
                </View>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <FlatList
                key="all-tags-grid"
                data={tags}
                numColumns={2}
                keyExtractor={item =>
                    `tag-${item.id}-${item.slug}`
                }
                columnWrapperStyle={styles.tagRow}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={7}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={renderHeader()}
                renderItem={({ item }) => (
                    <View style={styles.tagColumn}>
                        <TouchableOpacity
                            style={styles.tagCard}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel={`${item.name} etiketini aç`}
                            onPress={() =>
                                navigation.navigate(
                                    'TagDetail',
                                    {
                                        slug: item.slug,
                                        name: item.name,
                                    },
                                )
                            }
                        >
                            <View style={styles.tagIcon}>
                                <AppText
                                    style={styles.tagIconText}
                                >
                                    #
                                </AppText>
                            </View>

                            <View style={styles.tagTextContainer}>
                                <AppText
                                    style={styles.tagName}
                                    numberOfLines={2}
                                >
                                    {item.name}
                                </AppText>

                                {!!item.games_count && (
                                    <AppText
                                        style={styles.tagGameCount}
                                    >
                                        {formatCount(
                                            item.games_count,
                                        )}{' '}
                                        oyun
                                    </AppText>
                                )}
                            </View>

                            <AppText style={styles.tagArrow}>
                                ›
                            </AppText>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={renderEmpty()}
                onEndReached={() => {
                    if (
                        !tagsLoading &&
                        tagsHasNext.current
                    ) {
                        void fetchTags(
                            tagsPage.current + 1,
                        );
                    }
                }}
                onEndReachedThreshold={0.4}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListFooterComponent={
                    tagsLoading &&
                        tags.length > 0 ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={styles.footerLoader}
                        />
                    ) : tagsError &&
                        tags.length > 0 ? (
                        <TouchableOpacity
                            style={styles.footerRetry}
                            onPress={() =>
                                void fetchTags(
                                    tagsPage.current + 1,
                                )
                            }
                        >
                            <AppText style={styles.retryText}>
                                Daha fazla etiket yüklenemedi. Tekrar dene
                            </AppText>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.bottomSpace} />
                    )
                }
            />
        </Container>
    );
};