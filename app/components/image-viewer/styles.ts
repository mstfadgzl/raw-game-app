import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#050709',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    stage: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loader: {
        position: 'absolute',
        zIndex: 1,
    },
    errorText: {
        position: 'absolute',
        color: '#D7E1E5',
        fontSize: 13,
    },
    topBar: {
        position: 'absolute',
        top: 18,
        left: 18,
        right: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.68)',
    },
    closeText: {
        color: '#FFFFFF',
        fontSize: 19,
    },
    counter: {
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.68)',
    },
    counterText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    hint: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 26,
        alignItems: 'center',
    },
    hintText: {
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 14,
        color: '#D7E1E5',
        fontSize: 11,
        backgroundColor: 'rgba(0,0,0,0.62)',
        textAlign: 'center',
    },
});
