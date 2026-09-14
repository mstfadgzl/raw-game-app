import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useAppDispatch } from '@hooks';
import {
    getGameAdditionProcess,
    getGameSeriesProcess,
} from '@actions';
import { CompactGameItem, AppText, EmptyState } from '@components';
import { colors } from '@theme';
import { useStyles } from '../../styles';

export const ExpansionsTab = () => {
    const styles = useStyles();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const gameId = Number(route.params.gameId);

    const [dlcs, setDlcs] = useState<any[]>([]);
    const [series, setSeries] = useState<any[]>([]);

    const [dlcLoading, setDlcLoading] = useState(true);
    const [seriesLoading, setSeriesLoading] = useState(true);

    const [dlcError, setDlcError] = useState(false);
    const [seriesError, setSeriesError] = useState(false);

    const [dlcRetry, setDlcRetry] = useState(0);
    const [seriesRetry, setSeriesRetry] = useState(0);

    useEffect(() => {
        let active = true;

        setDlcs([]);
        setDlcLoading(true);
        setDlcError(false);

        // Action farklı parametre alıyorsa bu çağrıyı uyarlamalısın.
        dispatch(getGameAdditionProcess(gameId))
            .unwrap()
            .then(result => {
                if (!Array.isArray(result?.results)) {
                    throw new Error('Geçersiz DLC yanıtı');
                }

                if (active) {
                    setDlcs(result.results);
                }
            })
            .catch(() => {
                if (active) {
                    setDlcError(true);
                }
            })
            .finally(() => {
                if (active) {
                    setDlcLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [dispatch, gameId, dlcRetry]);

    useEffect(() => {
        let active = true;

        setSeries([]);
        setSeriesLoading(true);
        setSeriesError(false);

        dispatch(getGameSeriesProcess(gameId))
            .unwrap()
            .then(result => {
                if (!Array.isArray(result?.results)) {
                    throw new Error('Geçersiz seri yanıtı');
                }

                if (active) {
                    setSeries(result.results);
                }
            })
            .catch(() => {
                if (active) {
                    setSeriesError(true);
                }
            })
            .finally(() => {
                if (active) {
                    setSeriesLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [dispatch, gameId, seriesRetry]);

    const handleNavigate = (id: number | string, name: string) => {
        navigation.push('GameDetail', {
            gameId: id,
            gameName: name,
        });
    };

    const renderSection = (
        title: string,
        items: any[],
        loading: boolean,
        error: boolean,
        onRetry: () => void,
    ) => (
        <View style={{ marginBottom: 24 }}>
            <AppText style={styles.sectionTitle}>
                {title}
            </AppText>

            {loading ? (
                <View style={styles.feedback}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            ) : error ? (
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
            ) : items.length ? (
                items.map(item => (
                    <CompactGameItem
                        key={`${title}-${item.id}`}
                        game={item}
                        onPress={handleNavigate}
                    />
                ))
            ) : (
                <EmptyState />
            )}
        </View>
    );

    return (
        <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {renderSection(
                'Ek paketler',
                dlcs,
                dlcLoading,
                dlcError,
                () => setDlcRetry(value => value + 1),
            )}

            {renderSection(
                'Serinin diğer oyunları',
                series,
                seriesLoading,
                seriesError,
                () => setSeriesRetry(value => value + 1),
            )}
        </ScrollView>
    );
};