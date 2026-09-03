import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { searchGamesProcess } from '../../redux/actions/gameActions';
import { resetSearch } from '../../redux/slices/gameSlice';
import { Container, GameCard, AppText, EmptyState, ErrorState } from '@components';
import { useNavigation } from '@react-navigation/native';
import { SearchScreenNavigationProp } from '@types';
import { useDebounce } from '@hooks';
import { colors } from '@theme';
import { styles } from './styles';

export const SearchScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<SearchScreenNavigationProp>();

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms bekleme süresi

    const { data, isLoading, error } = useAppSelector((state) => state.game);
    const searchResults = data.searchGamesProcess?.results || [];

    const isSearching = isLoading['searchGamesProcess'];
    const hasError = error['searchGamesProcess'];

    // Debounced term değiştikçe API'ye istek at
    useEffect(() => {
        if (debouncedSearchTerm.trim().length > 2) {
            dispatch(searchGamesProcess(debouncedSearchTerm));
        } else {
            // Arama kutusu temizlendiğinde sonuçları da temizle
            dispatch(resetSearch());
        }
    }, [debouncedSearchTerm, dispatch]);

    return (
        <Container style={styles.container}>
            {/* Custom Search Bar */}
            <View style={styles.searchBarContainer}>
                <AppText style={{ fontSize: 20 }}>🔍</AppText>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Oyun ara..."
                    placeholderTextColor={colors.secondary}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoCorrect={false}
                />
                {searchTerm.length > 0 && (
                    <AppText onPress={() => setSearchTerm('')} style={{ color: colors.primary }}>
                        Temizle
                    </AppText>
                )}
            </View>

            {/* Results Section */}
            {isSearching ? (
                <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            ) : hasError ? (
                <ErrorState onRetry={() => dispatch(searchGamesProcess(searchTerm))} />
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        searchResults.length > 0 ? (
                            <AppText variant="h2" style={styles.sectionTitle}>Sonuçlar</AppText>
                        ) : undefined
                    }
                    renderItem={({ item }) => (
                        <GameCard
                            game={item}
                            onPress={() => {
                                console.log("Tıklanan Oyun ID:", item.id);
                                navigation.navigate('GameDetail', {
                                    gameId: item.id,
                                    gameName: item.name
                                })
                            }}
                        />
                    )}
                    ListEmptyComponent={
                        searchTerm.length > 2 ? <EmptyState message={`"${searchTerm}" için sonuç bulunamadı.`} /> : (
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <AppText color={colors.secondary}>Efsanevi oyunları aramaya başla...</AppText>
                            </View>
                        )
                    }
                />
            )}
        </Container>
    );
};