import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { colors } from '@theme';

interface AppTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'body' | 'caption';
    color?: string;
    bold?: boolean;
    style?: TextStyle | TextStyle[];
}

export const AppText: React.FC<AppTextProps> = ({
    variant = 'body',
    color = colors.text,
    bold,
    children,
    style,
    ...props
}) => {
    const getVariantStyle = (): TextStyle => {
        switch (variant) {
            case 'h1': return { fontSize: 24, fontWeight: 'bold' };
            case 'h2': return { fontSize: 18, fontWeight: 'bold' };
            case 'caption': return { fontSize: 12, color: colors.secondary };
            default: return { fontSize: 14 };
        }
    };

    return (
        <Text
            style={[
                getVariantStyle(),
                { color, fontWeight: bold ? 'bold' : 'normal' },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};