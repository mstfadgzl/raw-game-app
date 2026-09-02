import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IGame } from '@types';
import { styles } from './styles';

interface GameCardProps {
    game: IGame;
    onPress: (game: IGame) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.container}
            onPress={() => onPress(game)}
        >
            <Image
                source={{ uri: game.background_image }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{game.name}</Text>
                <View style={styles.footer}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>★ {game.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={styles.releaseDate}>{game.released}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};