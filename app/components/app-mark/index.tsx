import React from 'react';
import { Image } from 'react-native';

type Props = { size?: number };

export const AppMark = ({ size = 112 }: Props) => (
    <Image
        source={require('../../assets/brand/gamecodex.png')}
        accessibilityLabel="GameCodex"
        resizeMode="contain"
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
    />
);

