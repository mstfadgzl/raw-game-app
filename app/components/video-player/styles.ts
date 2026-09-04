import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: width - 32,
        height: (width - 32) * 0.5625, // 16:9 Oranı
        backgroundColor: colors.black,
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    placeholderImage: {
        ...StyleSheet.absoluteFill,
        opacity: 0.6,
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(100, 255, 218, 0.8)', // Primary neon rengimiz
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    }
});