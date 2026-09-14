import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@theme';
import { useMemo } from 'react';
import { useSettings } from '@hooks';

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    skeleton: {
        backgroundColor: colors.surface, // Koyu tema gri tonu
        borderRadius: 8,
    },
});
export const useStyles = () => {
    const { colors } = useSettings();
    return useMemo(() => createStyles(colors), [colors]);
};
