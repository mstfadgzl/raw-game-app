import React from 'react';
import { FlatList, View } from 'react-native';
import { useAppSelector } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import { Container, AppText, GameCard, EmptyState } from '@components';
import { GenericNavigationProp } from '@types';
import { styles } from './styles';

export const LibraryScreen = () => {
    const navigation = useNavigation<GenericNavigationProp>();

    const favorites = useAppSelector(state => state.game.data.favorites || []);

    return (
        <Container style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => `fav-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}

                // Başlığı listenin içine aldık (Sayfayla beraber pürüzsüz kayması için)
                ListHeaderComponent={
                    <View style={styles.header}>
                        <AppText variant="h1">Kitaplığım</AppText>
                        <AppText variant="caption">{favorites.length} Oyun Kaydedildi</AppText>
                    </View>
                }

                renderItem={({ item }) => (
                    // Kartların ekranın kenarlarına yapışmaması için wrapper (sarmalayıcı) ekledik
                    <View style={styles.cardWrapper}>
                        <GameCard
                            game={item}
                            onPress={(id, name) => navigation.navigate('GameDetail', { gameId: id, gameName: name })}
                        />
                    </View>
                )}

                // TypeScript hatası vermemesi için message prop'u kaldırıldı
                ListEmptyComponent={<EmptyState />}
            />
        </Container>
    );
};