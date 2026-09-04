import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: { paddingHorizontal: 0 },
    heroImage: { width: '100%', height: 250 },
    content: {
        padding: spacing.md,
        marginTop: -20,
        backgroundColor: colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24
    },
    subTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
    bio: { lineHeight: 20, color: colors.secondary }
});