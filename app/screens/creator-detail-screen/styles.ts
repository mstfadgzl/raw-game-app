import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: { paddingHorizontal: 0 },
    heroImage: { width: '100%', height: 350 },
    content: {
        padding: spacing.md,
        marginTop: -30,
        backgroundColor: colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    role: { marginBottom: spacing.md, letterSpacing: 1 },
    subTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
    bio: { lineHeight: 22, color: colors.secondary }
});