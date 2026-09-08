import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: colors.background,
    },

    listContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },

    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 24,
    },

    mainTitle: {
        color: colors.text,
        fontSize: 25,
        lineHeight: 32,
        fontWeight: '700',
    },

    subtitle: {
        color: colors.secondary,
        fontSize: 13,
        lineHeight: 20,
        marginTop: 6,
    },

    section: {
        marginBottom: 24,
    },

    sectionHeader: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },

    sectionTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },

    horizontalContent: {
        paddingHorizontal: 16,
        gap: 10,
    },

    genreChip: {
        minHeight: 44,
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    genreText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '500',
    },

    separator: {
        height: 1,
        marginHorizontal: 16,
        marginBottom: 18,
        backgroundColor: colors.border,
    },

    filterContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },

    filterChip: {
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    selectedFilterChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    filterText: {
        color: colors.text,
        fontSize: 12,
        fontWeight: '600',
    },

    selectedFilterText: {
        color: '#081014',
        fontWeight: '700',
    },

    gamesHeader: {
        paddingHorizontal: 16,
        paddingBottom: 4,
    },

    gamesTitle: {
        color: colors.text,
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '700',
    },

    row: {
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },

    gameColumn: {
        width: '48%',
    },

    skeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    skeletonColumn: {
        width: '48%',
        marginBottom: 24,
    },

    skeletonImage: {
        width: '100%',
        height: 140,
        borderRadius: 14,
        marginBottom: 12,
    },

    skeletonText: {
        width: '85%',
        height: 16,
        borderRadius: 5,
        marginBottom: 8,
    },

    skeletonSmallText: {
        width: '55%',
        height: 12,
        borderRadius: 5,
    },

    feedback: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 36,
    },

    feedbackTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },

    feedbackText: {
        color: colors.secondary,
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    },

    retryButton: {
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    retryText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },

    footerLoader: {
        marginVertical: 24,
    },

    footerRetry: {
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
    },

    footerSpace: {
        height: 24,
    },
});