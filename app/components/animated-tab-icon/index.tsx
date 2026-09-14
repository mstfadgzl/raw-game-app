import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import { useSettings } from '../../context/settings-context';

type Props = {
    name: 'home' | 'discover' | 'search' | 'library' | 'settings';
    focused: boolean;
    color: string;
};

export const AnimatedTabIcon = ({ name, focused, color }: Props) => {
    const { themeMode } = useSettings();
    const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
    const [reduceMotion, setReduceMotion] = useState(true);

    useEffect(() => {
        let active = true;
        void AccessibilityInfo.isReduceMotionEnabled().then(value => {
            if (active) setReduceMotion(value);
        }).catch(() => {});
        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
        return () => { active = false; subscription.remove(); };
    }, []);

    useEffect(() => {
        const animation = Animated.timing(progress, {
            toValue: focused ? 1 : 0,
            duration: reduceMotion ? 0 : 180,
            useNativeDriver: true,
            isInteraction: false,
        });
        animation.start();
        return () => animation.stop();
    }, [focused, progress, reduceMotion]);

    const stroke = { borderColor: color };
    return (
        <View style={styles.frame} accessible={false} importantForAccessibility="no-hide-descendants">
            <Animated.View style={[styles.highlight, { backgroundColor: themeMode === 'light' ? '#D9EFE9' : '#203B37', opacity: progress, transform: [{ scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]} />
            <Animated.View style={[styles.icon, { transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -1] }) }] }]}>
                {name === 'home' && <><View style={[styles.roof, stroke]} /><View style={[styles.house, stroke]} /></>}
                {name === 'discover' && <><View style={[styles.compass, stroke]} /><View style={[styles.needle, { backgroundColor: color }]} /></>}
                {name === 'search' && <><View style={[styles.lens, stroke]} /><View style={[styles.handle, { backgroundColor: color }]} /></>}
                {name === 'library' && <View style={styles.books}>{[0, 1, 2].map(book => <View key={book} style={[styles.book, stroke, book === 2 && styles.tilted]} />)}</View>}
                {name === 'settings' && <><View style={[styles.gear, stroke]} /><View style={[styles.gearCenter, { backgroundColor: color }]} /></>}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    frame: { width: 56, height: 30, alignItems: 'center', justifyContent: 'center' },
    highlight: { ...StyleSheet.absoluteFill, backgroundColor: '#203B37', borderRadius: 15 },
    icon: { width: 24, height: 24 },
    roof: { position: 'absolute', width: 14, height: 14, left: 5, top: 3, borderTopWidth: 2, borderLeftWidth: 2, transform: [{ rotate: '45deg' }], borderRadius: 2 },
    house: { position: 'absolute', width: 16, height: 12, left: 4, top: 10, borderWidth: 2, borderTopWidth: 0, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
    compass: { position: 'absolute', left: 2, top: 2, width: 20, height: 20, borderWidth: 2, borderRadius: 10 },
    needle: { position: 'absolute', left: 10, top: 6, width: 4, height: 12, borderRadius: 2, transform: [{ rotate: '35deg' }] },
    lens: { position: 'absolute', left: 2, top: 2, width: 15, height: 15, borderWidth: 2, borderRadius: 8 },
    handle: { position: 'absolute', left: 17, top: 15, width: 2, height: 8, borderRadius: 1, transform: [{ rotate: '-45deg' }] },
    books: { flexDirection: 'row', gap: 3, paddingTop: 3 },
    book: { width: 5, height: 18, borderWidth: 1.5, borderRadius: 1 },
    tilted: { transform: [{ rotate: '-12deg' }] },
    gear: { position: 'absolute', left: 2, top: 2, width: 20, height: 20, borderWidth: 2, borderRadius: 10 },
    gearCenter: { position: 'absolute', left: 9, top: 9, width: 6, height: 6, borderRadius: 3 },
});
