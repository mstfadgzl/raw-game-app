import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0, // ListHeader bileşenleri kendi paddinglerini yönetecek
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        marginBottom: spacing.md,
        padding: 16,
        marginTop: 10,
    },
    mainTitle: {
        fontSize: 28,
        marginTop: 4,
    },
    sectionMargin: {
        marginBottom: spacing.lg,
    },
    horizontalListPadding: {
        paddingLeft: spacing.md,
        paddingRight: spacing.xs,
    },
    gameCardWrapper: {
        paddingHorizontal: spacing.md,
    },
    // Skeleton Loader Stilleri
    skeletonContainer: {
        padding: spacing.md,
    },
    skeletonTitle: {
        width: '60%',
        height: 30,
        marginBottom: 20,
    },
    skeletonBanner: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        marginBottom: 30,
    },
    skeletonCard: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    filterScroll: {
        paddingLeft: 16,
        marginBottom: 20,
    },
    genreScroll: {
        paddingLeft: 16,
        marginBottom: 20,
    },
    // styles.ts içerisine eklenecekler
    modernChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20, // Tam yuvarlak köşeler
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeChipFilled: {
        backgroundColor: colors.primary, // Senin o güzel neon yeşilin
        borderWidth: 0, // Kenarlığa veda
    },
    inactiveChipSoft: {
        backgroundColor: '#2A2A2A', // Siyahın üzerinde sırıtmaması için mat koyu gri
        borderWidth: 0,
    },

    // Filtre Başlık ve Sıralama
    filterHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dynamicHeaderTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
    },
    compactSortButton: {
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333333',
    },

    // Yeni Sekme (Tab) Tasarımı
    tabPadding: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    tabButton: {
        marginRight: 24,
        paddingBottom: 8,
        position: 'relative',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
});