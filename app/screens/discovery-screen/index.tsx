import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View, ActivityIndicator, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@hooks";
import { getGamesProcess, getGenresProcess, getPlatformsProcess } from "@actions";
import { AppText, Container, GameCard, PlatformCard, SectionHeader, Skeleton } from "@components";
import { styles } from "./styles";
import { colors } from "@theme";
import { DiscoveryScreenNavigationProp } from "@types";

const getDates = (daysAgo: number) => {
    const today = new Date();
    const pastDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return `${pastDate.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;
};

const currentYear = new Date().getFullYear();

const FILTERS = [
    {
        id: 'weekly',
        label: 'Haftalık Trendler',
        ordering: '-added',
        dates: getDates(7),
    },
    {
        id: 'monthly',
        label: 'Aylık Trendler',
        ordering: '-added',
        dates: getDates(30),
    },
    {
        id: 'popular',
        label: 'En Çok İndirilenler',
        ordering: '-added',
        dates: undefined
    },
    {
        id: 'goty',
        label: `${currentYear} En İyileri`,
        ordering: '-rating',
        dates: `${currentYear}-01-01,${currentYear}-12-31`
    },
];

const SORT_OPTIONS = [
    { id: 'added', label: 'Popülerlik (İndirilme)', value: '-added' },
    { id: 'rating', label: 'Puan (Yüksek)', value: '-rating' },
    { id: 'released', label: 'Çıkış Tarihi (Yeni)', value: '-released' },
    { id: 'name', label: 'İsim (A-Z)', value: 'name' },
];

export const DiscoveryScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<DiscoveryScreenNavigationProp>();

    const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
    const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [page, setPage] = useState(1);

    const gameStore = useAppSelector(state => state.game);
    const discoveryStore = useAppSelector(state => state.discovery);
    const genreStore = useAppSelector(state => state.genre);

    const platforms = discoveryStore.data.getPlatformsProcess?.results || [];
    const genres = genreStore.data.getGenresProcess?.results || [];
    const games = gameStore.data.getGamesProcess?.results || [];

    const isInitialLoading = gameStore.isLoading['getGamesProcess'] && page === 1;
    const isMoreLoading = gameStore.isLoading['getGamesMoreLoading'];
    const isRefreshing = gameStore.status['getGamesProcess'] === 'loading' && page === 1;

    const fetchData = useCallback((filterObj = activeFilter, sortObj = activeSort, pageNum = 1) => {
        if (pageNum === 1) setPage(1);

        dispatch(getPlatformsProcess({ page: 1 }));
        dispatch(getGenresProcess());

        dispatch(getGamesProcess({
            page: pageNum,
            dates: filterObj.dates,
            ordering: sortObj.value,
        }));
    }, [dispatch, activeFilter, activeSort]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (filter: typeof FILTERS[0]) => {
        setActiveFilter(filter);
        fetchData(filter, activeSort, 1);
    };

    const handleSortChange = (sortOption: typeof SORT_OPTIONS[0]) => {
        setActiveSort(sortOption);
        setSortModalVisible(false);
        fetchData(activeFilter, sortOption, 1);
    };

    const handleLoadMore = () => {
        const hasNextPage = gameStore.data['getGamesProcess']?.next;
        if (gameStore.isLoading['getGamesProcess'] || isMoreLoading || !hasNextPage) return;

        const nextPage = page + 1;
        setPage(nextPage);
        dispatch(getGamesProcess({
            page: nextPage,
            dates: activeFilter.dates,
            ordering: activeSort.value
        }));
    };

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
                        image={item.image_background}
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
                    <TouchableOpacity
                        style={[styles.modernChip, styles.inactiveChipSoft]}
                        onPress={() => navigation.navigate('GenreDetail', { slug: item.slug, name: item.name })}
                    >
                        <AppText
                            variant="body"
                            color={colors.white}
                            bold
                        >
                            {item.name.toUpperCase()}
                        </AppText>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const renderFilterAndSort = () => (
        <View style={styles.sectionMargin}>
            <View style={styles.filterHeaderRow}>
                <AppText variant="h2" style={styles.dynamicHeaderTitle}>
                    {activeFilter.label}
                </AppText>

                <TouchableOpacity
                    style={styles.compactSortButton}
                    onPress={() => setSortModalVisible(true)}
                >
                    <AppText variant="caption" color={colors.primary}>
                        {activeSort.label} ↕
                    </AppText>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabPadding}>
                {FILTERS.map((filter) => {
                    const isActive = activeFilter.id === filter.id;
                    return (
                        <TouchableOpacity
                            key={filter.id}
                            style={styles.tabButton}
                            onPress={() => handleFilterChange(filter)}
                        >
                            <AppText
                                variant="body"
                                color={isActive ? colors.white : colors.gray}
                                bold={isActive}
                            >
                                {filter.label.replace('Trendler', '').trim()}
                            </AppText>
                            {isActive && <View style={styles.tabIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

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
        <Container style={{ paddingHorizontal: 0 }}>
            <FlatList
                data={games}
                numColumns={2}
                keyExtractor={(item, index) => `game-${item.id}-${index}`}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 16
                }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        {renderHeader()}
                        {renderPlatforms()}
                        {renderGenres()}
                        {renderFilterAndSort()}
                    </View>
                }
                renderItem={({ item }) => (
                    <GameCard
                        game={item}
                        onPress={(id, name) => navigation.navigate('GameDetail', { gameId: id, gameName: name })}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => fetchData(activeFilter, activeSort, 1)}
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

            <Modal
                visible={sortModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSortModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setSortModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <AppText variant="h2" style={styles.modalTitle}>Sıralama Ölçütü</AppText>

                        {SORT_OPTIONS.map((sort) => {
                            const isSelected = activeSort.id === sort.id;
                            return (
                                <TouchableOpacity
                                    key={sort.id}
                                    style={styles.modalOption}
                                    onPress={() => handleSortChange(sort)}
                                >
                                    <AppText
                                        variant="body"
                                        color={isSelected ? colors.primary : colors.white}
                                        bold={isSelected}
                                    >
                                        {sort.label}
                                    </AppText>
                                    {isSelected && <AppText variant="body" color={colors.primary}>✓</AppText>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
        </Container>
    );
};