import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme';
import { spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0, // Container'ın varsayılan padding'ini eziyoruz
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        marginBottom: spacing.lg,
    },
    avatarPlaceholder: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    sectionTitle: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    genreList: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.xl,
        gap: spacing.sm,
    },
    genreItem: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    genreText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    skeletonOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: colors.background,
        padding: spacing.md,
        zIndex: 10,
    },
    skeletonCard: {
        height: 200,
        borderRadius: 16,
        marginBottom: spacing.md,
    },
    loader: {
        marginVertical: spacing.md,
    },
});