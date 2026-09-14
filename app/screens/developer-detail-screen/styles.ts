import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@theme';
import { useMemo } from 'react';
import { useSettings } from '@hooks';

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 0, backgroundColor: colors.background },
    list: { paddingBottom: 24 },
    hero: { height: 270, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
    heroImage: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' },
    shade: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(5,10,18,0.55)' },
    monogram: { fontSize: 110, fontWeight: '800', color: colors.primary },
    back: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, backgroundColor: 'rgba(10,15,23,0.8)' },
    heroText: { position: 'absolute', bottom: 28, left: 20, right: 20 },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    brandCopy: { flex: 1 },
    eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
    title: { color: '#FFFFFF', fontSize: 30, lineHeight: 36, fontWeight: '800' },
    content: { padding: 20 },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, padding: 16, borderRadius: 16, marginBottom: 26 },
    statNumber: { color: colors.primary, fontSize: 25, fontWeight: '800' },
    muted: { color: colors.secondary, fontSize: 12, lineHeight: 19, flexShrink: 1 },
    sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 10 },
    bio: { color: colors.secondary, fontSize: 14, lineHeight: 24 },
    expand: { paddingVertical: 12, alignSelf: 'flex-start', minHeight: 44 },
    gamesHeading: { marginTop: 28, marginBottom: 16 },
    sortRow: { flexDirection: 'row', gap: 10 },
    sortButton: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
    selected: { backgroundColor: 'rgba(100,255,218,0.08)', borderColor: colors.primary },
    row: { paddingHorizontal: 16, justifyContent: 'space-between' },
    column: { width: '48%' },
    footer: { padding: 24, alignItems: 'center' },
    button: { padding: 16, borderRadius: 12, backgroundColor: colors.surface, marginTop: 12 },
    feedback: { padding: 24, flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    bioSkeleton: { height: 180, borderRadius: 16 },
});


export const useStyles = () => {
    const { colors } = useSettings();
    return useMemo(() => createStyles(colors), [colors]);
};
