import React from 'react';
import { ScrollView, View } from 'react-native';
import { useAppSelector } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import { AppText, CompactGameItem, SectionHeader, EmptyState } from '@components';
import { GenericNavigationProp } from '@types';
import { styles } from '../../styles';

export const ExpansionsTab = () => {
    const navigation = useNavigation<GenericNavigationProp>();
    const { data } = useAppSelector(state => state.game);

    const dlcs = data.getGameAdditionProcess?.results || [];
    const series = data.getGameSeriesProcess?.results || [];

    const hasData = dlcs.length > 0 || series.length > 0;

    if (!hasData) {
        return <EmptyState message="Bu oyun için ek paket veya seri bilgisi bulunamadı." />;
    }

    const handleNavigate = (id: number | string, name: string) => {
        navigation.push('GameDetail', { gameId: id, gameName: name });
    };

    return (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* 1. DLC & EK PAKETLER */}
            {dlcs.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                    <SectionHeader title="Ek Paketler (DLC)" />
                    {dlcs.map(item => (
                        <CompactGameItem
                            key={`dlc-${item.id}`} // Benzersiz prefix eklendi
                            game={item}
                            onPress={handleNavigate}
                        />
                    ))}
                </View>
            )}

            {/* 2. AYNI SERİDEKİ OYUNLAR */}
            {series.length > 0 && (
                <View>
                    <SectionHeader title="Serinin Diğer Oyunları" />
                    {series.map(item => (
                        <CompactGameItem
                            key={`series-${item.id}`} // Benzersiz prefix eklendi
                            game={item}
                            onPress={handleNavigate}
                        />
                    ))}
                </View>
            )}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};