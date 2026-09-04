import { StyleSheet } from 'react-native';
import { spacing } from '@theme';

export const styles = StyleSheet.create({
    container: { paddingHorizontal: 0 },
    header: { padding: spacing.md, marginBottom: spacing.sm },
    section: { marginBottom: spacing.xl },
    horizontalPadding: { paddingLeft: spacing.md },
    tagsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.md,
        gap: 8
    },
    fullSkeleton: { height: 300, margin: 20, borderRadius: 20 }
});