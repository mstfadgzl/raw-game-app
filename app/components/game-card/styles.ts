import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.md * 2;

export const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.md,
        overflow: 'hidden',
        elevation: 5, // Android gölge
        shadowColor: '#000', // iOS gölge
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: colors.border,
    },
    infoContainer: {
        padding: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    releaseDate: {
        color: colors.secondary,
        fontSize: 12,
    },
});