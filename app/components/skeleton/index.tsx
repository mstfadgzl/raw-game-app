import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { styles } from './styles';

interface SkeletonProps {
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // Parlama efekti döngüsü
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return <Animated.View style={[styles.skeleton, style, { opacity }]} />;
};