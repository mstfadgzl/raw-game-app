import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        width: 130,
        height: 180,
        marginRight: spacing.md,
        borderRadius: 24,
        backgroundColor: colors.surface,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: spacing.sm,
        justifyContent: 'flex-end',
    },
    name: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 2,
    },
    count: {
        color: colors.primary,
        fontWeight: 'bold',
    }
});