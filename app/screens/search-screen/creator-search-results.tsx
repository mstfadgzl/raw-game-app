import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '@components';
import { entityService } from '@services';
import type { ICreator, SearchScreenNavigationProp } from '@types';
import { useSettings } from '@hooks';
import { colors } from '@theme';

export const CreatorSearchResults = ({ query, debouncedQuery }: {
    query: string;
    debouncedQuery: string;
}) => {
    const navigation = useNavigation<SearchScreenNavigationProp>();
    const { colors: themeColors } = useSettings();
    const [creators, setCreators] = useState<ICreator[]>([]);
    const [page, setPage] = useState(1);
    const [retry, setRetry] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const lock = useRef(true);

    useEffect(() => {
        let active = true;
        const controller = new AbortController();
        lock.current = true;
        if (debouncedQuery.length < 3) {
            setLoading(false);
            lock.current = false;
            return () => { active = false; controller.abort(); };
        }
        setLoading(true);
        setError(false);

        entityService.getCreators({ page, pageSize: 20, search: debouncedQuery, signal: controller.signal })
            .then(response => {
                if (!Array.isArray(response.results)) throw new Error('Geçersiz kişi listesi');
                if (!active) return;
                setCreators(previous => [...new Map(
                    [...previous, ...response.results].map(person => [person.id, person]),
                ).values()]);
                setHasNext(Boolean(response.next));
            })
            .catch(() => { if (active) setError(true); })
            .finally(() => {
                if (active) {
                    lock.current = false;
                    setLoading(false);
                }
            });

        return () => { active = false; controller.abort(); };
    }, [debouncedQuery, page, retry]);

    const ready = query.length >= 3 && query === debouncedQuery;
    const results = ready ? creators : [];

    return (
        <FlatList
            data={results}
            keyExtractor={person => String(person.id)}
            contentContainerStyle={localStyles.list}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListHeaderComponent={
                <AppText style={localStyles.hint}>
                    {creators.length} yüklenen kişi içinde aranır. Daha fazla kişi yükleyerek aramayı genişletebilirsin.
                </AppText>
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, profili aç`}
                    style={localStyles.person}
                    onPress={() => {
                        Keyboard.dismiss();
                        navigation.navigate('CreatorDetail', { id: item.id, name: item.name });
                    }}
                >
                    {item.image ? <Image source={{ uri: item.image }} style={localStyles.avatar} /> : (
                        <View style={localStyles.avatar}><AppText bold>{item.name.charAt(0)}</AppText></View>
                    )}
                    <View style={localStyles.info}>
                        <AppText bold>{item.name}</AppText>
                <AppText color={themeColors.secondary}>
                            {item.positions?.map(position => position.name).join(' · ') || `${item.games_count} oyunda yer aldı`}
                        </AppText>
                    </View>
                </TouchableOpacity>
            )}
            ListEmptyComponent={
                <AppText style={localStyles.hint}>
                    {query.length < 3 ? 'Kişi aramak için en az 3 karakter yaz. Örneğin: gab' :
                        !ready ? 'Aranıyor…' : loading ? 'Kişiler yükleniyor…' :
                            error ? 'Kişiler yüklenemedi.' : 'Yüklenen kişiler arasında eşleşme bulunamadı.'}
                </AppText>
            }
            ListFooterComponent={
            loading ? <ActivityIndicator color={themeColors.primary} /> : (
                    <View>
                        {error && <AppText style={localStyles.hint}>Kişiler alınamadı. Bağlantını kontrol edip tekrar deneyebilirsin.</AppText>}
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
                                <AppText color={themeColors.primary} bold>{error ? 'Tekrar dene' : 'Daha fazla kişi yükle'}</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                )
            }
        />
    );
};

const localStyles = StyleSheet.create({
    list: { padding: 18, paddingBottom: 32 },
    hint: { color: colors.secondary, marginBottom: 20, lineHeight: 22 },
    person: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1, gap: 5 },
    button: { padding: 16, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, marginTop: 16 },
});
