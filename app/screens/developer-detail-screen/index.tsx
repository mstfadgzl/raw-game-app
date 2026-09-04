import React, { useEffect, useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getDeveloperDetailProcess } from '@actions';
import { Container, AppText, GameCard, Skeleton } from '@components';
import { translateText } from '@utils';
import { styles } from './styles';
import { spacing } from '@theme'; // Kartların kenar boşlukları için eklendi
import { DeveloperDetailRouteProp, IDeveloper } from '@types';


export const DeveloperDetailScreen = () => {
    const route = useRoute<DeveloperDetailRouteProp>();
    const { id } = route.params;
    const dispatch = useAppDispatch();

    const [trBio, setTrBio] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const { data, isLoading } = useAppSelector(state => state.entity);
    const developer = data.getDeveloperDetailProcess;
    const games = developer?.games || []; // Güvenli dizi kontrolü

    useEffect(() => {
        dispatch(getDeveloperDetailProcess(id));
    }, [id, dispatch]); // dispatch bağımlılığı eklendi (Best Practice)

    // Çeviri Mantığı ve Hata Kontrolü
    useEffect(() => {
        if (developer?.description) {
            setIsTranslating(true);
            translateText(developer.description)
                .then(setTrBio)
                .finally(() => setIsTranslating(false));
        } else {
            setTrBio(''); // Açıklama yoksa state'i temizle
        }
    }, [developer?.description]);

    if (isLoading['getDeveloperDetailProcess'] && !developer) {
        return <Container><Skeleton style={{ flex: 1 }} /></Container>;
    }

    // Kapak fotoğrafı ve stüdyo bilgilerini Header olarak ayırıyoruz
    const renderHeader = () => (
        <View>
            <Image source={{ uri: developer?.image_background }} style={styles.heroImage} />

            <View style={styles.content}>
                <AppText variant="h1">{developer?.name}</AppText>

                <AppText variant="h2" style={styles.subTitle}>Stüdyo Hakkında</AppText>
                <AppText style={styles.bio}>
                    {!developer?.description
                        ? 'Bu stüdyo için bir açıklama bulunmuyor.'
                        : isTranslating
                            ? 'Açıklama çevriliyor...'
                            : trBio}
                </AppText>

                {games.length > 0 && (
                    <AppText variant="h2" style={styles.subTitle}>Geliştirdikleri Oyunlar</AppText>
                )}
            </View>
        </View>
    );

    return (
        <Container style={styles.container}>
            <FlatList
                data={games}
                keyExtractor={(item) => `dev-game-${item.id}`}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                // Oyun kartlarını ekrana dizerken içeriğin arka plan rengiyle 
                // bütünleşik durması için View ile sarmalıyoruz:
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: spacing.md, backgroundColor: styles.content.backgroundColor }}>
                        <GameCard game={item as any} onPress={(gid) => console.log('Oyun ID:', gid)} />
                    </View>
                )}
                ListFooterComponent={<View style={{ height: 40, backgroundColor: styles.content.backgroundColor }} />}
            />
        </Container>
    );
};