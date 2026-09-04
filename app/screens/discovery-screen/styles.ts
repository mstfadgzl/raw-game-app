import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0, // ListHeader bileşenleri kendi paddinglerini yönetecek
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        marginBottom: spacing.md,
    },
    mainTitle: {
        fontSize: 28,
        marginTop: 4,
    },
    sectionMargin: {
        marginBottom: spacing.lg,
    },
    horizontalListPadding: {
        paddingLeft: spacing.md,
        paddingRight: spacing.xs,
    },
    gameCardWrapper: {
        paddingHorizontal: spacing.md,
    },
    // Skeleton Loader Stilleri
    skeletonContainer: {
        padding: spacing.md,
    },
    skeletonTitle: {
        width: '60%',
        height: 30,
        marginBottom: 20,
    },
    skeletonBanner: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        marginBottom: 30,
    },
    skeletonCard: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    }
});