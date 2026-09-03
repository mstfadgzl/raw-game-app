import { StyleSheet } from 'react-native';
import { colors } from '@theme';
import { spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: spacing.md,
        height: 55,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        color: colors.text,
        fontSize: 16,
        marginLeft: spacing.sm,
    },
    sectionTitle: {
        marginBottom: spacing.md,
        color: colors.primary,
    },
    loader: {
        marginTop: spacing.xl,
    }
});