import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getGamesByGenreProcess } from '@actions';
import { Container, AppText, GameCard, EmptyState, Skeleton } from '@components';
import { GenreDetailRouteProp, GenericNavigationProp, DiscoverScreenNavigationProp } from '@types';
import { colors, spacing } from '@theme';
import { styles } from './style';

export const GenreDetailScreen = () => {
    const route = useRoute<GenreDetailRouteProp>();
    const navigation = useNavigation<DiscoverScreenNavigationProp>();
    const { slug, name } = route.params;
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);

    const { data, isLoading } = useAppSelector(state => state.game);
    const games = data.getGamesByGenreProcess?.results || [];

    // Yükleme durumlarını ayırıyoruz (İlk yükleme vs Sayfalama yüklemesi)
    const isFetching = isLoading['getGamesByGenreProcess'];
    const isInitialLoad = isFetching && page === 1;
    const isMoreLoading = isFetching && page > 1;

    useEffect(() => {
        // Farklı bir türe girildiğinde sayfayı garanti olarak 1'e sıfırla
        setPage(1);
        dispatch(getGamesByGenreProcess({ genreSlug: slug, page: 1 }));
    }, [slug, dispatch]);

    const loadMore = () => {
        if (!isFetching && data.getGamesByGenreProcess?.next) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getGamesByGenreProcess({ genreSlug: slug, page: nextPage }));
        }
    };

    // Veri ilk defa çekiliyorsa iskelet (Skeleton) göster
    if (isInitialLoad && games.length === 0) {
        return (
            <Container style={styles.container}>
                <View style={{ padding: spacing.md }}>
                    <Skeleton style={{ height: 40, width: 200, marginBottom: spacing.md }} />
                    <Skeleton style={{ height: 200, marginBottom: spacing.md }} />
                    <Skeleton style={{ height: 200 }} />
                </View>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <FlatList
                data={games}
                numColumns={2}
                keyExtractor={(item) => `genre-game-${item.id}`}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
                        <AppText variant="h1" style={styles.header}>{name} Oyunları</AppText>
                    </View>
                }
                renderItem={({ item }) => (
                    // Kartların ekran kenarlarına yapışmaması için sarmaladık
                    <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
                        <GameCard
                            game={item}
                            onPress={(id, gname) => navigation.navigate('GameDetail', { gameId: id, gameName: gname })}
                        />
                    </View>
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isMoreLoading ? (
                        <ActivityIndicator color={colors.primary} size="large" style={{ marginVertical: 20 }} />
                    ) : (
                        <View style={{ height: 40 }} />
                    )
                }
                // Artık sayfa titremeyecek, sadece ilk yükleme değilse ve veri yoksa çalışacak
                ListEmptyComponent={
                    !isInitialLoad && games.length === 0 ? <EmptyState message={`${name} türünde oyun bulunamadı.`} /> : undefined
                }
            />
        </Container>
    );
};