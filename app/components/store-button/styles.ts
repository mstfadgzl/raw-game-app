import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    storeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // İleride ikon eklemek istersen:
    icon: {
        width: 24,
        height: 24,
        marginRight: spacing.sm,
        tintColor: colors.white,
    }
});