import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: colors.background,
    },

    content: {
        flexGrow: 1,
        paddingBottom: 24,
    },

    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
    },

    title: {
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

    cardColumn: {
        width: '48%',
    },

    loader: {
        marginVertical: 32,
    },

    footerSpace: {
        height: 24,
    },

    feedback: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 28,
    },

    feedbackText: {
        color: colors.secondary,
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 12,
    },

    retryButton: {
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
});