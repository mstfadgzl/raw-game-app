import { StyleSheet } from 'react-native';
import { colors } from '@theme';
import { spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    icon: { fontSize: 50, marginBottom: spacing.md },
    title: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    message: {
        color: colors.secondary,
        textAlign: 'center',
    },
});