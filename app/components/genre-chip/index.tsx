import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { AppText } from '../app-text';
import { styles } from './styles';
import { useSettings } from '../../context/settings-context';
import { localizeCatalogName } from '../../i18n';

interface GenreChipProps {
    name: string;
    isSelected?: boolean;
    onPress: () => void;
}

export const GenreChip: React.FC<GenreChipProps> = memo(({ name, isSelected, onPress }) => {
    const { language, colors } = useSettings();
    const localizedName = localizeCatalogName(language, name);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: colors.surface, borderColor: colors.border },
                isSelected && styles.selectedContainer,
                isSelected && { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
            ]}
            onPress={onPress}
        >
            <AppText
                variant="caption"
                bold
                style={[
                    styles.text,
                    { color: isSelected ? colors.primary : colors.secondary },
                ]}
            >
                {localizedName.toLocaleUpperCase(language === 'tr' ? 'tr-TR' : 'en-US')}
            </AppText>
        </TouchableOpacity>
    );
});
