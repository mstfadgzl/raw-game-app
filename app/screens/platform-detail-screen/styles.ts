import { StyleSheet } from 'react-native';
import { spacing, colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
    },
    headerContainer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    header: {
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listContent: {
        paddingHorizontal: spacing.md,
    },
    loader: {
        marginVertical: spacing.lg,
    },
    skeletonCard: {
        height: 200,
        borderRadius: 16,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
    }
});