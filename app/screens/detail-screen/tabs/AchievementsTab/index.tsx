import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    FlatList,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { useAppDispatch } from '@hooks';
import { getGameAchievementsProcess } from '@actions';
import { AchievementItem, AppText, EmptyState } from '@components';
import { colors } from '@theme';
import { styles } from '../../styles';

export const AchievementsTab = () => {
    const route = useRoute<any>();
    const gameId = Number(route.params.gameId);
    const dispatch = useAppDispatch();

    const [items, setItems] = useState<any[]>([]);
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
                    getGameAchievementsProcess({
                        id: gameId,
                        page: nextPage,
                    }),
                ).unwrap();

                if (current !== generation.current) return;

                if (!Array.isArray(result?.results)) {
                    throw new Error('Geçersiz yanıt');
                }

                setItems(previous => {
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

        setItems([]);
        void fetchPage(true);

        return () => {
            generation.current += 1;
        };
    }, [fetchPage]);

    const errorContent = (
        <View style={styles.feedback}>
            <AppText style={styles.muted}>
                {items.length
                    ? 'Sonraki sayfa yüklenemedi.'
                    : 'Başarımlar yüklenemedi.'}
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

    if (error && items.length === 0) {
        return errorContent;
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={items}
                keyExtractor={item => `achievement-${item.id}`}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <AppText style={styles.sectionTitle}>
                        Başarımlar
                    </AppText>
                }
                renderItem={({ item }) => (
                    <AchievementItem achievement={item} />
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