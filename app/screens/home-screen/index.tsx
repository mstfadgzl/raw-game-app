import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@hooks'; // Path'i kontrol et
import { getGamesProcess } from '../../redux/actions/gameActions';
import { getGenresProcess } from '../../redux/actions/genreActions';
import {
    Container,
    GameCard,
    Skeleton,
    ErrorState,
    EmptyState,
    AppText
} from '@components';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { colors } from '@theme';
import { HomeScreenNavigationProp } from '@types';


export const HomeScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAppSelector(state => state.game);
    const { data: genreData } = useAppSelector(state => state.genre);
    const games = data.getGamesProcess?.results || [];
    const genres = genreData.getGenresProcess?.results || [];
    const isInitialLoading = isLoading['getGamesProcess'] && page === 1;
    const isMoreLoading = isLoading['getGamesProcess'] && page > 1;
    const isRefreshing = isLoading['getGamesProcess'] && page === 1;
    const hasError = error['getGamesProcess'];

    useEffect(() => {
        dispatch(getGamesProcess({ page: 1 }));
        dispatch(getGenresProcess());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        setPage(1);
        dispatch(getGamesProcess({ page: 1 }));
    }, [dispatch]);

    const loadMore = () => {
        if (!isLoading['getGamesProcess'] && data.getGamesProcess?.next) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getGamesProcess({ page: nextPage }));
        }
    };
    if (hasError && games.length === 0) {
        return <ErrorState onRetry={onRefresh} message="Sunucuya bağlanırken bir hata oluştu." />;
    }
    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <AppText variant="caption">HOŞ GELDİN,</AppText>
                <AppText variant="h1" color={colors.primary}>User</AppText>
            </View>
            <View style={styles.avatarPlaceholder} />
        </View>
    );

    const renderGenres = () => (
        <FlatList
            horizontal
            data={genres}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreList}
            renderItem={({ item }) => (
                <View style={styles.genreItem}>
                    <AppText variant="caption" style={styles.genreText}>{item.name}</AppText>
                </View>
            )}
        />
    );

    return (
        <Container style={styles.container}>
            <FlatList
                data={games}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                ListHeaderComponent={
                    <View>
                        {renderHeader()}
                        <AppText variant="h2" style={styles.sectionTitle}>Kategoriler</AppText>
                        {renderGenres()}
                        <AppText variant="h2" style={styles.sectionTitle}>Popüler Oyunlar</AppText>
                    </View>
                }
                renderItem={({ item }) => (
                    <GameCard
                        game={item}
                        onPress={(id, name) => navigation.navigate('GameDetail', { gameId: id, gameName: name })}
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={!isInitialLoading ? <EmptyState /> : undefined}
                ListFooterComponent={
                    isMoreLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
                    ) : <View style={{ height: 20 }} />
                }
            />

            {isInitialLoading && (
                <View style={styles.skeletonOverlay}>
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} style={styles.skeletonCard} />
                    ))}
                </View>
            )}
        </Container>
    );
};

