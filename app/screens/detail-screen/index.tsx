import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
    getGameDetailProcess,
    getGameTrailersProcess,
    getGameAchievementsProcess,
    getGameRedditPostsProcess,
    getGameSeriesProcess,
    getGameScreenshotsProcess // 🌟 EKSİK OLAN BUYDU, EKLENDİ
} from '@actions';
import { Container, AppText, Skeleton } from '@components';
import { GameDetailRouteProp } from '@types';
import { colors } from '@theme';
import { styles } from './styles';
import { toggleFavorite } from '../../redux/slices/gameSlice';

import { AboutTab } from './tabs/AboutTab';
import { MediaTab } from './tabs/MediaTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { CommunityTab } from './tabs/CommunityTab';
import { ExpansionsTab } from './tabs/ExpansionsTab';
import { RedditTab } from './tabs/RedditTab';

const Tab = createMaterialTopTabNavigator();
const { height } = Dimensions.get('window');

export const DetailScreen = () => {
    const route = useRoute<GameDetailRouteProp>();
    const dispatch = useAppDispatch();

    const safeGameId = Number(route.params.gameId);

    const { data, isLoading } = useAppSelector(state => state.game);
    const favorites = useAppSelector(state => state.game.data.favorites || []);

    const detail = data.getGameDetailProcess;
    const isFav = favorites.some((f: any) => f.id === detail?.id);

    const isDataMatching = detail?.id === safeGameId;
    const isFetching = isLoading['getGameDetailProcess'];

    useEffect(() => {
        dispatch(getGameDetailProcess(safeGameId));
        dispatch(getGameTrailersProcess(safeGameId));
        dispatch(getGameAchievementsProcess({ id: safeGameId, page: 1 })); // Sayfalama eklendi
        dispatch(getGameRedditPostsProcess({ id: safeGameId, page: 1 }));
        dispatch(getGameSeriesProcess(safeGameId));
        dispatch(getGameScreenshotsProcess(safeGameId)); // 🌟 MEDYA ARTIK ÇALIŞACAK
    }, [safeGameId, dispatch]);

    const handleFavorites = () => {
        if (detail) {
            const leanGameObj = {
                id: detail.id,
                name: detail.name,
                background_image: detail.background_image,
                rating: detail.rating,
                released: detail.released,
            };
            dispatch(toggleFavorite(leanGameObj as any));
        }
    };

    if (isFetching || !isDataMatching) {
        return <Container><Skeleton style={{ flex: 1 }} /></Container>;
    }

    return (
        <Container style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 0 }}>
            {/* 🌟 SCROLLVIEW: Resmi yukarı kaydırmak için kullanıyoruz */}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                stickyHeaderIndices={[2]} // Tab bar'ın (3. eleman, index 2) ekranda asılı kalmasını sağlar
                showsVerticalScrollIndicator={false}
            >
                {/* 1. ELEMAN: Sadece Kapak Fotoğrafı ve Favori Butonu */}
                <View style={styles.mediaContainer}>
                    <Image source={{ uri: detail?.background_image }} style={styles.heroImage} />
                    <TouchableOpacity
                        style={styles.favButton}
                        onPress={handleFavorites}
                        activeOpacity={0.7}
                    >
                        <AppText style={{ fontSize: 24 }}>{isFav ? '❤️' : '🤍'}</AppText>
                    </TouchableOpacity>
                </View>

                {/* 2. ELEMAN: Temel Bilgiler */}
                <View style={styles.basicInfo}>
                    <AppText variant="h1" numberOfLines={2}>{detail?.name}</AppText>
                    <View style={styles.metaRow}>
                        <AppText color={colors.primary} bold>★ {detail?.rating}</AppText>
                        <AppText color={colors.secondary}> | </AppText>
                        <AppText color={colors.secondary}>{detail?.released?.split('-')[0]}</AppText>
                    </View>
                </View>

                {/* 3. ELEMAN: TAB NAVIGATOR (Ekran boyutu kadar alan kaplar ki rahatça kaysın) */}
                <View style={{ height: height - 100 }}>
                    <Tab.Navigator
                        screenOptions={{
                            lazy: true,
                            tabBarScrollEnabled: true,
                            tabBarActiveTintColor: colors.primary,
                            tabBarInactiveTintColor: colors.secondary,
                            tabBarStyle: { backgroundColor: colors.background },
                            tabBarIndicatorStyle: { backgroundColor: colors.primary },
                            tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
                        }}
                    >
                        <Tab.Screen name="Hakkında" component={AboutTab} />
                        <Tab.Screen name="Medya" component={MediaTab} />
                        <Tab.Screen name="DLC" component={ExpansionsTab} />
                        <Tab.Screen name="Kupalar" component={AchievementsTab} />
                        <Tab.Screen name="Reddit" component={RedditTab} />
                    </Tab.Navigator>
                </View>
            </ScrollView>
        </Container>
    );
};