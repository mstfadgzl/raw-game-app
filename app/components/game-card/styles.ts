import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

const SCREEN_PADDING = 16;
const GAP = 12;
const CARD_WIDTH = Math.floor((width - (SCREEN_PADDING * 2) - GAP) / 2) - 1;

export const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: '#151515', // Premium mat siyah/gri zemin
        borderRadius: 16,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2A2A2A', // Kenarları belli eden incecik zarif bir çizgi
    },
    // Görseli saran kapsayıcı
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 140, // Oyun sanat tasarımlarını biraz daha büyüttük
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#222', // Görsel yüklenene kadar duracak renk
    },
    // 🔥 Puanlamanın sihirli olduğu yer
    floatingRating: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Arkasını hafif gösteren sinematik karanlık
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12, // Tam bir hap (pill) tasarımı
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Cama benzer yansıma efekti
    },
    starIcon: {
        color: colors.primary, // Senin markanın neon rengi buraya çok yakışacak
        fontSize: 12,
        marginRight: 4,
    },
    ratingText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    // Alt içerik alanı
    content: {
        padding: 12,
        justifyContent: 'space-between',
        flex: 1,
        minHeight: 76, // 2 satır başlık için sabit alan (Kartların eşit olmasını zorunlu kılar)
    },
    title: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
        lineHeight: 18,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    releaseDate: {
        color: '#888888', // Göz yormayan ikincil gri renk
        fontSize: 11,
        fontWeight: '500',
    }
});