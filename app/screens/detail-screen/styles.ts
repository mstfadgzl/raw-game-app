import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, spacing } from '@theme';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 260; // Resmin yüksekliği

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
    },
    tabContent: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    bar: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        marginHorizontal: 12,
        marginTop: 12,
        marginBottom: 8,
    },
    item: {
        width: 'auto',
        paddingHorizontal: 4,
        paddingVertical: 0,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#191E2B',
        borderWidth: 1,
        borderColor: '#2A3040',
    },
    activePill: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    label: {
        color: '#ADB5C9',
        fontSize: 13,
        fontWeight: '600',
    },
    activeLabel: {
        color: '#0B0D14',
        fontWeight: '700',
    },
    tabStyles: {
        bar: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            paddingHorizontal: 8,
            height: 60,
        },
        item: {
            width: 'auto',
            paddingHorizontal: 4,
        },
        pill: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: '#1E1E1E', // Pasif sekme arka planı (Koyu gri)
            borderWidth: 1,
            borderColor: '#2A2A2A',
            justifyContent: 'center',
            alignItems: 'center',
        },
        activePill: {
            backgroundColor: colors.primary, // Aktif sekme arka planı (Tema rengin)
            borderColor: colors.primary,
        },
        label: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.secondary, // Pasif yazı rengi
        },
        activeLabel: {
            color: colors.background, // Aktif yazı rengi (Genellikle koyu/siyah veya beyaz)
            fontWeight: 'bold',
        },
    },
});