import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: colors.background,
    },

    listContent: {
        paddingBottom: 32,
    },

    heroContainer: {
        width: '100%',
        height: 240,
        backgroundColor: colors.surface,
        overflow: 'hidden',
    },

    heroImage: {
        width: '100%',
        height: '100%',
    },

    imageFallback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },

    fallbackLetter: {
        color: colors.primary,
        fontSize: 72,
        fontWeight: '700',
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    title: {
        color: colors.text,
        fontSize: 27,
        lineHeight: 34,
        fontWeight: '700',
    },

    role: {
        color: colors.primary,
        fontSize: 12,
        lineHeight: 19,
        marginTop: 8,
    },

    subTitle: {
        color: colors.text,
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 12,
    },

    bio: {
        color: colors.secondary,
        fontSize: 14,
        lineHeight: 23,
    },

    translationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },

    translationText: {
        color: colors.secondary,
        fontSize: 12,
    },

    expandButton: {
        minHeight: 44,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 4,
    },

    gamesTitle: {
        color: colors.text,
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '700',
        marginTop: 24,
        marginBottom: 16,
    },

    row: {
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },

    cardColumn: {
        width: '48%',
    },

    emptyContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    secondaryText: {
        color: colors.secondary,
        fontSize: 13,
        lineHeight: 21,
    },

    feedback: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    retryButton: {
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    errorText: {
        color: '#FF9B9B',
        fontSize: 12,
        lineHeight: 19,
        marginTop: 12,
    },

    heroSkeleton: {
        width: '100%',
        height: 240,
    },

    titleSkeleton: {
        width: '70%',
        height: 30,
        borderRadius: 8,
        marginBottom: 20,
    },

    bioSkeleton: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 24,
    },

    skeletonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    cardSkeleton: {
        width: '48%',
        height: 220,
        borderRadius: 16,
    },
});