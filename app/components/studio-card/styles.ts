import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        width: 142,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#191E2B',
        borderWidth: 1,
        borderColor: '#2C3545',
    },
    brandArea: {
        height: 128,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#252D3A',
    },
    content: {
        paddingHorizontal: 11,
        paddingVertical: 11,
        minHeight: 70,
    },
    name: {
        color: '#F3F6FC',
        fontSize: 13,
        lineHeight: 18,
    },
    count: {
        color: colors.secondary,
        fontSize: 10,
        marginTop: 7,
    },
});
