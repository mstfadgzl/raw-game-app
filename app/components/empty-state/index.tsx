import React from 'react';
import { View } from 'react-native';
import { AppText } from '../app-text';
import { useStyles } from './styles';

interface EmptyStateProps {
    message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    const styles = useStyles();
    return (
    <View style={styles.container}>
        <AppText style={styles.icon}>🔍</AppText>
        <AppText style={styles.title}>Sonuç Bulunamadı</AppText>
        <AppText style={styles.message}>{message || 'Aradığınız kriterlere uygun oyun bulunamadı.'}</AppText>
    </View>
);
};
