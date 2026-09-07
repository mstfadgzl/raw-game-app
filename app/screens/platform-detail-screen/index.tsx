import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getGamesProcess } from '@actions';
import { Container, AppText, GameCard, EmptyState, Skeleton } from '@components';
import { PlatformDetailRouteProp, GenericNavigationProp, DiscoverScreenNavigationProp } from '@types';
import { colors } from '@theme';
import { styles } from './styles';

export const PlatformDetailScreen = () => {
    const route = useRoute<PlatformDetailRouteProp>();
    const navigation = useNavigation<DiscoverScreenNavigationProp>();
    const { id, name } = route.params;
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    // Hayalet veriyi engellemek için ekranın hazır olma durumu
    const [isScreenReady, setIsScreenReady] = useState(false);

    const { data, isLoading } = useAppSelector((state) => state.game);

    const games = data.getGamesProcess?.results || [];

    // Yükleme durumlarını net bir şekilde ayırıyoruz
    const isFetching = !!isLoading['getGamesProcess'];
    const isMoreLoading = !!isLoading['getGamesMoreLoading'];

    // Pull-to-refresh için: Sadece ekran hazırsa ve ilk sayfa çekiliyorsa dönsün
    const isRefreshing = isFetching && page === 1 && isScreenReady;

    // Platform (ID) değiştiğinde tetiklenir
    useEffect(() => {
        setIsScreenReady(false); // Ekranı gizle (İskelete geç)
        setPage(1); // Sayfayı sıfırla
        dispatch(getGamesProcess({ page: 1, platforms: id }));
    }, [id, dispatch]);

    // Veri çekme işlemi bittiğinde ekranı göster
    useEffect(() => {
        if (!isFetching) {
            setIsScreenReady(true);
        }
    }, [isFetching]);

    const handleRefresh = () => {
        setPage(1);
        dispatch(getGamesProcess({ page: 1, platforms: id }));
    };

    const loadMore = () => {
        const hasNext = data.getGamesProcess?.next;
        if (!isFetching && !isMoreLoading && hasNext) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getGamesProcess({ page: nextPage, platforms: id }));
        }
    };

    // Ekran hazır değilse veya ilk defa veri çekiliyorsa İskelet (Skeleton) göster
    if (!isScreenReady || (isFetching && page === 1 && !isRefreshing)) {
        return (
            <Container>
                <View style={styles.headerContainer}>
                    <AppText variant="h1" style={styles.header}>{name}</AppText>
                </View>
                {[1, 2, 3].map(i => <Skeleton key={`skeleton-${i}`} style={styles.skeletonCard} />)}
            </Container>
        );
    }

    return (
        <Container style={{ paddingHorizontal: 0 }}>
            <FlatList
                data={games}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 16
                }}
                keyExtractor={(item) => `plt-game-${item.id}`}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <AppText variant="h1" style={styles.header}>{name}</AppText>
                        <AppText variant="caption" color={colors.primary}>
                            BU PLATFORMDAKİ POPÜLER OYUNLAR
                        </AppText>
                    </View>
                }
                renderItem={({ item }) => (
                    <GameCard
                        game={item}
                        onPress={(gid, gname) =>
                            navigation.navigate('GameDetail', { gameId: gid, gameName: gname })
                        }
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                // RefreshControl dinamik hale getirildi
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListFooterComponent={
                    isMoreLoading ? (
                        <ActivityIndicator color={colors.primary} style={styles.loader} size="large" />
                    ) : <View style={{ height: 50 }} />
                }
                // EmptyState prop hatasından arındırıldı
                ListEmptyComponent={
                    games.length === 0 ? <EmptyState /> : undefined
                }
            />
        </Container>
    );
};