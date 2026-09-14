import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppText } from '../app-text'; // @components yerine göreli import daha güvenlidir (loop önlemek için)
import { styles } from './styles';
import { useSettings } from '../../context/settings-context';

interface StoreButtonProps {
    // RAWG API'de oyun detayındaki store objesinin yapısı:
    store: {
        id: number;
        name: string;
        domain?: string;
        slug?: string;
    };
    onPress: () => void;
}

export const StoreButton: React.FC<StoreButtonProps> = ({ store, onPress }) => {
    const { colors } = useSettings();

    return (
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.storeInfo}>
                <AppText bold>{store.name}</AppText>
            </View>
            <AppText variant="caption" color={colors.primary} bold>MAĞAZAYA GİT</AppText>
        </TouchableOpacity>
    );
};
