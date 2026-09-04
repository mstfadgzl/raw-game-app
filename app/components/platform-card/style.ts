import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 100,
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.4)', // Resmin üzerine hafif siyah perde
        padding: 12,
        justifyContent: 'flex-end',
    },
    name: {
        color: colors.white,
        fontSize: 14,
    },
    count: {
        color: colors.primary, // Neon renk
        fontSize: 10,
        marginTop: 2,
    }
});