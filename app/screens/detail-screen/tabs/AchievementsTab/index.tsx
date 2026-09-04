import React from 'react';
import { FlatList, View } from 'react-native';
import { useAppSelector } from '@hooks';
import { AchievementItem, AppText, EmptyState, Skeleton } from '@components';
import { styles } from '../../styles';

export const AchievementsTab = () => {
    const { data, isLoading } = useAppSelector(state => state.game);
    const achievements = data.getGameAchievementsProcess?.results || [];

    // Yükleme durumunu güvenli değişkene atıyoruz
    const isFetching = !!isLoading['getGameAchievementsProcess'];

    // İlk yükleme anında ekranda boşluk yerine İskelet (Skeleton) gösteriyoruz
    if (isFetching && achievements.length === 0) {
        return (
            <View style={[styles.tabContent, { padding: 20 }]}>
                <Skeleton style={{ height: 70, borderRadius: 12, marginBottom: 15 }} />
                <Skeleton style={{ height: 70, borderRadius: 12, marginBottom: 15 }} />
                <Skeleton style={{ height: 70, borderRadius: 12, marginBottom: 15 }} />
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={achievements}
                // Benzersiz (Unique) ve güvenli anahtar ataması
                keyExtractor={(item) => `achievement-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}

                ListHeaderComponent={
                    <AppText variant="h2" style={{ marginBottom: 15 }}>Başarımlar</AppText>
                }

                renderItem={({ item }) => <AchievementItem achievement={item} />}

                // 1. null yerine undefined kullanıldı
                // 2. EmptyState hatasını önlemek için message kaldırıldı (Eğer prop eklediysen geri koyabilirsin)
                ListEmptyComponent={
                    achievements.length === 0 ? <EmptyState /> : undefined
                }
            />
        </View>
    );
};