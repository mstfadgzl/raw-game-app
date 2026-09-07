import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getGamesProcess } from '@actions';
import { Container, AppText, GameCard, EmptyState } from '@components';
import { TagDetailRouteProp, GenericNavigationProp, DiscoveryScreenNavigationProp } from '@types';
import { colors } from '@theme';
import { styles } from './styles';

export const TagDetailScreen = () => {
    const route = useRoute<TagDetailRouteProp>();
    const navigation = useNavigation<DiscoveryScreenNavigationProp>();
    const { slug, name } = route.params;
    const dispatch = useAppDispatch();
    const [page, setPage] = useState(1);

    const { data, isLoading } = useAppSelector((state) => state.game);
    const games = data.getGamesProcess?.results || [];

    useEffect(() => {
        setPage(1);
        dispatch(getGamesProcess({ page: 1, tags: slug } as any));
    }, [slug, dispatch]);

    const loadMore = () => {
        if (!isLoading['getGamesProcess'] && data.getGamesProcess?.next) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getGamesProcess({ page: nextPage, tags: slug } as any));
        }
    };

    return (
        <Container style={styles.container}>
            <FlatList
                data={games}
                keyExtractor={(item) => `tag-game-${item.id}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<AppText variant="h1" style={styles.header}>#{name}</AppText>}
                renderItem={({ item }) => (
                    <GameCard
                        game={item}
                        onPress={(gid, gname) => navigation.navigate('GameDetail', { gameId: gid, gameName: gname })}
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isLoading['getGamesMoreLoading'] ? (
                        <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
                    ) : (
                        <View style={{ height: 40 }} />
                    )
                }
                ListEmptyComponent={
                    !isLoading['getGamesProcess'] ? <EmptyState /> : undefined
                }
            />
        </Container>
    );
};