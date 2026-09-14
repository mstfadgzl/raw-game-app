import React from 'react';
import { View, Image } from 'react-native';
import { IAchievement } from '@types'; // Daha önce tanımladığın interface
import { AppText } from '../app-text';
import { styles } from './styles';
import { useSettings } from '../../context/settings-context';

interface AchievementItemProps {
    achievement: IAchievement;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
    // Nadirlik kontrolü (Yüzde 5'ten az ise özel renk)
    const isRare = parseFloat(achievement.percent) < 3;
    const { colors } = useSettings();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: achievement.image }} style={[styles.icon, { backgroundColor: colors.background }]} />
            <View style={styles.textContainer}>
                <AppText bold>{achievement.name}</AppText>
                <AppText variant="caption" numberOfLines={2}>
                    {achievement.description || 'Gizli başarım.'}
                </AppText>
            </View>
            <View
                style={[
                    styles.percentBadge,
                    { borderColor: isRare ? colors.primary : colors.border }
                ]}
            >
                <AppText
                    variant="caption"
                    bold
                    color={isRare ? colors.gold : colors.secondary}
                >
                    %{achievement.percent}
                </AppText>
            </View>
        </View>
    );
};
