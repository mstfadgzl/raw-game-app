import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: width * 0.7, // Yatay kaydırma için ideal genişlik
        backgroundColor: colors.surface,
        borderRadius: 20,
        marginRight: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: colors.border,
    },
    content: {
        padding: spacing.md,
    },
    gamesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.xs,
        gap: 6,
    },
    gameTag: {
        color: colors.secondary,
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        fontSize: 10,
        overflow: 'hidden',
    }
});