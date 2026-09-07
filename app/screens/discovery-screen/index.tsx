import { getGamesProcess, getGenresProcess, getPlatformsProcess } from "@actions";
import { useAppDispatch, useAppSelector } from "@hooks"
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { AppText, Container, GameCard, GenreChip, PlatformCard, SectionHeader, Skeleton } from "@components";
import { colors } from "@theme";
import { DiscoveryScreenNavigationProp } from "@types";

export const DiscoveryScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<DiscoveryScreenNavigationProp>();

    // Sayfalama için state
    const [page, setPage] = useState(1);

    const gameStore = useAppSelector(state => state.game);
    const discoveryStore = useAppSelector(state => state.discovery);
    const genreStore = useAppSelector(state => state.genre);

    const platforms = discoveryStore.data.getPlatformsProcess?.results || [];
    const genres = genreStore.data.getGenresProcess?.results || []; // Typo düzeltildi
    const trendingGames = gameStore.data.getGamesProcess?.results || [];

    const isInitialLoading =
        gameStore.isLoading['getGamesProcess'] ||
        discoveryStore.isLoading['getPlatformsProcess']; // Typo düzeltildi

    const isMoreLoading = gameStore.isLoading['getGamesMoreLoading'];

    // İlk Yükleme ve Pull-to-Refresh için
    const fetchData = useCallback(() => {
        setPage(1); // Yenilerken sayfayı 1'e çek
        dispatch(getPlatformsProcess({ page: 1 }));
        dispatch(getGenresProcess());
        dispatch(getGamesProcess({ page: 1 }));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Sonsuz Kaydırma (Infinite Scroll) için
    const handleLoadMore = () => {
        const hasNextPage = gameStore.data['getGamesProcess']?.next;

        if (isInitialLoading || isMoreLoading || !hasNextPage) return;

        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(getGamesProcess({ page: nextPage }));
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <AppText variant="caption" color={colors.primary} bold> OYUN ANSİKLOPEDİSİ</AppText>
            <AppText variant="h1" style={styles.mainTitle}> Keşfetmeye Başla</AppText>
        </View>
    );

    const renderPlatforms = () => (
        <View style={styles.sectionMargin}>
            <SectionHeader title="Platformlar" onPressAll={() => console.log('Tüm Platformlar')} />
            <FlatList
                horizontal
                data={platforms}
                keyExtractor={(item) => `platform-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListPadding}
                renderItem={({ item }) => (
                    <PlatformCard
                        name={item.name}
                        image={item.image}
                        gamesCount={item.games_count}
                        onPress={() => console.log(item.id)}
                    />
                )}
            />
        </View>
    );

    const renderGenres = () => (
        <View style={styles.sectionMargin}>
            <SectionHeader title="Popüler Türler" />
            <FlatList
                horizontal
                data={genres}
                keyExtractor={(item) => `genre-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListPadding}
                renderItem={({ item }) => (
                    <GenreChip
                        name={item.name}
                        onPress={() => console.log(item.slug)}
                    />
                )}
            />
        </View>
    );

    if (isInitialLoading && trendingGames.length === 0) {
        return (
            <Container>
                <View style={styles.skeletonContainer}>
                    <Skeleton style={styles.skeletonTitle} />
                    <Skeleton style={styles.skeletonBanner} />
                    <Skeleton style={styles.skeletonCard} />
                </View>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <FlatList
                data={trendingGames}
                keyExtractor={(item) => `game-${item.id}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {renderHeader()}
                        {renderPlatforms()}
                        {renderGenres()}
                        <SectionHeader title="Haftanın Trendleri" />
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.gameCardWrapper}>
                        <GameCard
                            game={item}
                            onPress={(id, name) => navigation.navigate('GameDetail', { gameId: id, gameName: name })}
                        />
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isInitialLoading && trendingGames.length > 0}
                        onRefresh={fetchData}
                        tintColor={colors.primary}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isMoreLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
                    ) : <View style={{ height: 40 }} />
                }
            />
        </Container>
    );
};