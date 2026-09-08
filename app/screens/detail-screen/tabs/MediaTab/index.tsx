import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';

import { useAppDispatch } from '@hooks';
import {
    getGameScreenshotsProcess,
    getGameTrailersProcess,
} from '@actions';
import { AppText, EmptyState, VideoPlayer } from '@components';
import { colors } from '@theme';
import { styles } from '../../styles';

const Screenshot = ({ uri }: { uri: string }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <View style={localStyles.imageBox}>
            <Image
                source={{ uri }}
                style={localStyles.image}
                resizeMode="contain"
                onLoadStart={() => {
                    setLoading(true);
                    setError(false);
                }}
                onLoadEnd={() => setLoading(false)}
                onError={() => setError(true)}
            />

            {loading && (
                <View style={localStyles.overlay}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            )}

            {error && !loading && (
                <View style={localStyles.overlay}>
                    <AppText style={styles.muted}>
                        Görsel yüklenemedi.
                    </AppText>
                </View>
            )}
        </View>
    );
};

export const MediaTab = () => {
    const route = useRoute<any>();
    const gameId = Number(route.params.gameId);

    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();

    const [screenshots, setScreenshots] = useState<any[]>([]);
    const [trailer, setTrailer] = useState<any>(null);

    const [shotsLoading, setShotsLoading] = useState(true);
    const [trailerLoading, setTrailerLoading] = useState(true);

    const [shotsError, setShotsError] = useState(false);
    const [trailerError, setTrailerError] = useState(false);

    const [shotsRetry, setShotsRetry] = useState(0);
    const [trailerRetry, setTrailerRetry] = useState(0);

    useEffect(() => {
        let active = true;

        setScreenshots([]);
        setShotsLoading(true);
        setShotsError(false);

        dispatch(getGameScreenshotsProcess(gameId))
            .unwrap()
            .then(result => {
                if (!Array.isArray(result?.results)) {
                    throw new Error('Geçersiz görsel yanıtı');
                }

                if (active) {
                    setScreenshots(result.results);
                }
            })
            .catch(() => {
                if (active) {
                    setShotsError(true);
                }
            })
            .finally(() => {
                if (active) {
                    setShotsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [dispatch, gameId, shotsRetry]);

    useEffect(() => {
        let active = true;

        setTrailer(null);
        setTrailerLoading(true);
        setTrailerError(false);

        dispatch(getGameTrailersProcess(gameId))
            .unwrap()
            .then(result => {
                if (!Array.isArray(result?.results)) {
                    throw new Error('Geçersiz fragman yanıtı');
                }

                if (active) {
                    setTrailer(result.results[0] || null);
                }
            })
            .catch(() => {
                if (active) {
                    setTrailerError(true);
                }
            })
            .finally(() => {
                if (active) {
                    setTrailerLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [dispatch, gameId, trailerRetry]);

    const renderError = (onRetry: () => void) => (
        <View style={styles.feedback}>
            <AppText style={styles.muted}>
                İçerik yüklenemedi.
            </AppText>

            <TouchableOpacity
                accessibilityRole="button"
                style={styles.retryButton}
                onPress={onRetry}
            >
                <AppText color={colors.primary} bold>
                    Tekrar dene
                </AppText>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.tabContent}>
            <FlatList
                data={screenshots}
                keyExtractor={item => `screenshot-${item.id}`}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                initialNumToRender={3}
                windowSize={5}
                ListHeaderComponent={
                    <>
                        <AppText style={styles.sectionTitle}>
                            Fragman
                        </AppText>

                        {trailerLoading ? (
                            <View style={styles.feedback}>
                                <ActivityIndicator
                                    color={colors.primary}
                                />
                            </View>
                        ) : trailerError ? (
                            renderError(() =>
                                setTrailerRetry(value => value + 1),
                            )
                        ) : trailer ? (
                            <View style={localStyles.videoBox}>
                                {isFocused && (
                                    <VideoPlayer trailer={trailer} />
                                )}
                            </View>
                        ) : (
                            <AppText
                                style={[
                                    styles.muted,
                                    { marginBottom: 24 },
                                ]}
                            >
                                Bu oyun için fragman bulunmuyor.
                            </AppText>
                        )}

                        <AppText style={styles.sectionTitle}>
                            Ekran görüntüleri
                        </AppText>
                    </>
                }
                renderItem={({ item }) => (
                    <Screenshot
                        key={item.image}
                        uri={item.image}
                    />
                )}
                ListEmptyComponent={
                    shotsLoading ? (
                        <View style={styles.feedback}>
                            <ActivityIndicator
                                color={colors.primary}
                            />
                        </View>
                    ) : shotsError ? (
                        renderError(() =>
                            setShotsRetry(value => value + 1),
                        )
                    ) : (
                        <EmptyState />
                    )
                }
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    imageBox: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#141925',
        marginBottom: 14,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#141925',
    },
    videoBox: {
        width: '100%',
        minHeight: 200,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#141925',
        marginBottom: 24,
    },
});