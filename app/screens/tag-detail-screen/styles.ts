import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0D14',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
    },
    hero: {
        overflow: 'hidden',
        backgroundColor: '#171B2C',
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: '#2B3047',
        marginBottom: 28,
    },
    decorativeCircle: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        right: -65,
        top: -60,
        backgroundColor: '#242B46',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#242A40',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 22,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginRight: 8,
    },
    badgeText: {
        color: '#D7DCF0',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
        marginBottom: 20,
    },
    hash: {
        color: colors.primary,
    },
    subtitle: {
        color: '#A8B0C9',
        fontSize: 14,
        lineHeight: 22,
    },
    heroBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 26,
    },
    accentLine: {
        width: 24,
        height: 3,
        borderRadius: 2,
        backgroundColor: colors.primary,
        marginRight: 10,
    },
    heroCaption: {
        color: '#A8B0C9',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
        flexShrink: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 18,
    },
    sectionTitle: {
        color: '#F4F5FA',
        fontSize: 20,
        fontWeight: '700',
        marginRight: 8,
        marginBottom: 6,
    },
    countBadge: {
        backgroundColor: '#1B2030',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 6,
    },
    countText: {
        color: '#B8C0D9',
        fontSize: 11,
    },
    row: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardColumn: {
        width: '48%',
        marginBottom: 10,
    },
    cardShell: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: '#171B29',
        borderWidth: 1,
        borderColor: '#282E42',
    },
    cardBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingTop: 9,
    },
    cardIndex: {
        color: '#78829F',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
    cardLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#252A3B',
        marginLeft: 10,
    },
    loader: {
        marginVertical: 32,
    },
    footerSpace: {
        height: 24,
    },
});