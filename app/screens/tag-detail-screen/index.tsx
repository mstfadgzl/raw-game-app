import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@hooks';
import { getGamesProcess } from '@actions';
import { Container, AppText, EmptyState, GameCard } from '@components';
import {
    DiscoveryScreenNavigationProp,
    TagDetailRouteProp,
} from '@types';
import { colors } from '@theme';
import { styles } from './styles';

export const TagDetailScreen = () => {
    const route = useRoute<TagDetailRouteProp>();
    const navigation = useNavigation<DiscoveryScreenNavigationProp>();
    const { slug, name } = route.params;

    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useAppSelector((state) => state.game);

    const games = data.getGamesProcess?.results ?? [];
    const initialLoading = isLoading['getGamesProcess'];
    const moreLoading = isLoading['getGamesMoreLoading'];

    useEffect(() => {
        setPage(1);
        dispatch(getGamesProcess({ page: 1, tags: slug } as any));
    }, [slug, dispatch]);

    const loadMore = () => {
        if (
            initialLoading ||
            moreLoading ||
            !data.getGamesProcess?.next
        ) {
            return;
        }

        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(getGamesProcess({ page: nextPage, tags: slug } as any));
    };

    return (
        <Container style={styles.container}>
            <FlatList
                key={`tag-grid-${slug}`}
                data={games}
                numColumns={2}
                keyExtractor={(item) => `tag-game-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                columnWrapperStyle={styles.row}
                ListHeaderComponent={
                    <View>
                        <View style={styles.hero}>
                            <View
                                pointerEvents="none"
                                style={styles.decorativeCircle}
                            />

                            <View style={styles.badge}>
                                <View style={styles.dot} />
                                <AppText style={styles.badgeText}>
                                    OYUN KOLEKSİYONU
                                </AppText>
                            </View>

                            <AppText style={styles.title}>
                                <AppText style={styles.hash}>#</AppText>
                                {name}
                            </AppText>

                            <AppText style={styles.subtitle}>
                                Yeni dünyalar, yeni favoriler.
                                {'\n'}Sıradaki oyununu keşfet.
                            </AppText>

                            <View style={styles.heroBottom}>
                                <View style={styles.accentLine} />
                                <AppText style={styles.heroCaption}>
                                    KEŞFET • OYNA • TEKRARLA
                                </AppText>
                            </View>
                        </View>

                        <View style={styles.sectionHeader}>
                            <AppText style={styles.sectionTitle}>
                                Keşif listesi
                            </AppText>

                            <View style={styles.countBadge}>
                                <AppText style={styles.countText}>
                                    {games.length} oyun yüklendi
                                </AppText>
                            </View>
                        </View>
                    </View>
                }
                renderItem={({ item, index }) => (
                    <View style={styles.cardColumn}>
                        <View style={styles.cardShell}>
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

                        <View style={styles.cardBottom}>
                            <AppText style={styles.cardIndex}>
                                {String(index + 1).padStart(2, '0')}
                            </AppText>
                            <View style={styles.cardLine} />
                        </View>
                    </View>
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    moreLoading ? (
                        <ActivityIndicator
                            color={colors.primary}
                            style={styles.loader}
                        />
                    ) : (
                        <View style={styles.footerSpace} />
                    )
                }
                ListEmptyComponent={
                    initialLoading ? (
                        <ActivityIndicator
                            color={colors.primary}
                            size="large"
                            style={styles.loader}
                        />
                    ) : (
                        <EmptyState />
                    )
                }
            />
        </Container>
    );
};