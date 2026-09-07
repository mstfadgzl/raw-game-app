import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0, // FlatList'in tam genişlikte olması için
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: colors.primary, // Neon rengimiz
    },
    listContent: {
        paddingVertical: 16
    },
    loader: {
        marginVertical: spacing.lg,
    }
});