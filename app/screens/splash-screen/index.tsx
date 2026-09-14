import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StatusBar, StyleSheet } from 'react-native';
import { AppText } from '../../components/app-text';
import { AppMark } from '../../components/app-mark';

type Props = { onFinish: () => void };

export const SplashScreen = ({ onFinish }: Props) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.82)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const [reduceMotion, setReduceMotion] = useState(true);
    const finished = useRef(false);

    const finish = useCallback(() => {
        if (finished.current) return;
        finished.current = true;
        onFinish();
    }, [onFinish]);

    useEffect(() => {
        let active = true;
        void AccessibilityInfo.isReduceMotionEnabled().then(value => {
            if (active) setReduceMotion(value);
        }).catch(() => {});
        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
        return () => { active = false; subscription.remove(); };
    }, []);

    useEffect(() => {
        const duration = reduceMotion ? 0 : 480;
        const entrance = Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true, isInteraction: false }),
            Animated.spring(scale, { toValue: 1, speed: reduceMotion ? 100 : 14, bounciness: reduceMotion ? 0 : 8, useNativeDriver: true, isInteraction: false }),
            Animated.timing(contentOpacity, { toValue: 1, duration: reduceMotion ? 0 : 360, delay: reduceMotion ? 0 : 180, useNativeDriver: true, isInteraction: false }),
        ]);
        entrance.start();
        const timer = setTimeout(() => {
            Animated.timing(opacity, { toValue: 0, duration: reduceMotion ? 0 : 240, useNativeDriver: true, isInteraction: false }).start(finish);
        }, reduceMotion ? 240 : 1250);
        return () => { clearTimeout(timer); entrance.stop(); };
    }, [contentOpacity, finish, opacity, reduceMotion, scale]);

    return (
        <Animated.View style={[styles.root, { opacity }]}>
            <StatusBar barStyle="light-content" />
            <Pressable style={styles.touchArea} accessibilityRole="button" accessibilityLabel="Açılışı geç" onPress={finish}>
                <Animated.View style={[styles.brand, { transform: [{ scale }] }]}>
                    <AppMark />
                    <Animated.View style={[styles.copy, { opacity: contentOpacity }]}>
                        <AppText style={styles.title}>GameCodex</AppText>
                        <AppText style={styles.subtitle}>Keşfet · Kaydet · Oyna</AppText>
                    </Animated.View>
                </Animated.View>
                <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
                    <AppText style={styles.footerText}>RAWG ile güçlendirildi</AppText>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    root: { ...StyleSheet.absoluteFill, zIndex: 100, backgroundColor: '#0D1213' },
    touchArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    brand: { alignItems: 'center' },
    copy: { alignItems: 'center', marginTop: 24 },
    title: { fontSize: 17, letterSpacing: 2.4, fontWeight: '800', color: '#FFFFFF' },
    subtitle: { marginTop: 10, fontSize: 13, letterSpacing: 0.8, color: '#8EA49F' },
    footer: { position: 'absolute', bottom: 36 },
    footerText: { fontSize: 11, letterSpacing: 0.5, color: '#5F746F' },
});
