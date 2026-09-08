import React from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useAppSelector } from '@hooks';
import { EmptyState, VideoPlayer } from '@components';

const { width } = Dimensions.get('window');

export const MediaTab = () => {
    const { data } = useAppSelector(state => state.game);
    const screenshots = data.getGameScreenshotsProcess?.results || [];
    const trailer = data.getGameTrailersProcess?.results?.[0];

    const mediaItems: any[] = [];
    if (trailer) {
        mediaItems.push({ id: 'trailer', type: 'video', content: trailer });
    }
    screenshots.forEach((shot: any) => {
        mediaItems.push({ id: shot.id.toString(), type: 'image', content: shot.image });
    });

    if (mediaItems.length === 0) {
        return (
            <View style={localStyles.emptyContainer}>
                <EmptyState message="Bu oyun için henüz medya bulunmuyor." />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <FlatList
                data={mediaItems}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                renderItem={({ item }) => (
                    <View style={localStyles.mediaItemContainer}>
                        {item.type === 'video' ? (
                            <VideoPlayer trailer={item.content} />
                        ) : (
                            <Image
                                source={{ uri: item.content }}
                                style={localStyles.image}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    mediaItemContainer: {
        width: width,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});