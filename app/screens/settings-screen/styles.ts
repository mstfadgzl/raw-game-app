import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 24,
        paddingBottom: 36,
        gap: 16,
    },
    header: {
        paddingHorizontal: 2,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
    },
    card: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
        marginBottom: 14,
    },
    settingRow: {
        gap: 14,
    },
    copy: {
        flex: 1,
    },
    accountCopy: {
        marginBottom: 14,
    },
    description: {
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
    },
    choices: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        borderRadius: 12,
        padding: 3,
        gap: 4,
    },
    choice: {
        flex: 1,
        minHeight: 40,
        borderWidth: 1,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    choiceText: {
        fontSize: 12,
    },
    separator: {
        height: 1,
        marginVertical: 18,
    },
    logoutButton: {
        minHeight: 46,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        alignItems: 'center',
        paddingTop: 8,
    },
    version: {
        fontSize: 11,
        marginTop: 5,
    },
});
