import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        width: 142,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#191E2B',
        borderWidth: 1,
        borderColor: '#2C3545',
        elevation: 0,
        shadowOpacity: 0,
    },

    imageContainer: {
        width: '100%',
        height: 128,
        backgroundColor: '#252D3A',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },

    placeholderIcon: {
        color: colors.primary,
        fontSize: 28,
        marginBottom: 5,
    },

    placeholderText: {
        color: '#AAB5C8',
        fontSize: 10,
        textAlign: 'center',
    },

    content: {
        paddingHorizontal: 11,
        paddingVertical: 11,
        minHeight: 76,
    },

    name: {
        color: '#F3F6FC',
        fontSize: 13,
        lineHeight: 18,
    },

    gamesContainer: {
        marginTop: 7,
    },

    gameTag: {
        color: '#9CA8BC',
        fontSize: 10,
        lineHeight: 15,
    },

    gamesCount: {
        color: '#9CA8BC',
        fontSize: 10,
        marginTop: 7,
    },
});