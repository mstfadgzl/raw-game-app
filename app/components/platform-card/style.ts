import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 100,
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginRight: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        ...StyleSheet.absoluteFill,
        borderRadius: 16,
        opacity: 0.5,
    },
    name: {
        color: colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 1,
    }
});