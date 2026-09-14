import React, { memo, useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

import { IGame } from '@types';
import { styles } from './styles';
import { cardImageUrl } from '../../utils/card-image';
import { AppText } from '../app-text';
import { useSettings } from '../../context/settings-context';
import { localizeCatalogName } from '../../i18n';

type CardGame = IGame & {
    genres?: {
        id: number;
        name: string;
    }[];
};

interface GameCardProps {
    game: CardGame;
    onPress: (id: number, name: string) => void;

    // Gerçek bir indirme verisi kaynağından sağlanmalı.
    downloadCount?: number | null;
}

const formatReleaseDate = (
    value?: string | null,
): string => {
    if (!value) return 'Açıklanmadı';

    const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(value);

    if (!match) return 'Açıklanmadı';

    const [, year, month, day] = match;

    // Saat dilimi dönüşümü yapmadan tarihi biçimlendirir.
    return `${day}-${month}-${year}`;
};

const formatCount = (value: number): string => {
    // Örnek: 1250000 → 1.250.000
    return Math.trunc(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const GameCard = memo(function GameCard({
    game,
    onPress,
    downloadCount,
}: GameCardProps) {
    const [failedImages, setFailedImages] = useState<string[]>([]);
    const { language, colors } = useSettings();

    const thumbnail = cardImageUrl(game.background_image);
    const imageUri = failedImages.includes(thumbnail)
        ? game.background_image
        : thumbnail;

    const hasImage = Boolean(
        imageUri && !failedImages.includes(imageUri),
    );
    const hasMetacritic =
        typeof game.metacritic === 'number' &&
        game.metacritic > 0;

    const metacriticDisplay = hasMetacritic
        ? game.metacritic.toString()
        : '—';


    const releaseDate = formatReleaseDate(game.released);

    const genreText = game.genres
        ?.slice(0, 2)
        .map(genre => localizeCatalogName(language, genre.name))
        .join(' · ');

    const validDownloadCount =
        typeof downloadCount === 'number' &&
            Number.isFinite(downloadCount) &&
            downloadCount >= 0
            ? downloadCount
            : null;

    const downloadDisplay =
        validDownloadCount !== null
            ? formatCount(validDownloadCount)
            : null;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.85}
            onPress={() => onPress(game.id, game.name)}
            accessibilityRole="button"
            accessibilityLabel={[
                game.name,
                hasMetacritic
                    ? `Puan: ${metacriticDisplay} / 100`
                    : 'Henüz puanlanmadı',
                `Çıkış tarihi: ${releaseDate}`,
                downloadDisplay !== null
                    ? `${downloadDisplay} indirme`
                    : '',
            ]
                .filter(Boolean)
                .join('. ')}
            accessibilityHint="Oyun detaylarını açar"
        >
            <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                {hasImage ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="cover"
                        resizeMethod="resize"
                        onError={() =>
                            setFailedImages(previous => [...previous, imageUri || ''])
                        }
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <AppText style={[styles.placeholderSymbol, { color: colors.secondary }]}>
                            ◇
                        </AppText>

                        <AppText style={[styles.placeholderText, { color: colors.secondary }]}>
                            Görsel bulunmuyor
                        </AppText>
                    </View>
                )}

                <View style={styles.ratingBadge}>
                    <AppText style={[styles.starIcon, { color: colors.primary }]}>★</AppText>

                    <AppText style={[styles.ratingText, { color: colors.white }]}>
                        {metacriticDisplay}
                    </AppText>

                    {hasMetacritic && (
                        <AppText style={[styles.ratingLimit, { color: colors.secondary }]}>
                            / 100
                        </AppText>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <AppText
                    style={[styles.title, { color: colors.text }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {game.name}
                </AppText>

                {!!genreText && (
                    <AppText
                        style={[styles.genre, { color: colors.secondary }]}
                        numberOfLines={1}
                    >
                        {genreText}
                    </AppText>
                )}

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.infoRow}>
                    <AppText style={[styles.infoLabel, { color: colors.secondary }]}>
                        Çıkış
                    </AppText>

                    <AppText style={[styles.dateText, { color: colors.text }]}>
                        {releaseDate}
                    </AppText>
                </View>

                {downloadDisplay !== null && (
                    <View
                        style={[
                            styles.infoRow,
                            styles.downloadRow,
                        ]}
                    >
                    <AppText style={[styles.infoLabel, { color: colors.secondary }]}>
                        İndirme
                    </AppText>

                    <AppText style={[styles.downloadText, { color: colors.primary }]}>
                        {downloadDisplay}
                    </AppText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});
