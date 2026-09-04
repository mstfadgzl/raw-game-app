import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    mediaContainer: {
        width: '100%',
        height: 250,
        backgroundColor: colors.black,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    basicInfo: {
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    // Tab İçeriği Stilleri (Ortak kullanılabilir)
    tabContent: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    description: {
        lineHeight: 22,
        color: colors.secondary,
        marginBottom: spacing.lg,
        fontSize: 15,
    },
    redditCard: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary, // Reddit kartlarını ayıran neon çizgi
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        gap: 12,
    },
    infoItem: {
        width: '48%', // Yan yana iki kutu
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: spacing.sm,
    },
    websiteLink: {
        marginTop: spacing.xl,
        color: colors.primary,
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    // styles.ts içerisine eklenecek kısım
    favButton: {
        position: 'absolute',
        top: 20, // Telefonun üst barından (Safe Area) ne kadar aşağıda olacağı
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı saydam siyah arka plan (Kalbin daha net görünmesi için)
        width: 45,
        height: 45,
        borderRadius: 25, // Tam yuvarlak yapar
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Butonun videonun/resmin kesinlikle üstünde kalmasını sağlar
    },
});