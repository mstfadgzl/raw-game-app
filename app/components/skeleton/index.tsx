import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

export const Skeleton = ({ style }: { style: ViewStyle }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, [opacity]);

    return <Animated.View style={[{ backgroundColor: colors.surface, opacity }, style]} />;
};