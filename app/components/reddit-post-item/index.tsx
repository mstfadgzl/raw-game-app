import React, { memo } from 'react';
import { TouchableOpacity, View, Linking } from 'react-native';
import { IRedditPost } from '@types';
import { AppText } from '../app-text';
import { styles } from './styles';
import { colors } from '@theme';

interface RedditPostItemProps {
    post: IRedditPost;
}

export const RedditPostItem: React.FC<RedditPostItemProps> = memo(({ post }) => {
    const handlePress = () => {
        if (post.url) Linking.openURL(post.url);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
            <View style={styles.header}>
                <AppText variant="caption" color={colors.primary} bold>u/{post.username}</AppText>
                <AppText variant="caption" color={colors.secondary}>
                    {new Date(post.created).toLocaleDateString('tr-TR')}
                </AppText>
            </View>
            <AppText variant="body" bold numberOfLines={2} style={styles.title}>
                {post.name}
            </AppText>
            {post.text && (
                <AppText variant="caption" numberOfLines={3} style={styles.snippet}>
                    {post.text.replace(/<[^>]*>?/gm, '')}
                </AppText>
            )}
        </TouchableOpacity>
    );
});