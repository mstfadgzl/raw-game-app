import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

const SCREEN_PADDING = 16; // FlatList'in kenar boşluğu
const GAP = 12;            // İki kart arasındaki boşluk

// Toplam boşluğu çıkarıp ikiye bölüyoruz ve 1 piksel emniyet payı bırakıyoruz
const CARD_WIDTH = Math.floor((width - (SCREEN_PADDING * 2) - GAP) / 2) - 1;

export const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        // Hafif bir derinlik hissi için gölge (opsiyonel)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 125, // Kart küçüldüğü için yüksekliği optimize ettik
        backgroundColor: colors.border,
    },
    content: {
        padding: 10,
        justifyContent: 'space-between',
        flex: 1,
    },
    textContainer: {
        marginBottom: 8,
    },
    title: {
        color: colors.text,
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 18,
        height: 38, // Kartların boyunun eşit kalması için 2 satırlık sabit yükseklik
    },
    releaseDate: {
        color: colors.secondary,
        fontSize: 11,
        marginTop: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingBadge: {
        backgroundColor: 'rgba(100, 255, 218, 0.1)', // Neon rengin %10 opak hali
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    ratingText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    playtime: {
        color: colors.secondary,
        fontSize: 10,
    }
});