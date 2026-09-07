import React, { useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '@hooks';
import { getGameAchievementsProcess } from '@actions';
import { AchievementItem, AppText, EmptyState, Skeleton } from '@components';
import { styles } from '../../styles';
import { colors } from '@theme';
import { GameDetailRouteProp } from '@types';

export const AchievementsTab = () => {
    const route = useRoute<GameDetailRouteProp>();
    const dispatch = useAppDispatch();
    const safeGameId = Number(route.params.gameId);

    const [page, setPage] = useState(1);
    const { data, isLoading } = useAppSelector(state => state.game);

    const achievementsData = data.getGameAchievementsProcess;
    const achievements = achievementsData?.results || [];

    const isFetching = !!isLoading['getGameAchievementsProcess'] && page === 1;
    const isMoreLoading = !!isLoading['getGameAchievementsProcess'] && page > 1;

    // 🌟 AŞAĞI KAYDIRDIKÇA YENİLERİNİ ÇEKME FONKSİYONU
    const handleLoadMore = () => {
        if (achievementsData?.next && !isLoading['getGameAchievementsProcess']) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getGameAchievementsProcess({ id: safeGameId, page: nextPage }));
        }
    };

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
                keyExtractor={(item, index) => `achievement-${item.id}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50, padding: 16 }}
                ListHeaderComponent={
                    <AppText variant="h2" style={{ marginBottom: 15 }}>Başarımlar</AppText>
                }
                renderItem={({ item }) => <AchievementItem achievement={item} />}
                onEndReached={handleLoadMore} // 🌟 SİHİR BURADA
                onEndReachedThreshold={0.5}
                ListEmptyComponent={achievements.length === 0 ? <EmptyState /> : undefined}
                ListFooterComponent={
                    isMoreLoading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} /> : undefined
                }
            />
        </View>
    );
};