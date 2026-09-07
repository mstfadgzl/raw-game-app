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
    getGameSeriesProcess,
    getGameScreenshotsProcess
} from '@actions';
import { Container, AppText, Skeleton } from '@components';
import { GameDetailRouteProp } from '@types';
import { colors } from '@theme';
import { styles } from './styles';
import { toggleFavorite } from '../../redux/slices/gameSlice';

import { AboutTab } from './tabs/AboutTab';
import { MediaTab } from './tabs/MediaTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { ExpansionsTab } from './tabs/ExpansionsTab';
import { RedditTab } from './tabs/RedditTab';

const Tab = createMaterialTopTabNavigator();

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
        dispatch(getGameAchievementsProcess({ id: safeGameId, page: 1 }));
        dispatch(getGameRedditPostsProcess({ id: safeGameId, page: 1 }));
        dispatch(getGameSeriesProcess(safeGameId));
        dispatch(getGameScreenshotsProcess(safeGameId));
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
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image source={{ uri: detail?.background_image }} style={styles.heroImage} />
                <View style={styles.imageOverlay} />

                <TouchableOpacity style={styles.favButton} onPress={handleFavorites}>
                    <AppText style={{ fontSize: 24 }}>{isFav ? '❤️' : '🤍'}</AppText>
                </TouchableOpacity>

                <View style={styles.absoluteInfo}>
                    <AppText style={styles.gameTitle} numberOfLines={2}>{detail?.name}</AppText>

                    <View style={styles.metaContainer}>
                        <View style={styles.metaBox}>
                            <AppText variant="caption" bold color={colors.primary}>★ {detail?.rating}</AppText>
                        </View>
                        <View style={styles.metaBox}>
                            <AppText variant="caption" bold>{detail?.released?.split('-')[0]}</AppText>
                        </View>
                        {detail?.playtime > 0 && (
                            <View style={styles.metaBox}>
                                <AppText variant="caption" bold>{detail.playtime} SAAT</AppText>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View style={[styles.tabWrapper, { flex: 1 }]}>
                <Tab.Navigator
                    screenOptions={{
                        lazy: true,
                        swipeEnabled: false,
                        tabBarScrollEnabled: true,
                        tabBarActiveTintColor: colors.primary,
                        tabBarInactiveTintColor: colors.secondary,
                        tabBarStyle: {
                            backgroundColor: 'transparent',
                            elevation: 0,
                            shadowOpacity: 0
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: colors.primary,
                            height: 3,
                            borderRadius: 3
                        },
                        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
                    }}
                >
                    <Tab.Screen name="Hakkında" component={AboutTab} initialParams={{ gameId: safeGameId }} />
                    <Tab.Screen name="Medya" component={MediaTab} initialParams={{ gameId: safeGameId }} />
                    <Tab.Screen name="DLC" component={ExpansionsTab} initialParams={{ gameId: safeGameId }} />
                    <Tab.Screen name="Kupalar" component={AchievementsTab} initialParams={{ gameId: safeGameId }} />
                    <Tab.Screen name="Reddit" component={RedditTab} initialParams={{ gameId: safeGameId }} />
                </Tab.Navigator>
            </View>
        </View>
    );
};