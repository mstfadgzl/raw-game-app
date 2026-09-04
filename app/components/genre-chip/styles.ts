import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 8,
    },
    selectedContainer: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(100, 255, 218, 0.1)', // Neon rengin şeffaf hali
    },
    text: {
        color: colors.secondary,
    },
    selectedText: {
        color: colors.primary,
    }
});