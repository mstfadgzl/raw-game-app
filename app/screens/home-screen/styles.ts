import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
    flatList: {
        paddingVertical: spacing.md,
    },
    listFooter: {
        marginVertical: spacing.lg,
        alignItems: 'center',
    },
    // Skeleton loader için liste içinde kullanılacak boyutlar
    skeletonCard: {
        height: 240,
        width: '100%',
        borderRadius: 16,
        marginBottom: spacing.md,
    }
});