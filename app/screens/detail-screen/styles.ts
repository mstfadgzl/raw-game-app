import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme';
import { spacing } from '@theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0, // Header resmi tam ekran olsun diye
    },
    headerImage: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: spacing.md,
        marginTop: -20, // Resmin üzerine hafif bindirme
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    metaBox: {
        backgroundColor: colors.surface,
        padding: spacing.sm,
        borderRadius: 12,
        alignItems: 'center',
        width: (width - 48) / 3, // 3'lü kolon yapısı
    },
    metacritic: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
    },
    description: {
        lineHeight: 22,
        marginTop: spacing.md,
        color: colors.secondary,
    },
    sectionTitle: {
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    screenshot: {
        width: 250,
        height: 150,
        borderRadius: 12,
        marginRight: spacing.sm,
        backgroundColor: colors.surface,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '80%',
        justifyContent: 'center',
    },
    fullScreenImage: {
        width: width,
        height: height,
    },
    closeButton: {
        position: 'absolute',
        bottom: -50,
        alignSelf: 'center',
        padding: 15,
    },
});