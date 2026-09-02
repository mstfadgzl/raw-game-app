import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface EmptyStateProps {
    message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
    <View style={styles.container}>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.title}>Sonuç Bulunamadı</Text>
        <Text style={styles.message}>{message || 'Aradığınız kriterlere uygun oyun bulunamadı.'}</Text>
    </View>
);