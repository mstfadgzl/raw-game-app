import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { AppText } from '../app-text';
import { StudioBrand } from '../studio-brand';
import { styles } from './styles';

export type StudioCardData = {
    id: number;
    name: string;
    image_background?: string | null;
    games_count?: number;
};

type StudioCardProps = {
    studio: StudioCardData;
    onPress: () => void;
};

export const StudioCard = memo(({ studio, onPress }: StudioCardProps) => (
    <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`${studio.name} stüdyo detaylarını aç`}
    >
        <View style={styles.brandArea}>
            <StudioBrand
                name={studio.name}
                imageBackground={studio.image_background}
                size={64}
            />
        </View>
        <View style={styles.content}>
            <AppText style={styles.name} numberOfLines={1} bold>
                {studio.name}
            </AppText>
            <AppText style={styles.count}>
                {typeof studio.games_count === 'number' && studio.games_count > 0
                    ? `${studio.games_count} oyun`
                    : 'Oyun bilgisi yok'}
            </AppText>
        </View>
    </TouchableOpacity>
));

StudioCard.displayName = 'StudioCard';
