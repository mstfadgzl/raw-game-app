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

    touchSurface: {
        ...StyleSheet.absoluteFill,
        zIndex: 1,
    },

    controls: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        zIndex: 2,
    },

    orientationButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.68)',
    },

    orientationText: {
        color: '#FFFFFF',
        fontSize: 22,
    },

    controlCenter: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    seekButtons: {
        width: 70,
        alignItems: 'center',
    },

    skipButton: {
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.62)',
    },

    skipText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },

    playPauseButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.68)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.65)',
    },

    controlIcon: {
        color: '#FFFFFF',
        fontSize: 22,
        letterSpacing: 1,
    },

    bottomControls: {
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.72)',
    },

    timeText: {
        color: '#FFFFFF',
        fontSize: 11,
        minWidth: 34,
        textAlign: 'center',
    },

    seekTrack: {
        flex: 1,
        height: 24,
        justifyContent: 'center',
        paddingVertical: 9,
    },

    seekProgress: {
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.primary,
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

    inlinePlayer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#080B10',
    },

    inlineTouchSurface: {
        ...StyleSheet.absoluteFill,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    inlineShade: {
        ...StyleSheet.absoluteFill,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
    },

    inlinePlayButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.68)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
    },

    inlineExpandButton: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        zIndex: 4,
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.74)',
    },

    inlineExpandText: {
        color: '#FFFFFF',
        fontSize: 22,
    },

    inlineLoading: {
        ...StyleSheet.absoluteFill,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
    },

    inlineError: {
        ...StyleSheet.absoluteFill,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.58)',
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
        left: 24,
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
