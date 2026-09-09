import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    // Container genel arka planı ve dış sınırları belirler
    container: {
        flex: 1,
        backgroundColor: colors.background, // Eğer Container bileşenin kendi arka planı varsa bu satırı silebilirsin
    },

    // Başlık için iç boşluklar (Padding)
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
    },

    // Oyun kartlarının ekrana yapışmasını engelleyen çerçeve
    cardWrapper: {
        width: '48%',
        marginBottom: spacing.md,
    },

    // Listenin en altında, Bottom Tab Bar'ın (Alt sekme menüsü) arkasında 
    // oyun kartlarının gizli kalmasını engelleyen boşluk
    listContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 110,
    },

    row: {
        justifyContent: 'space-between',
    },
});
