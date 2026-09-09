import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@hooks';
import { Container, AppText, Skeleton } from '@components';
import { GameDetailRouteProp, IGameDetail } from '@types';
import { gameService } from '../../api/services/gameService';
import { colors } from '@theme';
import { toggleFavorite } from '../../redux/slices/gameSlice';

import { styles } from './styles';

import { AboutTab } from './tabs/AboutTab';
import { MediaTab } from './tabs/MediaTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { ExpansionsTab } from './tabs/ExpansionsTab';
import { RedditTab } from './tabs/RedditTab';

const Tab = createMaterialTopTabNavigator();

export const DetailScreen = () => {
    const route = useRoute<GameDetailRouteProp>();
    const gameId = Number(route.params.gameId);

    if (!Number.isInteger(gameId) || gameId <= 0) {
        return (
            <Container>
                <View style={styles.feedback}>
                    <AppText>Geçerli bir oyun bulunamadı.</AppText>
                </View>
            </Container>
        );
    }

    return <DetailContent key={gameId} gameId={gameId} />;
};

const DetailContent = ({ gameId }: { gameId: number }) => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const favorites = useAppSelector(
        state => state.game.data.favorites || [],
    );

    const [detail, setDetail] = useState<IGameDetail | null>(() => gameService.peekGameDetail(gameId));
    const [loading, setLoading] = useState(() => !gameService.peekGameDetail(gameId));
    const [error, setError] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let active = true;

        setLoading(!gameService.peekGameDetail(gameId));
        setError(false);

        gameService.getGameDetail(gameId)
            .then(result => {
                if (!result || Number(result.id) !== gameId) {
                    throw new Error('Geçersiz oyun yanıtı');
                }

                if (active) {
                    setDetail(result);
                }
            })
            .catch(() => {
                if (active) {
                    setError(true);
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [dispatch, gameId, retryKey]);

    const isFavorite = favorites.some(
        (item: any) => Number(item.id) === gameId,
    );

    const handleFavorite = () => {
        if (!detail) return;

        dispatch(
            toggleFavorite({
                id: detail.id,
                name: detail.name,
                background_image: detail.background_image,
                rating: detail.rating,
                metacritic: detail.metacritic,
                released: detail.released,
            } as any),
        );
    };

    if (loading) {
        return (
            <Container>
                <View style={styles.container}>
                    <Skeleton
                        style={{ height: 235, width: '100%' }}
                    />

                    <View style={styles.content}>
                        <Skeleton
                            style={{
                                height: 40,
                                borderRadius: 12,
                                marginBottom: 20,
                            }}
                        />

                        <Skeleton
                            style={{
                                height: 160,
                                borderRadius: 12,
                            }}
                        />
                    </View>
                </View>
            </Container>
        );
    }

    if (error || !detail) {
        return (
            <Container>
                <View style={styles.feedback}>
                    <AppText style={styles.muted}>
                        Oyun bilgileri yüklenemedi.
                    </AppText>

                    <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.retryButton}
                        onPress={() => setRetryKey(value => value + 1)}
                    >
                        <AppText color={colors.primary} bold>
                            Tekrar dene
                        </AppText>
                    </TouchableOpacity>
                </View>
            </Container>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {!!detail.background_image && (
                    <Image
                        source={{ uri: detail.background_image }}
                        style={styles.heroImage}
                    />
                )}

                <View
                    pointerEvents="none"
                    style={styles.imageOverlay}
                />

                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={
                        isFavorite
                            ? 'Favorilerden çıkar'
                            : 'Favorilere ekle'
                    }
                    style={[styles.favButton, { top: insets.top + 10 }]}
                    onPress={handleFavorite}
                    activeOpacity={0.8}
                >
                    <AppText
                        style={{
                            fontSize: 26,
                            color: isFavorite ? '#FF6B81' : '#FFFFFF',
                        }}
                    >
                        {isFavorite ? '♥' : '♡'}
                    </AppText>
                </TouchableOpacity>

                <View style={styles.absoluteInfo}>
                    <AppText
                        style={styles.gameTitle}
                        numberOfLines={2}
                    >
                        {detail.name}
                    </AppText>

                    <View style={styles.metaContainer}>
                        {detail.rating > 0 && (
                            <View style={styles.metaBox}>
                                <AppText
                                    variant="caption"
                                    color={colors.primary}
                                    bold
                                >
                                    ★ Oyuncular {Number(detail.rating).toFixed(1)}/5
                                </AppText>
                            </View>
                        )}

                        {detail.metacritic > 0 && (
                            <View style={styles.metaBox}>
                                <AppText
                                    variant="caption"
                                    color="#FFFFFF"
                                    bold
                                >
                                    Metacritic {detail.metacritic}
                                </AppText>
                            </View>
                        )}

                    </View>
                </View>
            </View>

            <View style={styles.tabWrapper}>
                <Tab.Navigator
                    screenOptions={{
                        lazy: true,
                        lazyPreloadDistance: 0,
                        swipeEnabled: false,
                        tabBarScrollEnabled: true,
                        tabBarStyle: styles.bar,
                        tabBarItemStyle: styles.item,
                        tabBarIndicatorStyle: { height: 0 },
                        tabBarPressColor: 'transparent',
                        tabBarLabel: ({ focused, children }) => (
                            <View
                                style={[
                                    styles.pill,
                                    focused ? styles.activePill : null,
                                ]}
                            >
                                <AppText
                                    style={[
                                        styles.label,
                                        focused ? styles.activeLabel : {},
                                    ]}
                                >
                                    {children}
                                </AppText>
                            </View>
                        ),
                    }}
                >
                    <Tab.Screen name="Hakkında">
                        {() => <AboutTab detail={detail} />}
                    </Tab.Screen>

                    <Tab.Screen
                        name="Medya"
                        component={MediaTab}
                        initialParams={{ gameId }}
                    />

                    <Tab.Screen
                        name="DLC"
                        options={{ title: 'Ek içerikler' }}
                        component={ExpansionsTab}
                        initialParams={{ gameId }}
                    />

                    <Tab.Screen
                        name="Kupalar"
                        component={AchievementsTab}
                        initialParams={{ gameId }}
                    />

                    <Tab.Screen
                        name="Reddit"
                        options={{ title: 'Topluluk' }}
                        component={RedditTab}
                        initialParams={{ gameId }}
                    />
                </Tab.Navigator>
            </View>
        </View>
    );
};
