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
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

const FILTERS = [
    { id: 'weekly', label: 'Haftalık Trendler', ordering: '-added', dates: getDates(7) },
    { id: 'monthly', label: 'Aylık Trendler', ordering: '-added', dates: getDates(30) },
    { id: 'popular', label: 'En Çok İndirilenler', ordering: '-added', dates: undefined },
    { id: 'goty', label: 'Yılın En İyileri', ordering: '-rating', dates: undefined },
];

const SORT_OPTIONS = [
    { id: 'added', shortLabel: 'Popülerlik (İndirilme)', value: '-added' },
    { id: 'rating', shortLabel: 'Puan (Yüksek)', value: '-rating' },
    { id: 'released', shortLabel: 'Çıkış Tarihi (Yeni)', value: '-released' },
    { id: 'name', shortLabel: 'İsim (A-Z)', value: 'name' },
];

export const DiscoveryScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<DiscoveryScreenNavigationProp>();

    const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
    const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearModalVisible, setYearModalVisible] = useState(false);

    const gameStore = useAppSelector(state => state.game);
    const discoveryStore = useAppSelector(state => state.discovery);
    const genreStore = useAppSelector(state => state.genre);

    const platforms = discoveryStore.data.getPlatformsProcess?.results || [];
    const genres = genreStore.data.getGenresProcess?.results || [];
    const games = gameStore.data.getGamesProcess?.results || [];

    const isInitialLoading = gameStore.isLoading['getGamesProcess'] && page === 1;
    const isMoreLoading = gameStore.isLoading['getGamesMoreLoading'];
    const isRefreshing = gameStore.status['getGamesProcess'] === 'loading' && page === 1;

    const fetchData = useCallback((filterObj = activeFilter, sortObj = activeSort, year = selectedYear, pageNum = 1) => {
        if (pageNum === 1) setPage(1);

        dispatch(getPlatformsProcess({ page: 1 }));
        dispatch(getGenresProcess());

        let finalDates = filterObj.dates;
        if (filterObj.id === 'goty') {
            finalDates = `${year}-01-01,${year}-12-31`;
        }

        dispatch(getGamesProcess({
            page: pageNum,
            dates: finalDates,
            ordering: sortObj.value,
        }));
    }, [dispatch, activeFilter, activeSort, selectedYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (filter: typeof FILTERS[0]) => {
        setActiveFilter(filter);
        fetchData(filter, activeSort, selectedYear, 1);
    };

    const handleSortChange = (sortOption: typeof SORT_OPTIONS[0]) => {
        setActiveSort(sortOption);
        setSortModalVisible(false);
        fetchData(activeFilter, sortOption, selectedYear, 1);
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        setYearModalVisible(false);
        fetchData(activeFilter, activeSort, year, 1);
    }

    const handleLoadMore = () => {
        const hasNextPage = gameStore.data['getGamesProcess']?.next;
        if (gameStore.isLoading['getGamesProcess'] || isMoreLoading || !hasNextPage) return;

        const nextPage = page + 1;
        setPage(nextPage);

        let finalDates = activeFilter.dates;
        if (activeFilter.id === 'goty') {
            finalDates = `${selectedYear}-01-01,${selectedYear}-12-31`;
        }

        dispatch(getGamesProcess({
            page: nextPage,
            dates: finalDates,
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

                {/* SOL TARAF: Dinamik Başlık (Alan yetmezse otomatik küçülür) */}
                <View style={{ flex: 1, marginRight: 8 }}>
                    <AppText variant="h2" style={styles.dynamicHeaderTitle} numberOfLines={1}>
                        {activeFilter.id === 'goty' ? `${selectedYear} En İyileri` : activeFilter.label}
                    </AppText>
                </View>

                {/* SAĞ TARAF: Butonlar (Yıl ve Sıralama yan yana gruplandı) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>

                    {/* EĞER "YILIN EN İYİLERİ" SEÇİLİYSE YIL SEÇME BUTONU */}
                    {activeFilter.id === 'goty' && (
                        <TouchableOpacity
                            style={[
                                styles.compactSortButton,
                                { marginRight: 8, borderColor: colors.primary, backgroundColor: 'rgba(100, 255, 218, 0.1)' }
                            ]}
                            onPress={() => setYearModalVisible(true)}
                        >
                            <AppText variant="caption" color={colors.primary} bold>
                                {selectedYear} ▾
                            </AppText>
                        </TouchableOpacity>
                    )}

                    {/* SIRALAMA BUTONU (Artık 'shortLabel' kullanıyoruz) */}
                    <TouchableOpacity
                        style={styles.compactSortButton}
                        onPress={() => setSortModalVisible(true)}
                    >
                        <AppText variant="caption" color={colors.primary}>
                            {activeSort.shortLabel} ↕
                        </AppText>
                    </TouchableOpacity>

                </View>
            </View>

            {/* ZAMAN SEKMELERİ */}
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
                                {filter.label.replace('Trendler', '').replace(`${currentYear} En İyileri`, 'Yılın En İyileri').trim()}
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
                        onRefresh={() => fetchData(activeFilter, activeSort, selectedYear, 1)}
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
                                        {sort.shortLabel}
                                    </AppText>
                                    {isSelected && <AppText variant="body" color={colors.primary}>✓</AppText>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={yearModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setYearModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setYearModalVisible(false)}
                >
                    <View style={[styles.modalContent, { maxHeight: '60%' }]}>
                        <AppText variant="h2" style={styles.modalTitle}>Yıl Seçin</AppText>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {YEARS.map((year) => {
                                const isSelected = selectedYear === year;
                                return (
                                    <TouchableOpacity
                                        key={`year-${year}`}
                                        style={styles.modalOption}
                                        onPress={() => handleYearChange(year)}
                                    >
                                        <AppText
                                            variant="body"
                                            color={isSelected ? colors.primary : colors.white}
                                            bold={isSelected}
                                        >
                                            {year.toString()}
                                        </AppText>
                                        {isSelected && <AppText variant="body" color={colors.primary}>✓</AppText>}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </Container>
    );
};