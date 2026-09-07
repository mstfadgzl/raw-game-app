import React, { useEffect, useState } from 'react';
import { ScrollView, View, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppSelector } from '@hooks';
import { AppText, GenreChip } from '@components';
import { translateText } from '@utils';
import { styles as globalStyles } from '../../styles';
import { colors, spacing } from '@theme';

export const AboutTab = () => {
    const { data } = useAppSelector(state => state.game);
    const detail = data.getGameDetailProcess;

    const [trDescription, setTrDescription] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);

    useEffect(() => {
        if (detail?.description_raw) {
            setTrDescription('');
            setIsTranslating(true);

            translateText(detail.description_raw)
                .then((translated) => {
                    if (translated && translated.trim().length > 0) {
                        setTrDescription(translated);
                    } else {
                        setTrDescription(detail.description_raw);
                    }
                })
                .catch(() => {
                    setTrDescription(detail.description_raw);
                })
                .finally(() => setIsTranslating(false));
        } else {
            setTrDescription('');
        }
    }, [detail?.description_raw]);

    const handlePressWebsite = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!detail) return null;

    return (
        <ScrollView
            style={globalStyles.tabContent}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            <AppText variant="h2" style={{ marginBottom: spacing.sm }}>Oyun Hikayesi</AppText>
            <AppText style={localStyles.description}>
                {!detail.description_raw
                    ? 'Bu oyun için bir hikaye bulunmuyor.'
                    : isTranslating
                        ? 'Hikaye Türkçeye çevriliyor, lütfen bekleyin...'
                        : (trDescription || detail.description_raw)}
            </AppText>

            <View style={localStyles.gridContainer}>
                <View style={localStyles.gridItem}>
                    <AppText variant="caption" color={colors.primary} bold>GELİŞTİRİCİ</AppText>
                    <AppText bold numberOfLines={1}>{detail.developers?.map((d: any) => d.name).join(', ') || 'Bilinmiyor'}</AppText>
                </View>

                <View style={localStyles.gridItem}>
                    <AppText variant="caption" color={colors.primary} bold>YAYINCI</AppText>
                    <AppText bold numberOfLines={1}>{detail.publishers?.map((p: any) => p.name).join(', ') || 'Bilinmiyor'}</AppText>
                </View>

                <View style={localStyles.gridItem}>
                    <AppText variant="caption" color={colors.primary} bold>ORTALAMA SÜRE</AppText>
                    <AppText bold>{detail.playtime > 0 ? `${detail.playtime} Saat` : 'Veri yok'}</AppText>
                </View>

                <View style={localStyles.gridItem}>
                    <AppText variant="caption" color={colors.primary} bold>YAŞ SINIRI (ESRB)</AppText>
                    <AppText bold>{detail.esrb_rating?.name || 'Derecelendirilmemiş'}</AppText>
                </View>
            </View>

            {detail.tags && detail.tags.length > 0 && (
                <>
                    <AppText variant="h2" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>Özellikler & Etiketler</AppText>
                    <View style={localStyles.tagsContainer}>
                        {detail.tags.slice(0, 15).map((tag: any) => (
                            <GenreChip
                                key={`about-tag-${tag.id}`}
                                name={tag.name}
                                onPress={() => { }}
                            />
                        ))}
                    </View>
                </>
            )}

            {detail.website && (
                <TouchableOpacity onPress={() => handlePressWebsite(detail.website)} style={localStyles.websiteButton}>
                    <AppText bold color={colors.background}>Resmi Web Sitesini Ziyaret Et</AppText>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    description: {
        lineHeight: 22,
        color: '#E0E0E0',
        marginBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    gridItem: {
        width: '48%',
        backgroundColor: '#1E1E1E',
        padding: 14,
        borderRadius: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
    },
    websiteButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    }
});