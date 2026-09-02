import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface ErrorStateProps {
    message?: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
    <View style={styles.container}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Hata Oluştu</Text>
        <Text style={styles.message}>{message || 'Veriler yüklenirken bir sorun oluştu.'}</Text>
        <TouchableOpacity style={styles.button} onPress={onRetry}>
            <Text style={styles.buttonText}>Yeniden Dene</Text>
        </TouchableOpacity>
    </View>
);