import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: 15,
        lineHeight: 20,
    },
    snippet: {
        marginTop: spacing.sm,
        lineHeight: 16,
        color: colors.secondary,
    }
});