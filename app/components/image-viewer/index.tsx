import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    PanResponder,
    Pressable,
    StatusBar,
    View,
    useWindowDimensions,
} from 'react-native';

import { AppText } from '../app-text';
import { colors } from '@theme';
import { styles } from './styles';

type Props = {
    images: string[];
    initialIndex: number;
    onClose: () => void;
};

type TouchPoint = {
    pageX: number;
    pageY: number;
};

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

const distanceBetween = (touches: readonly TouchPoint[]) => {
    if (touches.length < 2) return 0;

    const first = touches[0];
    const second = touches[1];
    return Math.hypot(
        second.pageX - first.pageX,
        second.pageY - first.pageY,
    );
};

export const ImageViewer = ({ images, initialIndex, onClose }: Props) => {
    const { width, height } = useWindowDimensions();
    const [index, setIndex] = useState(
        clamp(initialIndex, 0, Math.max(0, images.length - 1)),
    );
    const [loaded, setLoaded] = useState(false);

    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const scaleValue = useRef(1);
    const translateValue = useRef({ x: 0, y: 0 });
    const gestureStart = useRef({
        scale: 1,
        x: 0,
        y: 0,
        distance: 0,
    });
    const lastTap = useRef(0);
    const indexRef = useRef(index);

    const resetTransform = () => {
        scaleValue.current = 1;
        translateValue.current = { x: 0, y: 0 };
        scale.setValue(1);
        translateX.setValue(0);
        translateY.setValue(0);
    };

    const goTo = (nextIndex: number) => {
        if (nextIndex < 0 || nextIndex >= images.length) {
            Animated.parallel([
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
            ]).start();
            return;
        }

        indexRef.current = nextIndex;
        setIndex(nextIndex);
        setLoaded(false);
        resetTransform();
    };

    const settleZoom = () => {
        const currentScale = scaleValue.current;
        const maxX = Math.max(0, (width * (currentScale - 1)) / 2);
        const maxY = Math.max(0, (height * (currentScale - 1)) / 2);
        const nextX = clamp(translateValue.current.x, -maxX, maxX);
        const nextY = clamp(translateValue.current.y, -maxY, maxY);

        translateValue.current = { x: nextX, y: nextY };

        Animated.parallel([
            Animated.spring(translateX, {
                toValue: nextX,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: nextY,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const toggleZoom = () => {
        const nextScale = scaleValue.current > 1.05 ? 1 : 2.25;
        scaleValue.current = nextScale;

        if (nextScale === 1) {
            translateValue.current = { x: 0, y: 0 };
        }

        Animated.parallel([
            Animated.spring(scale, {
                toValue: nextScale,
                useNativeDriver: true,
            }),
            Animated.spring(translateX, {
                toValue: nextScale === 1 ? 0 : translateValue.current.x,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: nextScale === 1 ? 0 : translateValue.current.y,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const responder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gesture) =>
                gesture.numberActiveTouches > 1 ||
                Math.abs(gesture.dx) > 4 ||
                Math.abs(gesture.dy) > 4,
            onPanResponderGrant: event => {
                const touches = event.nativeEvent.touches as readonly TouchPoint[];
                gestureStart.current = {
                    scale: scaleValue.current,
                    x: translateValue.current.x,
                    y: translateValue.current.y,
                    distance: distanceBetween(touches),
                };
            },
            onPanResponderMove: (event, gesture) => {
                const touches = event.nativeEvent.touches as readonly TouchPoint[];

                if (touches.length >= 2) {
                    const distance = distanceBetween(touches);
                    const startDistance = gestureStart.current.distance;

                    if (distance > 0 && startDistance > 0) {
                        const nextScale = clamp(
                            gestureStart.current.scale *
                            (distance / startDistance),
                            1,
                            4,
                        );
                        scaleValue.current = nextScale;
                        scale.setValue(nextScale);
                    }

                    return;
                }

                const nextX = gestureStart.current.x + gesture.dx;
                const nextY = gestureStart.current.y + gesture.dy;
                translateValue.current = { x: nextX, y: nextY };

                if (scaleValue.current > 1.05) {
                    translateX.setValue(nextX);
                    translateY.setValue(nextY);
                } else {
                    translateX.setValue(gesture.dx * 0.35);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                const now = Date.now();
                const isTap =
                    Math.abs(gesture.dx) < 8 &&
                    Math.abs(gesture.dy) < 8;

                if (isTap && now - lastTap.current < 280) {
                    lastTap.current = 0;
                    toggleZoom();
                    return;
                }

                if (isTap) {
                    lastTap.current = now;
                }

                if (
                    scaleValue.current <= 1.05 &&
                    Math.abs(gesture.dx) > 60 &&
                    Math.abs(gesture.dx) > Math.abs(gesture.dy)
                ) {
                    goTo(indexRef.current + (gesture.dx < 0 ? 1 : -1));
                    return;
                }

                if (scaleValue.current > 1.05) {
                    settleZoom();
                } else {
                    translateValue.current = { x: 0, y: 0 };
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
            onPanResponderTerminate: () => {
                if (scaleValue.current > 1.05) {
                    settleZoom();
                } else {
                    translateX.setValue(0);
                }
            },
        }),
    ).current;

    if (images.length === 0) return null;

    return (
        <Modal
            visible
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <StatusBar hidden />
            <View style={styles.root}>
                <Animated.View
                    {...responder.panHandlers}
                    style={[
                        styles.stage,
                        {
                            width,
                            height,
                            transform: [
                                { translateX },
                                { translateY },
                                { scale },
                            ],
                        },
                    ]}
                >
                    {!loaded && (
                        <ActivityIndicator
                            color={colors.primary}
                            size="large"
                            style={styles.loader}
                        />
                    )}
                    <Animated.Image
                        source={{ uri: images[index] }}
                        style={styles.image}
                        resizeMode="contain"
                        onLoadStart={() => setLoaded(false)}
                        onLoad={() => setLoaded(true)}
                    />
                </Animated.View>

                <View style={styles.topBar} pointerEvents="box-none">
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Görseli kapat"
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <AppText style={styles.closeText}>✕</AppText>
                    </Pressable>

                    <View style={styles.counter}>
                        <AppText style={styles.counterText}>
                            {index + 1} / {images.length}
                        </AppText>
                    </View>
                </View>

                <View style={styles.hint} pointerEvents="none">
                    <AppText style={styles.hintText}>
                        Sağa/sola kaydır · İki parmakla yakınlaştır
                    </AppText>
                </View>
            </View>
        </Modal>
    );
};
