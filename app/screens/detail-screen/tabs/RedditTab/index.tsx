import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    FlatList,
    View,
    TouchableOpacity,
    Linking,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { useAppDispatch } from '@hooks';
import { getGameRedditPostsProcess } from '@actions';
import { AppText, EmptyState } from '@components';
import { colors } from '@theme';
import { useStyles } from '../../styles';

const formatDate = (value?: string | number) => {
    if (value == null) return '';

    const date = new Date(
        typeof value === 'number' && value < 1e12
            ? value * 1000
            : value,
    );

    return Number.isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('tr-TR');
};

export const RedditTab = () => {
    const styles = useStyles();
    const route = useRoute<any>();
    const gameId = Number(route.params.gameId);
    const dispatch = useAppDispatch();

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [moreLoading, setMoreLoading] = useState(false);
    const [error, setError] = useState(false);

    const page = useRef(0);
    const hasNext = useRef(false);
    const locked = useRef(false);
    const generation = useRef(0);

    const fetchPage = useCallback(
        async (reset: boolean) => {
            if (locked.current) return;
            if (!reset && !hasNext.current) return;

            locked.current = true;

            const current = generation.current;
            const nextPage = reset ? 1 : page.current + 1;

            setError(false);

            if (reset) {
                setLoading(true);
            } else {
                setMoreLoading(true);
            }

            try {
                const result = await dispatch(
                    getGameRedditPostsProcess({
                        id: gameId,
                        page: nextPage,
                    }),
                ).unwrap();

                if (current !== generation.current) return;

                if (!Array.isArray(result?.results)) {
                    throw new Error('Geçersiz yanıt');
                }

                setPosts(previous => {
                    const combined = reset
                        ? result.results
                        : [...previous, ...result.results];

                    const unique = new Map<string, any>();

                    combined.forEach((item: any) => {
                        unique.set(String(item.id), item);
                    });

                    return [...unique.values()];
                });

                page.current = nextPage;
                hasNext.current = Boolean(result.next);
            } catch {
                if (current === generation.current) {
                    setError(true);
                }
            } finally {
                if (current === generation.current) {
                    locked.current = false;
                    setLoading(false);
                    setMoreLoading(false);
                }
            }
        },
        [dispatch, gameId],
    );

    useEffect(() => {
        generation.current += 1;
        page.current = 0;
        hasNext.current = false;
        locked.current = false;

        setPosts([]);
        void fetchPage(true);

        return () => {
            generation.current += 1;
        };
    }, [fetchPage]);

    const handlePressUrl = async (value: string) => {
        const url = value?.trim();

        if (!url || !/^https?:\/\//i.test(url)) {
            Alert.alert('Bağlantı açılamadı', 'Geçersiz web adresi.');
            return;
        }

        try {
            await Linking.openURL(url);
        } catch {
            Alert.alert(
                'Bağlantı açılamadı',
                'Lütfen daha sonra tekrar deneyin.',
            );
        }
    };

    const errorContent = (
        <View style={styles.feedback}>
            <AppText style={styles.muted}>
                {posts.length
                    ? 'Sonraki sayfa yüklenemedi.'
                    : 'Topluluk gönderileri yüklenemedi.'}
            </AppText>

            <TouchableOpacity
                accessibilityRole="button"
                style={styles.retryButton}
                onPress={() => {
                    void fetchPage(page.current === 0);
                }}
            >
                <AppText color={colors.primary} bold>
                    Tekrar dene
                </AppText>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.feedback}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

    if (error && posts.length === 0) {
        return errorContent;
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={posts}
                keyExtractor={item => `reddit-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <AppText style={styles.sectionTitle}>
                        Reddit tartışmaları
                    </AppText>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        accessibilityRole="link"
                        style={styles.redditCard}
                        onPress={() => handlePressUrl(item.url)}
                        activeOpacity={0.75}
                    >
                        <AppText bold numberOfLines={3}>
                            {item.name}
                        </AppText>

                        <View style={styles.postMeta}>
                            <AppText
                                variant="caption"
                                color={colors.primary}
                            >
                                {`u/${String(
                                    item.username || 'anonim',
                                ).replace(/^u\//, '')}`}
                            </AppText>

                            <AppText
                                variant="caption"
                                style={styles.muted}
                            >
                                {formatDate(item.created)}
                            </AppText>
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={() => {
                    if (!error) {
                        void fetchPage(false);
                    }
                }}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={<EmptyState />}
                ListFooterComponent={
                    moreLoading ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={{ marginVertical: 20 }}
                        />
                    ) : error ? (
                        errorContent
                    ) : undefined
                }
            />
        </View>
    );
};