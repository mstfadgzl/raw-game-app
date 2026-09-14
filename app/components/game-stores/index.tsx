import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../app-text';
import { storeService } from '../../api/services/storeService';
import { storeIcons } from '../../assets/stores';
import { buildStoreOptions, openStoreLink, type StoreMetadata, type StoreOption } from '../../utils/store-links';
import { useSettings } from '../../context/settings-context';

type Props = { gameId: number; gameName: string; stores: StoreMetadata[] };

const StoreIcon = ({ store }: { store: StoreMetadata }) => {
    const { colors } = useSettings();
    const icon = storeIcons[store.slug ?? ''];
    return <View style={[styles.iconBox, { backgroundColor: colors.background }]}>{icon
        ? <Image source={icon} style={styles.icon} resizeMode="contain" />
        : <AppText bold>{store.name.slice(0, 2).toUpperCase()}</AppText>}
    </View>;
};

export const GameStores = ({ gameId, gameName, stores }: Props) => {
    const { colors } = useSettings();
    const insets = useSafeAreaInsets();
    const [expanded, setExpanded] = useState(false);
    const [options, setOptions] = useState<StoreOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [opening, setOpening] = useState<string | null>(null);
    const openLock = useRef(false);

    useEffect(() => {
        if (!expanded) return;
        let active = true;
        setLoading(true);
        setError(false);
        void Promise.allSettled([
            storeService.getGameLinks(gameId, retryKey > 0),
            storeService.getStores(),
        ]).then(([links, catalog]) => {
            if (!active) return;
            if (links.status === 'rejected') {
                setError(true);
                return;
            }
            const metadata = new Map(stores.map(store => [store.id, store]));
            const linkedIds = new Set(links.value.map(link => Number(link.store_id)));
            if (catalog.status === 'fulfilled') {
                for (const store of catalog.value) {
                    if (metadata.has(store.id) || linkedIds.has(store.id)) metadata.set(store.id, store);
                }
            }
            setOptions(buildStoreOptions(links.value, [...metadata.values()]));
        }).catch(() => { if (active) setError(true); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [expanded, gameId, retryKey, stores]);

    const open = async (store: StoreOption) => {
        if (!store.url || openLock.current) return;
        openLock.current = true;
        setOpening(store.key);
        try {
            await openStoreLink(store.url, url => Linking.openURL(url));
        } catch {
            Alert.alert('Mağaza açılamadı', 'Bağlantı açılamadı. Lütfen tekrar dene.');
        } finally {
            openLock.current = false;
            setOpening(null);
        }
    };

    return (
        <>
            <Pressable accessibilityRole="button" accessibilityLabel="Satın alma seçenekleri, tüm mağazaları göster" accessibilityState={{ expanded }} onPress={() => setExpanded(true)} style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.summaryTop}>
                    <View style={styles.textColumn}>
                        <AppText style={[styles.title, { color: colors.text }]}>Satın alma seçenekleri</AppText>
                        <AppText style={[styles.subtitle, { color: colors.secondary }]}>Tüm mağazaları gör</AppText>
                    </View>
                    <AppText color={colors.primary} style={styles.arrow}>›</AppText>
                </View>
                {stores.length > 0 && <View style={styles.preview}>
                    {stores.slice(0, 4).map(store => <StoreIcon key={store.id} store={store} />)}
                    {stores.length > 4 && <AppText color={colors.secondary}>+{stores.length - 4}</AppText>}
                </View>}
            </Pressable>

            <Modal visible={expanded} transparent animationType="slide" onRequestClose={() => setExpanded(false)} statusBarTranslucent navigationBarTranslucent>
                <View style={styles.modalRoot}>
                    <Pressable style={styles.backdrop} accessibilityRole="button" accessibilityLabel="Mağazaları kapat" onPress={() => setExpanded(false)} />
                    <View accessibilityViewIsModal style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, 16), marginTop: insets.top + 16 }]}>
                        <View style={styles.sheetHeader}>
                            <View style={styles.textColumn}>
                                <AppText style={[styles.title, { color: colors.text }]}>Mağazalar</AppText>
                                <AppText style={[styles.subtitle, { color: colors.secondary }]} numberOfLines={2}>{gameName}</AppText>
                            </View>
                            <Pressable accessibilityRole="button" accessibilityLabel="Mağazaları kapat" onPress={() => setExpanded(false)} style={styles.close}><AppText style={styles.arrow}>×</AppText></Pressable>
                        </View>
                        <AppText style={[styles.hint, { color: colors.secondary }]}>Mağaza seçerek oyunun ürün sayfasını aç.</AppText>
                        {loading ? <View style={styles.feedback}><ActivityIndicator color={colors.primary} /><AppText style={[styles.subtitle, { color: colors.secondary }]}>Mağazalar yükleniyor…</AppText></View>
                            : error ? <View style={styles.feedback}>
                                <AppText>Mağaza bağlantıları yüklenemedi.</AppText>
                                <Pressable accessibilityRole="button" style={styles.retry} onPress={() => setRetryKey(value => value + 1)}><AppText color={colors.primary}>Tekrar dene</AppText></Pressable>
                            </View>
                                : <FlatList
                                    data={options}
                                    keyExtractor={item => item.key}
                                    contentContainerStyle={styles.list}
                                    renderItem={({ item }) => (
                                        <Pressable accessibilityRole="link" accessibilityLabel={`${item.name}, ${item.url ? 'oyunun mağaza sayfasını aç' : 'ürün bağlantısı bulunmuyor'}`} accessibilityState={{ disabled: !item.url || opening !== null, busy: opening === item.key }} disabled={!item.url || opening !== null} style={[styles.row, { backgroundColor: colors.background }, !item.url && styles.unavailable]} onPress={() => { void open(item); }}>
                                            <StoreIcon store={item} />
                                            <View style={styles.textColumn}>
                                                <AppText bold>{item.name}</AppText>
                                                <AppText style={[styles.subtitle, { color: colors.secondary }]}>{item.url ? 'Ürün sayfasına git' : 'Ürün bağlantısı bulunmuyor'}</AppText>
                                            </View>
                                            {opening === item.key ? <ActivityIndicator color={colors.primary} /> : item.url && <AppText color={colors.primary}>↗</AppText>}
                                        </Pressable>
                                    )}
                                    ListEmptyComponent={<AppText style={styles.feedback}>Bu oyun için mağaza bilgisi bulunamadı.</AppText>}
                                />}
                        <AppText style={[styles.footnote, { color: colors.secondary }]}>Mağaza bilgileri RAWG tarafından sağlanır. Bölgeye göre satış durumu değişebilir.</AppText>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    summary: { padding: 16, marginBottom: 24, backgroundColor: '#1D2928', borderWidth: 1, borderColor: '#344744', borderRadius: 18 },
    summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    textColumn: { flex: 1 },
    title: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    subtitle: { fontSize: 12, lineHeight: 18, color: '#94A3B8', marginTop: 4 },
    arrow: { fontSize: 28 },
    preview: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' },
    iconBox: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#293338', alignItems: 'center', justifyContent: 'center' },
    icon: { width: 28, height: 28 },
    modalRoot: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.68)' },
    sheet: { maxHeight: '85%', backgroundColor: '#191E22', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16 },
    sheetHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 12 },
    close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    hint: { color: '#94A3B8', fontSize: 13, paddingHorizontal: 20, paddingVertical: 14 },
    list: { paddingHorizontal: 16, paddingBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 14, marginBottom: 8, backgroundColor: '#242B30', minHeight: 74 },
    unavailable: { opacity: 0.5 },
    feedback: { padding: 24, alignItems: 'center', gap: 10 },
    retry: { padding: 16 },
    footnote: { color: '#94A3B8', fontSize: 11, lineHeight: 16, paddingHorizontal: 20, paddingTop: 8 },
});
