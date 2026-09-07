import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing } from '@theme';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 350; // Resmin yüksekliği

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        height: HEADER_HEIGHT,
        width: width,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.4)', // Resmin üzerine hafif siyah perde
    },
    gradientBottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 150,
        // Alttan yukarı doğru siyah geçiş (opsiyonel, LinearGradient kütüphanesi varsa daha iyi olur)
    },
    favButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    absoluteInfo: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    gameTitle: {
        fontSize: 32, // Çok daha büyük ve etkileyici
        fontWeight: '900',
        color: colors.white,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    // Meta Bilgi Kutuları
    metaContainer: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 10,
    },
    metaBox: {
        backgroundColor: 'rgba(255,255,255,0.1)', // Cam efekti
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tabWrapper: {
        flex: 1,
        marginTop: -30, // Tabları resmin üzerine hafifçe bindiriyoruz (Modern görünüm)
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: colors.background,
        overflow: 'hidden',
        paddingTop: 10,
    }
});