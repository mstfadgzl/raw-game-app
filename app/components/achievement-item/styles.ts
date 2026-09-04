import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.sm,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.background,
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'center',
    },
    percentBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 50,
        alignItems: 'center',
    }
});