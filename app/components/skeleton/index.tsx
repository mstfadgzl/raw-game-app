import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useStyles } from './styles';

interface SkeletonProps {
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ style }) => {
    const styles = useStyles();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // Parlama efekti döngüsü
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                    isInteraction: false,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                    isInteraction: false,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return <Animated.View style={[styles.skeleton, style, { opacity }]} />;
};
