import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { AppText } from '../app-text';
import { styles } from './styles';

interface GenreChipProps {
    name: string;
    isSelected?: boolean;
    onPress: () => void;
}

export const GenreChip: React.FC<GenreChipProps> = memo(({ name, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.container, isSelected && styles.selectedContainer]}
        onPress={onPress}
    >
        <AppText
            variant="caption"
            bold
            style={isSelected ? [styles.text, styles.selectedText] : styles.text}
        >
            {name.toUpperCase()}
        </AppText>
    </TouchableOpacity>
));