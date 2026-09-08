import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },

    previewContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#141925',
        borderRadius: 14,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },

    fill: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },

    previewShade: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    playButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    playIcon: {
        color: '#0B1117',
        fontSize: 25,
        marginLeft: 3,
    },

    previewLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 12,
    },

    fullscreen: {
        flex: 1,
        backgroundColor: '#080B10',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    blurBackground: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },

    backgroundShade: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.38)',
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    loadingText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 10,
    },

    closeButton: {
        position: 'absolute',
        top: 32,
        right: 24,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },

    closeText: {
        color: '#FFFFFF',
        fontSize: 20,
    },

    errorContent: {
        width: '85%',
        maxWidth: 420,
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
    },

    message: {
        color: '#E0E6F0',
        fontSize: 13,
        lineHeight: 21,
        textAlign: 'center',
        paddingHorizontal: 12,
    },

    retryButton: {
        marginTop: 14,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#26303D',
    },
});