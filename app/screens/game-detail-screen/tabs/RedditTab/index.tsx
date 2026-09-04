import React from 'react';
import { FlatList, View } from 'react-native';
import { useAppSelector } from '@hooks';
import { AppText, RedditPostItem, EmptyState, Skeleton } from '@components';
import { styles } from '../../styles';

export const RedditTab = () => {
    const { data, isLoading } = useAppSelector(state => state.game);
    const posts = data.getGameRedditPostsProcess?.results || [];

    if (isLoading['getGameRedditPostsProcess'] && posts.length === 0) {
        return (
            <View style={styles.tabContent}>
                {[1, 2, 3].map(i => <Skeleton key={i} style={{ height: 100, marginBottom: 10 }} />)}
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={posts}
                keyExtractor={(item) => `reddit-${item.id}`}
                renderItem={({ item }) => <RedditPostItem post={item} />}
                ListHeaderComponent={
                    <AppText variant="h2" style={{ marginBottom: 15 }}>
                        Reddit Tartışmaları
                    </AppText>
                }
                ListEmptyComponent={<EmptyState message="Henüz bir topluluk tartışması bulunmuyor." />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
        </View>
    );
};