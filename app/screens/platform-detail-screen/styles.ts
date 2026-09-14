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

    listContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },

    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
    },

    header: {
        color: colors.text,
        fontSize: 26,
        lineHeight: 32,
        fontWeight: '700',
        marginBottom: 4,
    },

    row: {
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },

    cardWrapper: {
        width: '48%',
    },

    skeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    skeletonCard: {
        width: '48%',
        height: 230,
        borderRadius: 16,
        marginBottom: 16,
    },

    emptyContainer: {
        paddingHorizontal: 16,
        paddingVertical: 32,
    },

    loader: {
        paddingVertical: 24,
    },

    footerSpace: {
        height: 24,
    },

    footerError: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },

    footerErrorText: {
        color: colors.secondary,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 8,
    },

    retryButton: {
        minHeight: 44,
        justifyContent: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
});
export const useStyles = () => {
    const { colors } = useSettings();
    return useMemo(() => createStyles(colors), [colors]);
};
