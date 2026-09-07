import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@hooks";
import { getGamesProcess, getGenresProcess, getPlatformsProcess } from "@actions";

// Components
import {
    AppText,
    Container,
    GameCard,
    GenreChip,
    PlatformCard,
    SectionHeader,
    Skeleton
} from "@components";

import { DiscoverMainScreen } from "@screens";
import { styles } from "./styles";
import { colors } from "@theme";
import { DiscoveryScreenNavigationProp } from "@types";

const getLastWeekDate = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return `${lastWeek.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;
};
const FILTERS = [
    {
        id: 'trending',
        label: 'Haftanın Trendleri',
        ordering: '-relevance',
        dates: getLastWeekDate() // Sadece son 7 günü kapsar
    },
    {
        id: 'popular',
        label: 'En Çok İndirilenler',
        ordering: '-added',
        dates: undefined // Tüm zamanlar
    },
    {
        id: 'goty',
        label: 'Yılın En İyileri',
        ordering: '-rating',
        dates: '2024-01-01,2024-12-31'
    },
];

export const DiscoveryScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<DiscoveryScreenNavigationProp>();

    // Local State
    const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
    const [page, setPage] = useState(1);

    // Redux State
    const gameStore = useAppSelector(state => state.game);
    const discoveryStore = useAppSelector(state => state.discovery);
    const genreStore = useAppSelector(state => state.genre);

    // Veri Atamaları
    const platforms = discoveryStore.data.getPlatformsProcess?.results || [];
    const genres = genreStore.data.getGenresProcess?.results || [];
    const games = gameStore.data.getGamesProcess?.results || [];

    // Loading Durumları
    const isInitialLoading = gameStore.isLoading['getGamesProcess'] && page === 1;
    const isMoreLoading = gameStore.isLoading['getGamesMoreLoading'];
    const isRefreshing = gameStore.status['getGamesProcess'] === 'loading' && page === 1;

    /**
     * Veri Çekme Fonksiyonu
     * @param filterObj - Seçili filtre
     * @param pageNum - Sayfa numarası
     */
    const fetchData = useCallback((filterObj = activeFilter, pageNum = 1) => {
        if (pageNum === 1) setPage(1);

        // Platform ve Türleri sadece ilk açılışta veya refresh'te çek
        dispatch(getPlatformsProcess({ page: 1 }));
        dispatch(getGenresProcess());

        // Oyunları aktif filtreye göre çek
        dispatch(getGamesProcess({
            page: pageNum,
            ordering: filterObj.ordering,
            dates: filterObj.dates
        }));
    }, [dispatch, activeFilter]);

    useEffect(() => {
        fetchData();
    }, []);


    const handleFilterChange = (filter: typeof FILTERS[0]) => {
        setActiveFilter(filter);
        fetchData(filter, 1);
    };

    // Sonsuz Kaydırma
    const handleLoadMore = () => {
        const hasNextPage = gameStore.data['getGamesProcess']?.next;
        if (gameStore.isLoading['getGamesProcess'] || isMoreLoading || !hasNextPage) return;

        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(getGamesProcess({
            page: nextPage,
            ordering: activeFilter.ordering,
            dates: activeFilter.dates
        }));
    };

    // --- RENDER BÖLÜMLERİ ---

    const renderHeader = () => (
        <View style={styles.header}>
            <AppText variant="caption" color={colors.primary} bold>OYUN ANSİKLOPEDİSİ</AppText>
            <AppText variant="h1" style={styles.mainTitle}>Keşfetmeye Başla</AppText>
        </View>
    );

    const renderPlatforms = () => (
        <View style={styles.sectionMargin}>
            <SectionHeader
                title="Platformlar"
                onPressAll={() => navigation.navigate('DiscoverTab', { screen: 'DiscoverMain' })}
            />
            <FlatList
                horizontal
                data={platforms}
                keyExtractor={(item) => `plt-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListPadding}
                renderItem={({ item }) => (
                    <PlatformCard
                        name={item.name}
                        image={item.image_background} // Resim hatası düzeltildi
                        gamesCount={item.games_count}
                        onPress={() => navigation.navigate('PlatformDetail', { id: item.id, name: item.name })}
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
                        onPress={() => navigation.navigate('GenreDetail', { slug: item.slug, name: item.name })}
                    />
                )}
            />
        </View>
    );

    const renderFilterSelector = () => (
        <View style={styles.sectionMargin}>
            <SectionHeader title={activeFilter.label} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                {FILTERS.map((filter) => (
                    <GenreChip
                        key={filter.id}
                        name={filter.label}
                        isSelected={activeFilter.id === filter.id}
                        onPress={() => handleFilterChange(filter)}
                    />
                ))}
            </ScrollView>
        </View>
    );

    // --- MAIN RENDER ---

    if (isInitialLoading && games.length === 0) {
        return (
            <Container>
                <View style={styles.skeletonContainer}>
                    <Skeleton style={styles.skeletonTitle} />
                    <Skeleton style={styles.skeletonBanner} />
                    <Skeleton style={styles.skeletonCard} />
                    <Skeleton style={styles.skeletonCard} />
                </View>
            </Container>
        );
    }

    return (
        <Container style={styles.container}>
            <FlatList
                data={games}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 16
                }}
                keyExtractor={(item, index) => `game-${item.id}-${index}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {renderHeader()}
                        {renderPlatforms()}
                        {renderGenres()}
                        {renderFilterSelector()}
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
                        refreshing={isRefreshing}
                        onRefresh={() => fetchData(activeFilter, 1)}
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