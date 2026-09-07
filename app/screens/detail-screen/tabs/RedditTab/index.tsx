import React from 'react';
import { FlatList, View, TouchableOpacity, Linking } from 'react-native';
import { useAppSelector } from '@hooks';
import { AppText, EmptyState, Skeleton } from '@components';
import { styles } from '../../styles';
import { colors } from '@theme';

export const RedditTab = () => {
    const { data, isLoading } = useAppSelector(state => state.game);
    const posts = data.getGameRedditPostsProcess?.results || [];
    const isFetching = !!isLoading['getGameRedditPostsProcess'];

    const handlePressUrl = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isFetching && posts.length === 0) {
        return (
            <View style={[styles.tabContent, { padding: 20 }]}>
                {[1, 2, 3].map(i => <Skeleton key={i} style={{ height: 80, borderRadius: 12, marginBottom: 15 }} />)}
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={posts}
                keyExtractor={(item) => `reddit-${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50, padding: 16 }}
                ListHeaderComponent={
                    <AppText variant="h2" style={{ marginBottom: 15 }}>Reddit Tartışmaları</AppText>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.redditCard}
                        onPress={() => handlePressUrl(item.url)}
                        activeOpacity={0.7}
                    >
                        <AppText bold numberOfLines={2}>{item.name}</AppText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            <AppText variant="caption" color={colors.primary}>
                                u/{item.username || 'anonim'}
                            </AppText>
                            <AppText variant="caption">
                                {new Date(item.created).toLocaleDateString('tr-TR')}
                            </AppText>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={posts.length === 0 ? <EmptyState /> : undefined}
            />
        </View>
    );
};