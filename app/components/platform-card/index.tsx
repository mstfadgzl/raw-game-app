import React, { memo } from 'react';
import { TouchableOpacity, ImageBackground, View } from 'react-native';
import { AppText } from '../app-text';
import { styles } from './style';
import { useSettings } from '../../context/settings-context';

interface PlatformCardProps {
    name: string;
    image: string;
    gamesCount?: number;
    onPress: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = memo(({ name, image, gamesCount, onPress }) => {
    const { colors, language } = useSettings();

    return (
        <TouchableOpacity style={[styles.container, { borderColor: colors.border }]} activeOpacity={0.8} onPress={onPress}>
            <ImageBackground
                source={{ uri: image }}
                style={styles.image}
                imageStyle={{ borderRadius: 16 }}
            >
                <View style={styles.overlay}>
                    <AppText variant="h2" style={styles.name} numberOfLines={1}>
                        {name}
                    </AppText>
                    {gamesCount && (
                        <AppText variant="caption" style={styles.count}>
                            {`${gamesCount.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')} ${language === 'tr' ? 'oyun' : 'games'}`}
                        </AppText>
                    )}
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
});
