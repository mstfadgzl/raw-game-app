import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#151515',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        elevation: 0,
        shadowOpacity: 0,
    },

    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1.4,
        backgroundColor: '#222222',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },

    placeholderSymbol: {
        fontSize: 30,
        color: '#888888',
        marginBottom: 4,
    },

    placeholderText: {
        fontSize: 11,
        color: '#AAAAAA',
        textAlign: 'center',
    },

    ratingBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: '90%',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },

    starIcon: {
        color: colors.primary,
        fontSize: 12,
        marginRight: 4,
    },

    ratingText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },

    ratingLimit: {
        color: '#BBBBBB',
        fontSize: 10,
        marginLeft: 3,
    },

    content: {
        padding: 12,
    },

    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,
        minHeight: 40,
    },

    genre: {
        color: '#AAAAAA',
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
    },

    divider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 10,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    infoLabel: {
        color: '#999999',
        fontSize: 10,
        lineHeight: 17,
        marginRight: 6,
    },

    dateText: {
        color: '#DDDDDD',
        fontSize: 11,
        lineHeight: 17,
        fontWeight: '500',
        fontVariant: ['tabular-nums'],
    },

    downloadRow: {
        marginTop: 5,
    },

    downloadText: {
        color: colors.primary,
        fontSize: 11,
        lineHeight: 17,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
});