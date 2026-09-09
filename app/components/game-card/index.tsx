import React, { memo, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import { IGame } from '@types';
import { styles } from './styles';
import { cardImageUrl } from '../../utils/card-image';

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
        .map(genre => genre.name)
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
            style={styles.container}
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
            <View style={styles.imageContainer}>
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
                        <Text style={styles.placeholderSymbol}>
                            ◇
                        </Text>

                        <Text style={styles.placeholderText}>
                            Görsel bulunmuyor
                        </Text>
                    </View>
                )}

                <View style={styles.ratingBadge}>
                    <Text style={styles.starIcon}>★</Text>

                    <Text style={styles.ratingText}>
                        {metacriticDisplay}
                    </Text>

                    {hasMetacritic && (
                        <Text style={styles.ratingLimit}>
                            / 100
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <Text
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {game.name}
                </Text>

                {!!genreText && (
                    <Text
                        style={styles.genre}
                        numberOfLines={1}
                    >
                        {genreText}
                    </Text>
                )}

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                        Çıkış
                    </Text>

                    <Text style={styles.dateText}>
                        {releaseDate}
                    </Text>
                </View>

                {downloadDisplay !== null && (
                    <View
                        style={[
                            styles.infoRow,
                            styles.downloadRow,
                        ]}
                    >
                        <Text style={styles.infoLabel}>
                            İndirme
                        </Text>

                        <Text style={styles.downloadText}>
                            {downloadDisplay}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});
