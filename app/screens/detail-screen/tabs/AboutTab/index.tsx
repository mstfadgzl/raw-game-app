import React, { useEffect, useState } from 'react';
import { ScrollView, View, Linking } from 'react-native';
import { useAppSelector } from '@hooks';
import { AppText, GenreChip } from '@components';
import { translateText } from '@utils';
import { styles } from '../../styles';
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
                .then(setTrDescription)
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
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
            <AppText variant="h2" style={{ marginBottom: spacing.sm }}>Oyun Hikayesi</AppText>
            <AppText style={styles.description}>
                {!detail.description_raw
                    ? 'Bu oyun için bir hikaye bulunmuyor.'
                    : isTranslating
                        ? 'Hikaye Türkçeye çevriliyor...'
                        : (trDescription || detail.description_raw)}
            </AppText>

            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <AppText variant="caption" color={colors.primary} bold>GELİŞTİRİCİ</AppText>
                    <AppText bold>{detail.developers?.map((d: any) => d.name).join(', ') || 'Bilinmiyor'}</AppText>
                </View>
                <View style={styles.infoItem}>
                    <AppText variant="caption" color={colors.primary} bold>YAYINCI</AppText>
                    <AppText bold>{detail.publishers?.map((p: any) => p.name).join(', ') || 'Bilinmiyor'}</AppText>
                </View>
                <View style={styles.infoItem}>
                    <AppText variant="caption" color={colors.primary} bold>ORTALAMA SÜRE</AppText>
                    <AppText bold>{detail.playtime > 0 ? `${detail.playtime} Saat` : 'Veri yok'}</AppText>
                </View>
                <View style={styles.infoItem}>
                    <AppText variant="caption" color={colors.primary} bold>YAŞ SINIRI (ESRB)</AppText>
                    <AppText bold>{detail.esrb_rating?.name || 'Derecelendirilmemiş'}</AppText>
                </View>
            </View>

            {detail.tags && detail.tags.length > 0 && (
                <>
                    <AppText variant="h2" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>Özellikler & Etiketler</AppText>
                    <View style={styles.tagsContainer}>
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
                <AppText
                    onPress={() => handlePressWebsite(detail.website)}
                    style={styles.websiteLink}
                >
                    Resmi Web Sitesini Ziyaret Et
                </AppText>
            )}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};