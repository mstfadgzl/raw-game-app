import React, { useEffect, useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getCreatorDetailProcess } from '@actions';
import { Container, AppText, GameCard, Skeleton } from '@components';
import { CreatorDetailRouteProp } from '@types';
import { translateText } from '@utils';
import { styles } from './styles';
import { colors } from '@theme';

export const CreatorDetailScreen = () => {
    const route = useRoute<CreatorDetailRouteProp>();
    const { id } = route.params;
    const dispatch = useAppDispatch();

    const [trBio, setTrBio] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const { data, isLoading } = useAppSelector(state => state.entity);
    const creator = data.getCreatorDetailProcess;


    const games = creator?.games || [];
    const positions = creator?.positions || [];

    useEffect(() => {
        dispatch(getCreatorDetailProcess(id));
    }, [id, dispatch]);

    // Biyografi Çeviri Mantığı
    useEffect(() => {
        if (creator?.description) {
            setIsTranslating(true);
            translateText(creator.description)
                .then(setTrBio)
                .finally(() => setIsTranslating(false));
        } else {
            // Eğer açıklama yoksa state'i temizle (Sonsuz yükleniyor yazısını engeller)
            setTrBio('');
        }
    }, [creator?.description]);

    if (isLoading['getCreatorDetailProcess'] && !creator) {
        return <Container><Skeleton style={{ flex: 1 }} /></Container>;
    }

    // Üst kısmı (Fotoğraf + Bio) Header olarak ayırıyoruz
    const renderHeader = () => (
        <View>
            {creator?.image && (
                <Image source={{ uri: creator.image }} style={styles.heroImage} />
            )}

            <View style={styles.content}>
                <AppText variant="h1">{creator?.name}</AppText>

                {positions.length > 0 && (
                    <AppText variant="caption" color={colors.primary} style={styles.role}>
                        {positions.map((p: any) => p.name).join(' / ')}
                    </AppText>
                )}

                <AppText variant="h2" style={styles.subTitle}>Biyografi</AppText>
                <AppText style={styles.bio}>
                    {/* Biyografi yoksa, çeviriliyorsa veya bittiyse farklı metinler */}
                    {!creator?.description
                        ? 'Bu yapımcı için biyografi bulunmuyor.'
                        : isTranslating
                            ? 'Biyografi çevriliyor...'
                            : trBio}
                </AppText>

                {games.length > 0 && (
                    <AppText variant="h2" style={styles.subTitle}>Geliştirdiği Oyunlar</AppText>
                )}
            </View>
        </View>
    );

    return (
        <Container style={styles.container}>
            {/* ScrollView ve .map() YERİNE FLATLIST KULLANIYORUZ */}
            <FlatList
                data={games}
                keyExtractor={(item) => `creator-game-${item.id}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <View style={styles.content}> {/* Kartların kenar boşlukları için */}
                        <GameCard
                            game={item as any} // (Eğer type hatası veriyorsa 'any' kalabilir, ancak Game interface'ini genişletmek en doğrusudur)
                            onPress={(gameId, name) => console.log('Oyuna Git:', gameId)}
                        />
                    </View>
                )}
                // Liste sonuna biraz boşluk bırakmak her zaman şık durur
                ListFooterComponent={<View style={{ height: 40 }} />}
            />
        </Container>
    );
};