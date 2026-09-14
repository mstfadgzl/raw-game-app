import React from 'react';
import { Image } from 'react-native';

type Props = { size?: number };

export const AppMark = ({ size = 112 }: Props) => (
    <Image
        source={require('../../assets/brand/gamecodex.jpg')}
        accessibilityLabel="GameCodex"
        resizeMode="contain"
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
    />
);
