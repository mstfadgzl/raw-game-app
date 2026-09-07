import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

// 2 sütunlu yapı için matematik: (Ekran Genişliği - Kenar Boşlukları - Orta Boşluk) / 2
const CARD_WIDTH = (width - (spacing.md * 2) - spacing.md) / 2;

export const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: '100%',
        height: 120, // Yüksekliği azalttık (Önceden 200 idi)
        backgroundColor: colors.border,
    },
    content: {
        padding: spacing.sm, // Padding'i daralttık
        flexDirection: 'column', // Yan yana değil, alt alta dizilim (Daha az yer kaplar)
        alignItems: 'flex-start',
    },
    textContainer: {
        width: '100%',
        marginBottom: 6,
    },
    title: {
        color: colors.text,
        fontSize: 14, // Yazıyı küçülttük (Önceden 18 idi)
        fontWeight: 'bold',
        height: 38, // Max 2 satır için sabit yükseklik (Kartların boyu eşit kalır)
    },
    releaseDate: {
        color: colors.secondary,
        fontSize: 11,
    },
    ratingBadge: {
        backgroundColor: 'rgba(100, 255, 218, 0.1)', // Neon rengin şeffaf hali
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary,
        alignSelf: 'flex-start',
    },
    ratingText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
});