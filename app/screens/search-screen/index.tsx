import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useDebounce } from '@hooks';
import { gameService } from '@services';
import { usePaginatedGames } from '../../hooks/usePaginatedGames';
import { Container, GameCard, AppText } from '@components';
import { SearchScreenNavigationProp } from '@types';
import { colors } from '@theme';

import { styles } from './styles';
import { CreatorSearchResults } from './creator-search-results';
import { DeveloperSearchResults } from './developer-search-results';

const SUGGESTIONS = [
    'God of War',
    'The Witcher',
    'Forza Horizon',
    'Resident Evil',
];

export const SearchScreen = () => {
    const navigation = useNavigation<SearchScreenNavigationProp>();

    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState<'games' | 'creators' | 'developers'>('games');
    const [focused, setFocused] = useState(false);

    const query = searchTerm.trim();
    const debouncedQuery = useDebounce(query, 200);
    const canSearch = query.length >= 3;

    const loadSearchPage = useCallback((page: number) => gameService.searchGames(debouncedQuery, page), [debouncedQuery]);
    const ready = category === 'games' && canSearch && query === debouncedQuery;
    const games = usePaginatedGames(ready ? loadSearchPage : null);
    const isWaiting = canSearch && (!ready || games.loading);
    const hasError = games.error;
    const searchResults = games.items;

    const clearSearch = () => {
        setSearchTerm('');
    };

    const selectSuggestion = (value: string) => {
        setSearchTerm(value);
        Keyboard.dismiss();
    };

    const renderEmpty = () => {
        if (!canSearch) {
            return (
                <View style={styles.emptySection}>
                    <View style={styles.emptySymbol}>
                        <AppText style={styles.emptySymbolText}>
                            ⌕
                        </AppText>
                    </View>

                    <AppText style={styles.emptyTitle}>
                        {query.length
                            ? 'Biraz daha yaz'
                            : 'Hangi dünyayı keşfedelim?'}
                    </AppText>

                    <AppText style={styles.emptyDescription}>
                        {query.length
                            ? 'Aramak için en az 3 karakter gir.'
                            : 'Oyun adını yaz veya aşağıdan bir arama seç.'}
                    </AppText>

                    <View style={styles.suggestions}>
                        {SUGGESTIONS.map(suggestion => (
                            <TouchableOpacity
                                key={suggestion}
                                accessibilityRole="button"
                                activeOpacity={0.75}
                                style={styles.suggestionChip}
                                onPress={() =>
                                    selectSuggestion(suggestion)
                                }
                            >
                                <AppText style={styles.suggestionText}>
                                    {suggestion}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }

        if (isWaiting) {
            return (
                <View style={styles.feedback}>
                    <ActivityIndicator
                        color={colors.primary}
                        size="large"
                    />

                    <AppText style={styles.feedbackDescription}>
                        Oyunlar aranıyor…
                    </AppText>
                </View>
            );
        }

        if (hasError) {
            return (
                <View style={styles.feedback}>
                    <AppText style={styles.emptyTitle}>
                        Arama tamamlanamadı
                    </AppText>

                    <AppText style={styles.feedbackDescription}>
                        Bağlantını kontrol edip tekrar deneyebilirsin.
                    </AppText>

                    <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.retryButton}
                        onPress={() =>
                            games.retry()
                        }
                    >
                        <AppText style={styles.retryText}>
                            Tekrar dene
                        </AppText>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.feedback}>
                <AppText style={styles.emptyTitle}>
                    Sonuç bulunamadı
                </AppText>

                <AppText style={styles.feedbackDescription}>
                    “{query}” için oyun bulamadık.
                    {'\n'}Daha kısa veya farklı bir adla deneyebilirsin.
                </AppText>
            </View>
        );
    };

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <AppText style={styles.eyebrow}>
                    OYUN KÜTÜPHANESİ
                </AppText>

                <AppText style={styles.title}>
                    {category === 'games' ? 'Oyununu bul.' : category === 'creators' ? 'Kişileri keşfet.' : 'Stüdyoları keşfet.'}
                </AppText>
            </View>

            <View
                style={[
                    styles.searchBar,
                    focused ? styles.searchBarFocused : {},
                ]}
            >
                <AppText style={styles.searchIcon}>
                    ⌕
                </AppText>

                <TextInput
                    accessibilityLabel={category === 'games' ? 'Oyun adı' : category === 'creators' ? 'Kişi adı' : 'Stüdyo adı'}
                    style={styles.searchInput}
                    placeholder={category === 'games' ? 'Oyun adı yaz...' : category === 'creators' ? 'Kişi adı yaz...' : 'Stüdyo adı yaz...'}
                    placeholderTextColor="#8893A8"
                    selectionColor={colors.primary}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    autoCorrect={false}
                    autoCapitalize="none"
                    returnKeyType="search"
                />

                {searchTerm.length > 0 && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Aramayı temizle"
                        style={styles.clearButton}
                        onPress={clearSearch}
                    >
                        <AppText style={styles.clearText}>
                            ✕
                        </AppText>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.suggestions}>
                {(['games', 'creators', 'developers'] as const).map(value => (
                    <TouchableOpacity
                        key={value}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: category === value }}
                        style={styles.suggestionChip}
                        onPress={() => setCategory(value)}
                    >
                        <AppText color={category === value ? colors.primary : colors.secondary} bold={category === value}>
                            {value === 'games' ? 'Oyunlar' : value === 'creators' ? 'Kişiler' : 'Stüdyolar'}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>

            {category === 'creators' ? (
                <CreatorSearchResults key={debouncedQuery.toLowerCase()} query={query} debouncedQuery={debouncedQuery} />
            ) : category === 'developers' ? (
                <DeveloperSearchResults query={query} debouncedQuery={debouncedQuery} />
            ) : <FlatList
                key={`search-${debouncedQuery}`}
                style={styles.list}
                data={searchResults}
                numColumns={2}
                keyExtractor={item => `search-${item.id}`}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                windowSize={5}
                ListHeaderComponent={
                    searchResults.length > 0 ? (
                        <AppText style={styles.sectionTitle}>
                            Arama sonuçları
                        </AppText>
                    ) : undefined
                }
                renderItem={({ item }) => (
                    <View style={styles.gameColumn}>
                        <GameCard
                            game={item}
                            onPress={(gameId, gameName) => {
                                Keyboard.dismiss();

                                navigation.navigate('GameDetail', {
                                    gameId,
                                    gameName,
                                });
                            }}
                        />
                    </View>
                )}
                onEndReached={games.loadMore}
                onEndReachedThreshold={0.4}
                ListFooterComponent={searchResults.length > 0 && (games.loading || games.error) ? (
                    <View style={styles.feedback}>
                        {games.loading && <ActivityIndicator color={colors.primary} />}
                        {games.error && (
                            <TouchableOpacity accessibilityRole="button" style={styles.retryButton} onPress={games.retry}>
                                <AppText style={styles.retryText}>Devamı yüklenemedi · Tekrar dene</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : undefined}
                ListEmptyComponent={renderEmpty()}
            />}
        </Container>
    );
};
