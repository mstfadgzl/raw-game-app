import React, { memo } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { IGame } from '@types';
import { AppText } from '../app-text';
import { styles } from './styles';
import { colors } from '@theme';

interface CompactGameItemProps {
    game: IGame;
    onPress: (id: number | string, name: string) => void;
}

export const CompactGameItem: React.FC<CompactGameItemProps> = memo(({ game, onPress }) => (
    <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(game.id, game.name)}
        activeOpacity={0.9}
    >
        <Image source={{ uri: game.background_image }} style={styles.image} />
        <View style={styles.info}>
            <AppText variant="body" bold numberOfLines={1}>{game.name}</AppText>
            <AppText variant="caption" color={colors.primary}>
                {game.released?.split('-')[0] || 'TBA'} • ★ {game.rating}
            </AppText>
        </View>
    </TouchableOpacity>
));