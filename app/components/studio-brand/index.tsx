import React, { memo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { colors } from '@theme';
import { cardImageUrl } from '../../utils/card-image';
import { AppText } from '../app-text';
import { useSettings } from '../../context/settings-context';

export type StudioBrandProps = {
    name: string;
    imageBackground?: string | null;
    image?: string | null;
    size?: number;
};

const getInitial = (name: string) =>
    name.trim().charAt(0).toLocaleUpperCase('tr-TR') || '?';

/**
 * RAWG geliştiriciler için logo döndürmediği için bu bileşen önce mevcut
 * görseli kullanır, görsel yüklenemezse stüdyo baş harfine düşer.
 */
export const StudioBrand = memo(({
    name,
    imageBackground,
    image,
    size = 56,
}: StudioBrandProps) => {
    const [imageFailed, setImageFailed] = useState(false);
    const { colors: themeColors } = useSettings();
    const originalUri = image?.trim() || imageBackground?.trim() || '';
    const imageUri = cardImageUrl(originalUri);
    const radius = Math.max(12, Math.round(size * 0.24));

    return (
        <View
            style={[
                localStyles.root,
                { width: size, height: size, borderRadius: radius },
            ]}
        >
            {imageUri && !imageFailed ? (
                <Image
                    source={{ uri: imageUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <View style={[localStyles.fallback, { backgroundColor: themeColors.surface }]}>
                    <AppText style={[localStyles.initial, { color: themeColors.primary, fontSize: Math.max(20, size * 0.42) }]}>
                        {getInitial(name)}
                    </AppText>
                </View>
            )}
            <View style={localStyles.tint} pointerEvents="none" />
        </View>
    );
});

StudioBrand.displayName = 'StudioBrand';

const localStyles = StyleSheet.create({
    root: {
        overflow: 'hidden',
        backgroundColor: '#28333A',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fallback: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    initial: {
        color: colors.primary,
        fontWeight: '800',
    },
    tint: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(4, 10, 14, 0.14)',
    },
});
