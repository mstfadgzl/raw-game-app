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
                    <AppText style={styles.title}>
                        <AppText style={styles.hash}>#</AppText>
                        {name}
                    </AppText>
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