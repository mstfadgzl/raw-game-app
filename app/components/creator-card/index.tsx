import React, { memo, useState } from 'react';
import {
    Image,
    TouchableOpacity,
    View,
} from 'react-native';

import { ICreator } from '@types';
import { AppText } from '../app-text';
import { styles } from './styles';

type CreatorGame = {
    id: number;
    name: string;
    slug?: string;
};

type CreatorCardData = ICreator & {
    games?: CreatorGame[];
    image_background?: string | null;
    games_count?: number;
};

interface CreatorCardProps {
    creator: CreatorCardData;
    onPress: () => void;
}

export const CreatorCard = memo(
    ({ creator, onPress }: CreatorCardProps) => {
        const [imageError, setImageError] = useState(false);

        const imageUri =
            creator.image ||
            creator.image_background ||
            '';

        const creatorGames = Array.isArray(creator.games)
            ? creator.games
            : [];

        const gamesCount =
            typeof creator.games_count === 'number'
                ? creator.games_count
                : creatorGames.length;

        return (
            <TouchableOpacity
                style={styles.container}
                onPress={onPress}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${creator.name} detaylarını aç`}
            >
                <View style={styles.imageContainer}>
                    {imageUri && !imageError ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <AppText style={styles.placeholderIcon}>
                                ◇
                            </AppText>

                            <AppText style={styles.placeholderText}>
                                Görsel bulunmuyor
                            </AppText>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <AppText
                        style={styles.name}
                        numberOfLines={1}
                        bold
                    >
                        {creator.name}
                    </AppText>

                    {creatorGames.length > 0 ? (
                        <View style={styles.gamesContainer}>
                            {creatorGames.slice(0, 2).map(game => (
                                <AppText
                                    key={game.id}
                                    style={styles.gameTag}
                                    numberOfLines={1}
                                >
                                    • {game.name}
                                </AppText>
                            ))}
                        </View>
                    ) : (
                        <AppText style={styles.gamesCount}>
                            {gamesCount > 0
                                ? `${gamesCount} oyun`
                                : 'Oyun bilgisi yok'}
                        </AppText>
                    )}
                </View>
            </TouchableOpacity>
        );
    },
);

CreatorCard.displayName = 'CreatorCard';