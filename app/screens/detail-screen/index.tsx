import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, FlatList, Modal, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getGameDetailProcess, getGameScreenshotsProcess } from '../../redux/actions/gameActions';
import { resetGameDetail } from '../../redux/slices/gameSlice';
import { Container, AppText, Skeleton, ErrorState } from '@components';
import { GameDetailRouteProp } from '@types'; // Doğru tip import edildi
import { styles } from './styles';
import { spacing, colors } from '@theme';

export const DetailScreen = () => {
    const dispatch = useAppDispatch();
    const route = useRoute<GameDetailRouteProp>();
    console.log("Gelen Parametreler:", route.params);
    const { gameId, gameName } = route.params;

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data, isLoading, error } = useAppSelector((state) => state.game);
    const detail = data.getGameDetailProcess;
    const screenshots = data.getGameScreenshotsProcess?.results || [];

    const isPageLoading = isLoading['getGameDetailProcess'];
    const hasError = error['getGameDetailProcess'];

    useEffect(() => {
        dispatch(getGameDetailProcess(gameId));
        dispatch(getGameScreenshotsProcess(gameId));

        return () => {
            dispatch(resetGameDetail());
        };
    }, [dispatch, gameId]);

    if (isPageLoading) return <Container><Skeleton style={{ flex: 1, marginTop: 20 }} /></Container>;
    if (hasError) return <ErrorState onRetry={() => dispatch(getGameDetailProcess(gameId))} />;

    return (
        <Container style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={{ uri: detail?.background_image }}
                    style={styles.headerImage}
                />

                <View style={styles.content}>
                    <AppText variant="h1" style={{ marginBottom: spacing.md }}>{detail?.name}</AppText>

                    <View style={styles.row}>
                        <View style={styles.metaBox}>
                            <AppText variant="caption">ÇIKIŞ YILI</AppText>
                            <AppText variant="body" bold>{detail?.released ? detail.released.split('-')[0] : '-'}</AppText>
                        </View>
                        <View style={styles.metaBox}>
                            <AppText variant="caption">PUAN (META)</AppText>
                            <AppText style={styles.metacritic}>{detail?.metacritic || 'N/A'}</AppText>
                        </View>
                        <View style={styles.metaBox}>
                            <AppText variant="caption">TÜR</AppText>
                            <AppText variant="body" bold numberOfLines={1}>{detail?.genres?.[0]?.name || '-'}</AppText>
                        </View>
                    </View>

                    <AppText variant="h2" style={styles.sectionTitle}>Ekran Görüntüleri</AppText>
                    <FlatList
                        horizontal
                        data={screenshots}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setSelectedImage(item.image)}>
                                <Image source={{ uri: item.image }} style={styles.screenshot} />
                            </TouchableOpacity>
                        )}
                    />

                    <AppText variant="h2" style={styles.sectionTitle}>Oyun Hakkında</AppText>
                    <AppText style={styles.description}>
                        {detail?.description_raw || 'Bu oyun için henüz bir açıklama girilmemiş.'}
                    </AppText>

                    <View style={{ height: 50 }} />
                </View>
            </ScrollView>
            <Modal
                visible={!!selectedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSelectedImage(null)}
                >
                    <StatusBar hidden={!!selectedImage} />
                    <View style={styles.modalContent}>
                        <Image
                            source={{ uri: selectedImage || undefined }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <AppText bold style={{ color: colors.primary }}>KAPAT</AppText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </Container>
    );
};