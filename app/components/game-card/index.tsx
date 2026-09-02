import React, { memo } from 'react'; // memo eklendi
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IGame } from '@types';
import { styles } from './styles';

interface GameCardProps {
    game: IGame;
    onPress: (id: number, name: string) => void;
}

// React.memo ile sarmaladık
export const GameCard: React.FC<GameCardProps> = memo(({ game, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.container}
            onPress={() => onPress(game.id, game.name)}
        >
            <Image
                source={{ uri: game.background_image }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{game.name}</Text>
                    <Text style={styles.releaseDate}>{game.released}</Text>
                </View>
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{game.rating.toFixed(1)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}); // memo bitti