import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'; // 4. Adım optimizasyonu burada!
import { IGame } from '@types';
import { styles } from './styles';

interface GameCardProps {
    game: IGame;
    onPress: (id: number, name: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress }) => (
    <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(game.id, game.name)}
        activeOpacity={0.9}
    >
        <FastImage
            style={styles.image}
            source={{ uri: game.background_image, priority: FastImage.priority.normal }}
            resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>{game.name}</Text>
            <View style={styles.badge}>
                <Text style={styles.rating}>★ {game.rating}</Text>
            </View>
        </View>
    </TouchableOpacity>
);