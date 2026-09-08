import { StyleSheet } from 'react-native';
import { spacing, colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: colors.background,
    },

    listContent: {
        paddingBottom: 24,
    },

    header: {
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 26,
    },

    eyebrow: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.6,
        marginBottom: 10,
    },

    mainTitle: {
        color: '#F2F5FB',
        fontSize: 27,
        lineHeight: 34,
        fontWeight: '800',
    },

    subtitle: {
        color: '#98A5BA',
        fontSize: 13,
        lineHeight: 21,
        marginTop: 8,
    },

    creatorSection: {
        marginBottom: 26,
    },

    sectionHeader: {
        paddingHorizontal: 18,
        marginBottom: 12,
    },

    sectionTitle: {
        color: '#EEF2F8',
        fontSize: 17,
        fontWeight: '700',
    },

    sectionSubtitle: {
        color: '#8996AD',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 5,
    },

    horizontalPadding: {
        paddingHorizontal: 16,
    },

    creatorLoading: {
        height: 145,
        alignItems: 'center',
        justifyContent: 'center',
    },

    creatorFooter: {
        width: 65,
        height: 145,
        alignItems: 'center',
        justifyContent: 'center',
    },

    creatorRetry: {
        width: 90,
        height: 145,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tagHeader: {
        paddingHorizontal: 18,
        paddingBottom: 16,
    },

    tagRow: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },

    tagColumn: {
        width: '48%',
        marginBottom: 12,
    },

    tagCard: {
        minHeight: 112,
        padding: 13,
        borderRadius: 16,
        backgroundColor: '#191E2B',
        borderWidth: 1,
        borderColor: '#2B3342',
        justifyContent: 'space-between',
    },

    tagIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(100,255,218,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    tagIconText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: '800',
    },

    tagTextContainer: {
        marginTop: 14,
        paddingRight: 14,
    },

    tagName: {
        color: '#F1F4FA',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '700',
    },

    tagGameCount: {
        color: '#8F9BB2',
        fontSize: 10,
        marginTop: 5,
    },

    tagArrow: {
        position: 'absolute',
        top: 11,
        right: 12,
        color: '#71809A',
        fontSize: 22,
    },

    tagSkeletonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    tagSkeleton: {
        width: '100%',
        height: 112,
        borderRadius: 16,
    },

    feedback: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 38,
    },

    feedbackTitle: {
        color: '#DDE4F0',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },

    retryButton: {
        alignSelf: 'flex-start',
        marginHorizontal: 18,
        marginTop: 14,
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderRadius: 10,
        backgroundColor: '#243039',
    },

    retryText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },

    loadingContainer: {
        padding: 16,
    },

    fullSkeleton: {
        height: 220,
        borderRadius: 16,
        marginBottom: 16,
    },

    footerLoader: {
        marginVertical: 24,
    },

    footerRetry: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    bottomSpace: {
        height: 80,
    },
});