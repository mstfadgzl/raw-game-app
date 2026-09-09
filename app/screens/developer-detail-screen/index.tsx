import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Container, AppText, GameCard, Skeleton } from '@components';
import { entityService, gameService } from '@services';
import { translateText } from '@utils';
import type { DeveloperDetailRouteProp, DiscoverScreenNavigationProp, IDeveloper, IGame } from '@types';
import { colors } from '@theme';
import { styles } from './styles';

export const DeveloperDetailScreen = () => {
    const { params } = useRoute<DeveloperDetailRouteProp>();
    return <DeveloperContent key={params.id} id={Number(params.id)} />;
};

const DeveloperContent = ({ id }: { id: number }) => {
    const navigation = useNavigation<DiscoverScreenNavigationProp>();
    const [developer, setDeveloper] = useState<IDeveloper | null>(null);
    const [loading, setLoading] = useState(true);
    const [retry, setRetry] = useState(0);
    const [imageFailed, setImageFailed] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [translation, setTranslation] = useState('');
    const [translating, setTranslating] = useState(false);
    const [ordering, setOrdering] = useState<'-added' | '-metacritic'>('-added');
    const description = (developer?.description || '')
        .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').trim();

    useEffect(() => {
        let active = true;
        setLoading(true);
        const fetchProfile = async () => {
            try {
                if (!Number.isInteger(id) || id <= 0) throw new Error('Geçersiz stüdyo');
                const result = await entityService.getDeveloperDetail(id);
                if (Number(result.id) !== id) throw new Error('Geçersiz yanıt');
                if (active) setDeveloper(result);
            } catch {
                if (active) setDeveloper(null);
            } finally {
                if (active) setLoading(false);
            }
        };
        void fetchProfile();
        return () => { active = false; };
    }, [id, retry]);

    useEffect(() => {
        let active = true;
        setTranslation('');
        setTranslating(Boolean(description));
        if (description) {
            translateText(description)
                .then(value => { if (active) setTranslation(value?.trim() || ''); })
                .catch(() => { /* Keep the original biography visible. */ })
                .finally(() => { if (active) setTranslating(false); });
        }
        return () => { active = false; };
    }, [description]);

    if (loading) return <Container style={styles.container}><Skeleton style={styles.hero} /><View style={styles.content}><Skeleton style={styles.bioSkeleton} /></View></Container>;
    if (!developer) return (
        <Container style={styles.container}><View style={styles.feedback}>
            <AppText style={styles.sectionTitle}>Stüdyo yüklenemedi</AppText>
            <AppText style={styles.muted}>Bağlantını kontrol edip tekrar deneyebilirsin.</AppText>
            <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => setRetry(value => value + 1)}><AppText color={colors.primary}>Tekrar dene</AppText></TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => navigation.goBack()}><AppText>Geri dön</AppText></TouchableOpacity>
        </View></Container>
    );

    const header = (
        <View>
            <View style={styles.hero}>
                {developer.image_background && !imageFailed ? <Image source={{ uri: developer.image_background }} style={styles.heroImage} onError={() => setImageFailed(true)} /> : <AppText style={styles.monogram}>{developer.name.charAt(0)}</AppText>}
                <View style={styles.shade} />
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Geri dön" style={styles.back} onPress={() => navigation.goBack()}><AppText bold>‹ Geri</AppText></TouchableOpacity>
                <View style={styles.heroText}><AppText style={styles.eyebrow}>GELİŞTİRİCİ STÜDYO</AppText><AppText style={styles.title}>{developer.name}</AppText></View>
            </View>
            <View style={styles.content}>
                <View style={styles.stat}><AppText style={styles.statNumber}>{developer.games_count}</AppText><AppText style={styles.muted}>Bu zamana kadar yapılan oyun </AppText></View>
                <AppText style={styles.sectionTitle}>Stüdyo hakkında</AppText>
                <AppText style={styles.bio} numberOfLines={expanded ? undefined : 5}>{translation || description || 'Bu stüdyo için henüz açıklama bulunmuyor.'}</AppText>
                {translating && <AppText style={styles.muted}>Türkçeye çevriliyor…</AppText>}
                {!!description && <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded }} style={styles.expand} onPress={() => setExpanded(value => !value)}><AppText color={colors.primary}>{expanded ? 'Daha az göster' : 'Devamını oku'}</AppText></TouchableOpacity>}
                <View style={styles.gamesHeading}><AppText style={styles.sectionTitle}>Geliştirdiği oyunlar</AppText><AppText style={styles.muted}>Kaydırarak tüm oyunları keşfet.</AppText></View>
                <View style={styles.sortRow}>{(['-added', '-metacritic'] as const).map(value => (
                    <TouchableOpacity key={value} accessibilityRole="button" accessibilityState={{ selected: ordering === value }} style={[styles.sortButton, ordering === value && styles.selected]} onPress={() => setOrdering(value)}>
                        <AppText color={ordering === value ? colors.primary : colors.secondary} bold>{value === '-added' ? 'Popüler' : 'En yüksek puan'}</AppText>
                    </TouchableOpacity>
                ))}</View>
            </View>
        </View>
    );
    return <Container style={styles.container}><DeveloperGames key={ordering} id={id} ordering={ordering} header={header} /></Container>;
};

const DeveloperGames = ({ id, ordering, header }: { id: number; ordering: '-added' | '-metacritic'; header: React.ReactElement }) => {
    const navigation = useNavigation<DiscoverScreenNavigationProp>();
    const [games, setGames] = useState<IGame[]>([]);
    const [page, setPage] = useState(1);
    const [retry, setRetry] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const lock = useRef(true);
    useEffect(() => {
        let active = true;
        lock.current = true;
        setLoading(true);
        setError(false);
        gameService.getDeveloperGames(id, page, ordering)
            .then(response => {
                if (!Array.isArray(response.results)) throw new Error('Geçersiz oyun listesi');
                if (!active) return;
                setGames(previous => {
                    const combined = [
                        ...new Map(
                            [...previous, ...response.results].map(game => [
                                game.id,
                                game,
                            ]),
                        ).values(),
                    ];

                    if (ordering === '-metacritic') {
                        const score = (game: IGame): number =>
                            typeof game.metacritic === 'number' &&
                                game.metacritic > 0
                                ? game.metacritic
                                : -1;

                        combined.sort((a, b) => score(b) - score(a));
                    }

                    return combined;
                });
                setHasNext(Boolean(response.next));
            })
            .catch(() => { if (active) setError(true); })
            .finally(() => { if (active) { lock.current = false; setLoading(false); } });
        return () => { active = false; };
    }, [id, ordering, page, retry]);
    const loadMore = () => {
        if (lock.current || !hasNext || error) return;
        lock.current = true;
        setPage(value => value + 1);
    };
    return <FlatList
        data={games} numColumns={2} keyExtractor={game => String(game.id)} columnWrapperStyle={styles.row} contentContainerStyle={styles.list}
        ListHeaderComponent={header} showsVerticalScrollIndicator={false} onEndReached={loadMore} onEndReachedThreshold={0.4} initialNumToRender={6}
        renderItem={({ item }) => <View style={styles.column}><GameCard game={item} onPress={(gameId, gameName) => navigation.navigate('GameDetail', { gameId, gameName })} /></View>}
        ListEmptyComponent={!loading && !error ? <AppText style={styles.muted}>Bu stüdyo için oyun bulunamadı.</AppText> : undefined}
        ListFooterComponent={<View style={styles.footer}>
            {loading ? <ActivityIndicator color={colors.primary} /> : error ? (
                <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => {
                    if (lock.current) return;
                    lock.current = true;
                    setRetry(value => value + 1);
                }}><AppText color={colors.primary}>Oyunlar yüklenemedi · Tekrar dene</AppText></TouchableOpacity>
            ) : hasNext ? <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={loadMore}><AppText color={colors.primary}>Daha fazla oyun</AppText></TouchableOpacity> : games.length > 0 ? <AppText style={styles.muted}>Tüm oyunlar gösteriliyor · {games.length}</AppText> : null}
        </View>}
    />;
};

