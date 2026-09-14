import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../app-text';
import { useStyles } from './styles';

interface ErrorStateProps {
    message?: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    const styles = useStyles();
    return (
    <View style={styles.container}>
        <AppText style={styles.icon}>⚠️</AppText>
        <AppText style={styles.title}>Hata Oluştu</AppText>
        <AppText style={styles.message}>{message || 'Veriler yüklenirken bir sorun oluştu.'}</AppText>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
            <AppText style={styles.buttonText}>Yeniden Dene</AppText>
        </TouchableOpacity>
    </View>
);
};
