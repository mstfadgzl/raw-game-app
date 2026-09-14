import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@theme';
import { useMemo } from 'react';
import { useSettings } from '@hooks';
import { spacing } from '@theme';

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
export const useStyles = () => {
    const { colors } = useSettings();
    return useMemo(() => createStyles(colors), [colors]);
};
