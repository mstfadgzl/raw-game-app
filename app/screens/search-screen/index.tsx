import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useDebounce } from '@hooks';
import { searchGamesProcess } from '../../redux/actions/gameActions';
import { Container, GameCard, AppText } from '@components';
import { IGame, SearchScreenNavigationProp } from '@types';
import { colors } from '@theme';

import { styles } from './styles';

type SearchState = {
    query: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    results: IGame[];
};
type SearchCategory = 'games' | 'creators';

const INITIAL_STATE: SearchState = {
    query: '',
    status: 'idle',
    results: [],
};

const SUGGESTIONS = [
    'God of War',
    'The Witcher',
    'Forza Horizon',
    'Resident Evil',
];

export const SearchScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<SearchScreenNavigationProp>();
    const [category, setCategory] = useState<SearchCategory>('games');

    const [searchTerm, setSearchTerm] = useState('');
    const [focused, setFocused] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [search, setSearch] = useState<SearchState>(INITIAL_STATE);

    const query = searchTerm.trim();
    const debouncedQuery = useDebounce(query, 300);
    const canSearch = query.length >= 3;

    useEffect(() => {
        let active = true;

        if (query.length < 3) {
            setSearch(INITIAL_STATE);

            return () => {
                active = false;
            };
        }

        // Kullanıcı yazarken bekle.
        if (query !== debouncedQuery) {
            return () => {
                active = false;
            };
        }

        setSearch({
            query,
            status: 'loading',
            results: [],
        });

        dispatch(searchGamesProcess(query))
            .unwrap()
            .then(response => {
                if (!Array.isArray(response?.results)) {
                    throw new Error('Geçersiz arama yanıtı');
                }

                if (!active) return;

                const uniqueGames = new Map<number, IGame>();

                response.results.forEach((game: IGame) => {
                    uniqueGames.set(game.id, game);
                });

                setSearch({
                    query,
                    status: 'success',
                    results: [...uniqueGames.values()],
                });
            })
            .catch(() => {
                if (!active) return;

                setSearch({
                    query,
                    status: 'error',
                    results: [],
                });
            });

        // Arama değişince veya ekran kapanınca eski yanıtı kullanma.
        return () => {
            active = false;
        };
    }, [query, debouncedQuery, dispatch, retryKey]);

    const matchesCurrentQuery =
        search.query === query && query === debouncedQuery;

    const isWaiting =
        canSearch &&
        (!matchesCurrentQuery || search.status === 'loading');

    const hasError =
        canSearch &&
        matchesCurrentQuery &&
        search.status === 'error';

    const searchResults =
        canSearch &&
            matchesCurrentQuery &&
            search.status === 'success'
            ? search.results
            : [];

    const clearSearch = () => {
        setSearchTerm('');
        setSearch(INITIAL_STATE);
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
                            setRetryKey(value => value + 1)
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
                    Oyununu bul.
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
                    accessibilityLabel="Oyun adı"
                    style={styles.searchInput}
                    placeholder="Oyun adı yaz..."
                    placeholderTextColor="#8893A8"
                    selectionColor={colors.primary}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    autoCorrect={false}
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete="off"
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

            <FlatList
                key="search-two-columns"
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
                ListEmptyComponent={renderEmpty()}
            />
        </Container>
    );
};