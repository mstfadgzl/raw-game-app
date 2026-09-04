import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../app-text';
import { styles } from './styles';
import { colors } from '@theme';

interface SectionHeaderProps {
    title: string;
    onPressAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPressAll }) => (
    <View style={styles.container}>
        <AppText variant="h2" bold>{title}</AppText>
        {onPressAll && (
            <TouchableOpacity onPress={onPressAll}>
                <AppText variant="caption" color={colors.primary}>TÜMÜNÜ GÖR</AppText>
            </TouchableOpacity>
        )}
    </View>
);