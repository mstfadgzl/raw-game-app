import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, FlatList, Modal, TouchableOpacity, StatusBar, BackHandler, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@hooks';
import { getGameDetailProcess, getGameScreenshotsProcess } from '../../redux/actions/gameActions';
import { resetGameDetail } from '../../redux/slices/gameSlice';
import { Container, AppText, Skeleton, ErrorState } from '@components';
import { GameDetailRouteProp } from '@types'; // Doğru tip import edildi
import { styles } from './styles';
import { spacing, colors } from '@theme';

const { width, height } = Dimensions.get('window');

export const DetailScreen = () => {
    const dispatch = useAppDispatch();
    const route = useRoute<GameDetailRouteProp>();
    console.log("Gelen Parametreler:", route.params);
    const { gameId, gameName } = route.params;

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const windowWidth = Math.round(Dimensions.get('window').width);
    const windowHeight = Math.round(Dimensions.get('window').height);

    const { data, isLoading, error } = useAppSelector((state) => state.game);
    const detail = data.getGameDetailProcess;
    const screenshots = data.getGameScreenshotsProcess?.results || [];

    const isPageLoading = isLoading['getGameDetailProcess'];
    const hasError = error['getGameDetailProcess'];

    useEffect(() => {
        dispatch(getGameDetailProcess(gameId));
        dispatch(getGameScreenshotsProcess(gameId));

        const backAction = () => {
            if (selectedImageIndex !== null) {
                setSelectedImageIndex(null);
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
            dispatch(resetGameDetail());
        };
    }, [dispatch, gameId, selectedImageIndex]);

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
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => setSelectedImageIndex(item)}>
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
                visible={selectedImageIndex !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImageIndex(null)}

            >
                <View style={styles.modalOverlay}>
                    {selectedImageIndex !== null && (
                        <FlatList
                            key="fullscreen-galery"
                            data={screenshots}
                            horizontal
                            pagingEnabled
                            keyExtractor={(item) => item.id.toString()}
                            initialScrollIndex={selectedImageIndex}
                            getItemLayout={(_, index) => ({
                                length: width,
                                offset: width * index,
                                index,
                            })}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ width: windowWidth, height: windowHeight }}
                                    onPress={() => setSelectedImageIndex(null)}
                                >
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{ width: windowWidth, height: windowHeight }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </Modal>
        </Container>
    );
};