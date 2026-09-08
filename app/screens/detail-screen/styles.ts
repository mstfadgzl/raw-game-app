import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        height: 235,
        width: '100%',
        backgroundColor: '#1B2030',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.43)',
    },
    favButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    absoluteInfo: {
        position: 'absolute',
        bottom: 28,
        left: 18,
        right: 18,
    },
    gameTitle: {
        fontSize: 27,
        lineHeight: 33,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    metaBox: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 6,
    },
    tabWrapper: {
        flex: 1,
        marginTop: -14,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colors.background,
        overflow: 'hidden',
    },
    tabContent: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    bar: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        marginHorizontal: 8,
        paddingVertical: 10,
    },
    item: {
        width: 'auto',
        paddingHorizontal: 4,
        paddingVertical: 0,
    },
    pill: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#191E2B',
        borderWidth: 1,
        borderColor: '#2A3040',
    },
    activePill: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    label: {
        color: '#ADB5C9',
        fontSize: 13,
        fontWeight: '600',
    },
    activeLabel: {
        color: '#0B0D14',
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 14,
    },
    muted: {
        color: '#A8B0C2',
        lineHeight: 21,
    },
    feedback: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButton: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        marginTop: 8,
    },
    redditCard: {
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#191E2B',
        borderWidth: 1,
        borderColor: '#2A3040',
        marginBottom: 12,
    },
    postMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});