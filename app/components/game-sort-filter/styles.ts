import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },

    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    sortButton: {
        flex: 1,
        minWidth: 0,
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    sortButtonText: {
        flexShrink: 1,
        color: colors.text,
        fontSize: 13,
        fontWeight: '600',
    },

    chevron: {
        color: colors.secondary,
        fontSize: 20,
    },

    filterButton: {
        minHeight: 46,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    filterButtonActive: {
        borderColor: colors.primary,
    },

    filterButtonText: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '600',
    },

    badge: {
        minWidth: 20,
        minHeight: 20,
        paddingHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },

    badgeText: {
        color: '#081014',
        fontSize: 11,
        fontWeight: '800',
    },

    pressed: {
        opacity: 0.75,
    },

    disabled: {
        opacity: 0.45,
    },

    modalRoot: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 32,
    },

    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
    },

    panel: {
        width: '100%',
        maxWidth: 520,
        maxHeight: '100%',
        flexShrink: 1,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 22,
        overflow: 'hidden',
    },

    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 8,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    panelTitle: {
        flex: 1,
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
    },

    closeButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeText: {
        color: colors.secondary,
        fontSize: 28,
    },

    panelScroll: {
        flexShrink: 1,
    },

    panelContent: {
        padding: 20,
    },

    sectionTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
    },

    choices: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 22,
    },

    choice: {
        minHeight: 44,
        justifyContent: 'center',
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    choiceSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    choiceText: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '500',
    },

    choiceTextSelected: {
        color: '#081014',
        fontWeight: '700',
    },

    yearRow: {
        flexDirection: 'row',
        gap: 12,
    },

    yearField: {
        flex: 1,
    },

    inputLabel: {
        color: colors.secondary,
        fontSize: 12,
        marginBottom: 8,
    },

    input: {
        minHeight: 48,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize: 15,
    },

    hint: {
        color: colors.secondary,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 10,
        marginBottom: 22,
    },

    error: {
        color: '#FF9B9B',
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 12,
    },

    resetButton: {
        minHeight: 44,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },

    resetText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },

    footer: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    cancelButton: {
        flex: 1,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 12,
    },

    cancelText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600',
    },

    applyButton: {
        flex: 1,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.primary,
        paddingVertical: 12,
    },

    applyText: {
        color: '#081014',
        fontSize: 14,
        fontWeight: '800',
    },
});