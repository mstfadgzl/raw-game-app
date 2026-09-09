import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { size?: number };

export const AppMark = ({ size = 112 }: Props) => {
    const scale = size / 112;
    return (
        <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.28, transform: [{ rotate: '-8deg' }] }]}>
            <View style={[styles.compass, { width: 52 * scale, height: 52 * scale, borderRadius: 26 * scale, borderWidth: 3 * scale }]}>
                <View style={[styles.needle, { width: 7 * scale, height: 28 * scale, borderRadius: 4 * scale, transform: [{ rotate: '42deg' }] }]} />
            </View>
            <View style={[styles.controller, { width: 62 * scale, height: 27 * scale, borderRadius: 15 * scale, bottom: 17 * scale }]}>
                <View style={[styles.dpad, { left: 13 * scale, top: 8 * scale, width: 15 * scale, height: 4 * scale, borderRadius: 2 * scale }]} />
                <View style={[styles.dpad, { left: 18.5 * scale, top: 2.5 * scale, width: 4 * scale, height: 15 * scale, borderRadius: 2 * scale }]} />
                <View style={[styles.dot, { right: 13 * scale, top: 7 * scale, width: 6 * scale, height: 6 * scale, borderRadius: 3 * scale }]} />
                <View style={[styles.dot, { right: 22 * scale, top: 13 * scale, width: 6 * scale, height: 6 * scale, borderRadius: 3 * scale, backgroundColor: '#F6B44C' }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mark: { backgroundColor: '#1F3A37', borderWidth: 1, borderColor: '#4E8E83', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    compass: { alignItems: 'center', justifyContent: 'center', borderColor: '#64FFDA', marginTop: -18 },
    needle: { position: 'absolute', backgroundColor: '#64FFDA' },
    controller: { position: 'absolute', backgroundColor: '#64FFDA', shadowColor: '#64FFDA', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
    dpad: { position: 'absolute', backgroundColor: '#122322' },
    dot: { position: 'absolute', backgroundColor: '#122322' },
});
