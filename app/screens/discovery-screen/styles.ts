import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    // Temel Yerleşim
    container: {
        paddingHorizontal: 0,
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
        color: colors.white,
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

    // Skeleton Yükleme Ekranı
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

    // Modern Buton (Chip) Tasarımları
    modernChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeChipFilled: {
        backgroundColor: colors.primary,
        borderWidth: 0,
    },
    inactiveChipSoft: {
        backgroundColor: '#2A2A2A',
        borderWidth: 0,
    },

    // Filtre Başlık ve Kompakt Sıralama Butonu
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

    // Altı Çizgili Modern Sekme (Tab) Tasarımı
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

    // Alttan Açılan Sıralama Modalı (Bottom Sheet)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2A2A',
    },
    row: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    cardColumn: {
        width: '48%',
        marginBottom: 12,
    },
});