import React from 'react';
import { View, FlatList, Linking, TouchableOpacity } from 'react-native';
import { useAppSelector } from '@hooks';
import { AppText, EmptyState, Skeleton } from '@components';
import { useStyles } from '../../styles';
import { colors } from '@theme';

export const CommunityTab = () => {
    const styles = useStyles();
    // Redux'tan isLoading durumunu da çekiyoruz
    const { data, isLoading } = useAppSelector(state => state.game);
    const posts = data.getGameRedditPostsProcess?.results || [];

    const isFetching = !!isLoading['getGameRedditPostsProcess'];

    // Güvenli Link Açma Fonksiyonu (Uygulamanın çökmesini engeller)
    const handlePressUrl = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.warn(`Bu link açılamıyor: ${url}`);
            }
        } catch (error) {
            console.error('Link yönlendirme hatası:', error);
        }
    };

    // Yükleme anında ekran titrememesi için Skeleton göster
    if (isFetching && posts.length === 0) {
        return (
            <View style={[styles.tabContent, { padding: 20 }]}>
                <Skeleton style={{ height: 80, borderRadius: 12, marginBottom: 15 }} />
                <Skeleton style={{ height: 80, borderRadius: 12, marginBottom: 15 }} />
                <Skeleton style={{ height: 80, borderRadius: 12, marginBottom: 15 }} />
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={posts}
                // Benzersiz (Unique) prefix eklendi
                keyExtractor={(item) => `reddit-${item.id}`}
                showsVerticalScrollIndicator={false}
                // En alttaki kartın TabBar veya alt çentiğin altında kalmaması için
                contentContainerStyle={{ paddingBottom: 50 }}

                ListHeaderComponent={
                    <AppText variant="h2" style={{ marginBottom: 15 }}>Reddit Tartışmaları</AppText>
                }

                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.redditCard}
                        onPress={() => handlePressUrl(item.url)}
                        activeOpacity={0.7} // Dokunma hissiyatı
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

                // Type hatası vermemesi için message prop'u kaldırıldı
                ListEmptyComponent={
                    posts.length === 0 ? <EmptyState /> : undefined
                }
            />
        </View>
    );
};