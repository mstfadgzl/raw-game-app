import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    languageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
    themeSymbol: { fontSize: 23, lineHeight: 28 },
    languagePicker: { flexDirection: 'row', borderWidth: 1, borderRadius: 24, padding: 3 },
    languageOption: { minWidth: 44, minHeight: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    languageLabel: { fontSize: 11 },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    keyboard: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },

    card: {
        width: '100%',
        padding: 22,
        borderRadius: 24,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: '#303A3E',
    },

    brand: {
        alignItems: 'center',
        marginBottom: 22,
    },

    eyebrow: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 9,
    },

    title: {
        color: colors.text,
        fontSize: 25,
        lineHeight: 32,
        fontWeight: '800',
    },

    description: {
        color: colors.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 12,
        marginBottom: 24,
    },

    inputLabel: {
        color: '#AAB5C4',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.4,
        marginBottom: 8,
    },

    inputWrapper: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#3B474C',
        backgroundColor: '#151A1C',
    },

    input: {
        flex: 1,
        minHeight: 54,
        paddingHorizontal: 15,
        color: colors.text,
        fontSize: 14,
    },

    showButton: {
        minHeight: 54,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    error: {
        color: colors.error,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 10,
    },

    primaryButton: {
        minHeight: 54,
        marginTop: 18,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },

    disabledButton: {
        opacity: 0.45,
    },

    primaryText: {
        fontSize: 14,
    },

    helpBox: {
        marginTop: 22,
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#192326',
        borderWidth: 1,
        borderColor: '#2E4C4B',
    },

    helpTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
    },

    helpText: {
        color: colors.secondary,
        fontSize: 12,
        lineHeight: 19,
        marginTop: 6,
    },

    linkButton: {
        alignSelf: 'flex-start',
        paddingVertical: 12,
    },

    privacy: {
        color: '#71808A',
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
        marginTop: 18,
    },
});
