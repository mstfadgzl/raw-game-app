import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import {
    getGameDetailProcess,
    getGameTrailersProcess,
    getGameAchievementsProcess,
    getGameRedditPostsProcess,
    getGameSeriesProcess
} from '@actions';
import { Container, AppText, VideoPlayer, Skeleton } from '@components';
import { GameDetailRouteProp } from '@types';
import { colors } from '@theme';
import { styles } from './styles';

import { AboutTab } from './tabs/AboutTab';
import { MediaTab } from './tabs/MediaTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { CommunityTab } from './tabs/CommunityTab';
import { toggleFavorite } from '../../redux/slices/gameSlice';

const Tab = createMaterialTopTabNavigator();

export const DetailScreen = () => {
    const route = useRoute<GameDetailRouteProp>();
    const dispatch = useAppDispatch();

    const safeGameId = Number(route.params.gameId);

    const { data, isLoading } = useAppSelector(state => state.game);
    const favorites = useAppSelector(state => state.game.data.favorites || []);

    const detail = data.getGameDetailProcess;
    const isFav = favorites.some((f: any) => f.id === detail?.id);
    const trailer = data.getGameTrailersProcess?.results?.[0];

    const isDataMatching = detail?.id === safeGameId;
    const isFetching = isLoading['getGameDetailProcess'];

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

    useEffect(() => {
        dispatch(getGameDetailProcess(safeGameId));
        dispatch(getGameTrailersProcess(safeGameId));
        dispatch(getGameAchievementsProcess(safeGameId));
        dispatch(getGameRedditPostsProcess({ id: safeGameId, page: 1 }));
        dispatch(getGameSeriesProcess(safeGameId));
    }, [safeGameId, dispatch]);

    if (isFetching || !isDataMatching) {
        return <Container><Skeleton style={{ flex: 1 }} /></Container>;
    }

    return (
        <Container style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.mediaContainer}>
                {trailer ? (
                    <VideoPlayer trailer={trailer} />
                ) : (
                    <Image source={{ uri: detail?.background_image }} style={styles.heroImage} />
                )}

                <TouchableOpacity
                    style={styles.favButton}
                    onPress={handleFavorites}
                    activeOpacity={0.7}
                >
                    <AppText style={{ fontSize: 24 }}>{isFav ? '❤️' : '🤍'}</AppText>
                </TouchableOpacity>
            </View>

            <View style={styles.basicInfo}>
                <AppText variant="h1" numberOfLines={2}>{detail?.name}</AppText>
                <View style={styles.metaRow}>
                    <AppText color={colors.primary} bold>★ {detail?.rating}</AppText>
                    <AppText color={colors.secondary}> | </AppText>
                    <AppText color={colors.secondary}>{detail?.released?.split('-')[0]}</AppText>
                </View>
            </View>

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
                <Tab.Screen name="Kupalar" component={AchievementsTab} />
                <Tab.Screen name="Topluluk" component={CommunityTab} />
            </Tab.Navigator>
        </Container>
    );
};