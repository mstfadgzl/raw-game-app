import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@theme';
import { useMemo } from 'react';
import { useSettings } from '@hooks';

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: colors.background,
    },

    header: {
        paddingHorizontal: 18,
        paddingTop: 20,
        paddingBottom: 18,
    },

    eyebrow: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.8,
        marginBottom: 8,
    },

    title: {
        color: colors.text,
        fontSize: 28,
        lineHeight: 35,
        fontWeight: '800',
        letterSpacing: -0.7,
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        marginHorizontal: 16,
        marginBottom: 18,
        paddingLeft: 14,
        paddingRight: 4,
        backgroundColor: colors.surface,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
    },

    searchBarFocused: {
        borderColor: colors.primary,
    },

    searchIcon: {
        color: colors.primary,
        fontSize: 28,
        marginRight: 10,
    },

    searchInput: {
        flex: 1,
        color: colors.text,
        fontSize: 15,
        paddingVertical: 14,
        paddingHorizontal: 0,
    },

    clearButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    clearText: {
        color: colors.secondary,
        fontSize: 17,
    },

    list: {
        flex: 1,
    },

    listContent: {
        flexGrow: 1,
        paddingBottom: 32,
    },

    sectionTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 18,
        marginBottom: 16,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },

    gameColumn: {
        width: '48%',
        marginBottom: 14,
    },

    emptySection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 24,
    },

    emptySymbol: {
        width: 66,
        height: 66,
        borderRadius: 22,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    emptySymbolText: {
        color: colors.primary,
        fontSize: 38,
    },

    emptyTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },

    emptyDescription: {
        color: colors.secondary,
        fontSize: 13,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 10,
        maxWidth: 300,
    },

    suggestions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 24,
    },

    suggestionChip: {
        paddingHorizontal: 14,
        paddingVertical: 11,
        marginHorizontal: 4,
        marginBottom: 10,
        borderRadius: 11,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    suggestionText: {
        color: colors.secondary,
        fontSize: 12,
        fontWeight: '500',
    },

    feedback: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    feedbackDescription: {
        color: colors.secondary,
        fontSize: 13,
        lineHeight: 22,
        textAlign: 'center',
        marginTop: 14,
    },

    retryButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 11,
        backgroundColor: colors.surface,
    },

    retryText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
});
export const useStyles = () => {
    const { colors } = useSettings();
    return useMemo(() => createStyles(colors), [colors]);
};
