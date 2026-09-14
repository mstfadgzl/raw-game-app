import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, StudioBrand } from '@components';
import { entityService } from '@services';
import type { IDeveloper, SearchScreenNavigationProp } from '@types';
import { useSettings } from '@hooks';
import { colors } from '@theme';

export const DeveloperSearchResults = ({ query, debouncedQuery }: {
    query: string;
    debouncedQuery: string;
}) => {
    const { colors } = useSettings();

    if (query.length < 3) {
        return <AppText style={localStyles.prompt}>Stüdyo aramak için en az 3 karakter yaz. Örneğin: rockstar</AppText>;
    }
    if (query !== debouncedQuery) {
        return <ActivityIndicator color={colors.primary} />;
    }
    return <DeveloperResults key={debouncedQuery.toLowerCase()} query={debouncedQuery.toLowerCase()} />;
};

const DeveloperResults = ({ query }: { query: string }) => {
    const navigation = useNavigation<SearchScreenNavigationProp>();
    const { colors } = useSettings();
    const [creators, setCreators] = useState<IDeveloper[]>([]);
    const [page, setPage] = useState(1);
    const [retry, setRetry] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [count, setCount] = useState(0);
    const lock = useRef(true);

    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        lock.current = true;
        setLoading(true);
        setError(false);

        entityService.searchDevelopers(query, page, controller.signal)
            .then(response => {
                if (!Array.isArray(response.results)) throw new Error('Geçersiz stüdyo listesi');
                if (!active) return;
                setCreators(previous => [...new Map(
                    [...previous, ...response.results].map(person => [person.id, person]),
                ).values()]);
                setHasNext(Boolean(response.next));
                setCount(response.count);
            })
            .catch(() => { if (active) setError(true); })
            .finally(() => {
                if (active) {
                    lock.current = false;
                    setLoading(false);
                }
            });

        return () => { active = false; controller.abort(); };
    }, [query, page, retry]);

    return (
        <FlatList
            data={creators}
            keyExtractor={person => String(person.id)}
            contentContainerStyle={localStyles.list}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={
                <AppText style={localStyles.hint}>
                    {loading && creators.length === 0 ? 'Stüdyolar aranıyor…' : error && creators.length === 0 ? 'Arama tamamlanamadı.' : `“${query}” için ${count} stüdyo`}
                </AppText>
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, profili aç`}
                    style={localStyles.person}
                    onPress={() => {
                        Keyboard.dismiss();
                        navigation.navigate('DeveloperDetail', { id: item.id, name: item.name });
                    }}
                >
                    <StudioBrand name={item.name} imageBackground={item.image_background} size={56} />
                    <View style={localStyles.info}>
                        <AppText bold>{item.name}</AppText>
                        <AppText color={colors.secondary}>
                            {item.games_count} oyun
                        </AppText>
                    </View>
                </TouchableOpacity>
            )}
            ListEmptyComponent={
                <AppText style={localStyles.hint}>
                    {loading ? 'Sonuçlar yükleniyor…' : error ? 'Stüdyolar yüklenemedi.' : 'Eşleşen stüdyo bulunamadı.'}
                </AppText>
            }
            ListFooterComponent={
                loading ? <ActivityIndicator color={colors.primary} /> : (
                    <View>
                        {error && <AppText style={localStyles.hint}>Stüdyolar alınamadı. Bağlantını kontrol edip tekrar deneyebilirsin.</AppText>}
                        {(error || hasNext) && (
                            <TouchableOpacity
                                accessibilityRole="button"
                                style={localStyles.button}
                                onPress={() => {
                                    if (lock.current) return;
                                    lock.current = true;
                                    if (error) setRetry(value => value + 1);
                                    else setPage(value => value + 1);
                                }}
                            >
                                <AppText color={colors.primary} bold>{error ? 'Tekrar dene' : 'Daha fazla stüdyo yükle'}</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                )
            }
        />
    );
};

const localStyles = StyleSheet.create({
    prompt: { padding: 18, color: colors.secondary, lineHeight: 22 },
    list: { padding: 18, paddingBottom: 32 },
    hint: { color: colors.secondary, marginBottom: 20, lineHeight: 22 },
    person: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1, gap: 5 },
    button: { padding: 16, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, marginTop: 16 },
});

