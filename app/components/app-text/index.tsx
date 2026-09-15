import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { useSettings } from '../../context/settings-context';

interface AppTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'body' | 'caption';
    color?: string;
    bold?: boolean;
    style?: TextStyle | TextStyle[];
}

export const AppText: React.FC<AppTextProps> = ({
    variant = 'body',
    color,
    bold,
    children,
    style,
    ...props
}) => {
    const { colors, localize } = useSettings();
    const textColor = color ?? (variant === 'caption' ? colors.secondary : colors.text);

    const localizedChildren = React.Children.map(children, child =>
        typeof child === 'string' ? localize(child) : child,
    );

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
                { color: textColor },
                bold !== undefined && { fontWeight: bold ? 'bold' : 'normal' },
                style
            ]}
            {...props}
        >
            {localizedChildren}
        </Text>
    );
};
