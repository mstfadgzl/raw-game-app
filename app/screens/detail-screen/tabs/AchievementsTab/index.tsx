import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@hooks';
import { getGameAchievementsProcess } from '@actions';
import { AchievementItem, AppText, EmptyState, Skeleton } from '@components';
import { styles } from '../../styles';

export const AchievementsTab = () => {
    const route = useRoute<any>();
    const dispatch = useAppDispatch();
    const safeGameId = Number(route.params.gameId);

    const { data, isLoading } = useAppSelector(state => state.game);

    // Sayfalama derdi olmadan tüm başarımları tek seferde çekiyoruz
    useEffect(() => {
        dispatch(getGameAchievementsProcess({ id: safeGameId, page_size: 100 } as any));
    }, [safeGameId, dispatch]);

    const achievementsData = data.getGameAchievementsProcess;
    // Eğer gelen veri direkt dizi (array) ise veya results nesnesindeyse her iki durumu da karşılıyoruz
    const achievements = Array.isArray(achievementsData)
        ? achievementsData
        : (achievementsData?.results || []);

    const isFetching = !!isLoading['getGameAchievementsProcess'];

    if (isFetching && achievements.length === 0) {
        return (
            <View style={[styles.tabContent, { padding: 20 }]}>
                {[1, 2, 3, 4].map(i => <Skeleton key={i} style={{ height: 70, borderRadius: 12, marginBottom: 15 }} />)}
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={achievements}
                keyExtractor={(item, index) => `achievement-${item.id || index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50, padding: 16 }}
                ListHeaderComponent={
                    <AppText variant="h2" style={{ marginBottom: 15 }}>Başarımlar</AppText>
                }
                renderItem={({ item }) => <AchievementItem achievement={item} />}
                ListEmptyComponent={<EmptyState message="Bu oyun için başarımlık veri bulunmuyor." />}
            />
        </View>
    );
};