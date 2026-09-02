import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    title: {
        color: colors.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    releaseDate: {
        color: colors.secondary,
        fontSize: 13,
    },
    ratingBadge: {
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    ratingText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});