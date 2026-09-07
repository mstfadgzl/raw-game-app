import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

// MATEMATİKSEL ÇÖZÜM:
// Ekran genişliğinden her iki yandaki FlatList padding'ini (16 * 2) çıkarıyoruz.
// Ayrıca iki kart arasındaki boşluğu da (12) çıkarıyoruz.
// Kalanı 2'ye bölüyoruz.
const HORIZONTAL_PADDING = 16;
const GAP = 12;
const CARD_WIDTH = (width - (HORIZONTAL_PADDING * 2) - GAP) / 2;

export const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH, // Artık tam sığacak
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: colors.border,
    },
    content: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textContainer: {
        width: '100%',
        marginBottom: 6,
    },
    title: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        height: 38, // 2 satırda kalmasını sağlar
    },
    ratingBadge: {
        backgroundColor: 'rgba(100, 255, 218, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary,
        marginTop: 4,
    },
    ratingText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
});