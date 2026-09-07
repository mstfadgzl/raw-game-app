import React from 'react';
import { ScrollView, View } from 'react-native';
import { useAppSelector } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompactGameItem, SectionHeader, EmptyState } from '@components';
import { styles } from '../../styles';

export const ExpansionsTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
        <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
            nestedScrollEnabled={true}
        >
            {dlcs.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                    <SectionHeader title="Ek Paketler (DLC)" />
                    {dlcs.map((item: any) => (
                        <CompactGameItem
                            key={`dlc-${item.id}`}
                            game={item}
                            onPress={handleNavigate}
                        />
                    ))}
                </View>
            )}
            {series.length > 0 && (
                <View>
                    <SectionHeader title="Serinin Diğer Oyunları" />
                    {series.map((item: any) => (
                        <CompactGameItem
                            key={`series-${item.id}`}
                            game={item}
                            onPress={handleNavigate}
                        />
                    ))}
                </View>
            )}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};