import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
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
        color: '#F5F7FC',
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
        backgroundColor: '#191E29',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#303849',
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
        color: '#F2F5FB',
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
        color: '#B9C3D6',
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
        color: '#DCE3F0',
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
        backgroundColor: '#1B2430',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },

    emptySymbolText: {
        color: colors.primary,
        fontSize: 38,
    },

    emptyTitle: {
        color: '#E8EDF7',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },

    emptyDescription: {
        color: '#99A5BC',
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
        backgroundColor: '#191F2B',
        borderWidth: 1,
        borderColor: '#30394A',
    },

    suggestionText: {
        color: '#C8D2E4',
        fontSize: 12,
        fontWeight: '500',
    },

    feedback: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    feedbackDescription: {
        color: '#99A5BC',
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
        backgroundColor: '#243039',
    },

    retryText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
});