import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

// --- GRID HESAPLAMASI (Taşmayı Önleyen Formül) ---
// 1. Ekranın sağ ve solundaki toplam boşluk: 16 + 16 = 32
const TOTAL_HORIZONTAL_PADDING = 32;
// 2. İki kartın arasındaki dikey boşluk (Gap): 12
const COLUMN_GAP = 12;
// 3. Net Kart Genişliği: (Ekran Genişliği - Kenar Boşlukları - Orta Boşluk) / 2
const CARD_WIDTH = (width - TOTAL_HORIZONTAL_PADDING - COLUMN_GAP) / 2;

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
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 18,
        height: 36, // Kartların boyunun eşit kalması için 2 satırlık sabit yükseklik
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