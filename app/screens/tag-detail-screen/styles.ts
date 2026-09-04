import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    skeletonCard: {
        height: 120,
        borderRadius: 12,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    listContent: {
        paddingBottom: 40,
    },
    loader: {
        marginVertical: spacing.md,
    },
});