import { getCreatorsProcess, getPlatformsProcess, getTagsProcess } from "@actions";
import { useAppDispatch, useAppSelector } from "@hooks"
import { useNavigation } from "@react-navigation/native";
import { DiscoverMainNavigationProp } from "@types";
import { useCallback, useEffect } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { styles } from "./styles";
import { AppText, Container, CreatorCard, GenreChip, PlatformCard, SectionHeader, Skeleton } from "@components";
import { colors } from "@theme";

export const DiscoverMainScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<DiscoverMainNavigationProp>();

    const { data: discData, isLoading: discLoading } = useAppSelector(state => state.discovery);
    const { data: entData, isLoading: entLoading } = useAppSelector(state => state.entity);

    const platforms = discData.getPlatformsProcess?.results || [];
    const tags = discData.getTagsProcess?.results || [];
    const creators = entData.getCreatorsProcess?.results || [];

    // Yenileme durumunu kontrol etme (İlk iskelet yüklemesinde dönmemesi için)
    const isRefreshing = !!discLoading['getPlatformsProcess'] && platforms.length > 0;

    const fetchData = useCallback(() => {
        dispatch(getPlatformsProcess({ page: 1 }));
        dispatch(getTagsProcess({ page: 1 }));
        dispatch(getCreatorsProcess({ page: 1 }));
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderPlatforms = () => (
        <View style={styles.section}>
            <SectionHeader title="Oyun Platformları" />
            <FlatList
                horizontal
                data={platforms} // Güvenli data
                keyExtractor={(item) => `plt-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
                renderItem={({ item }) => (
                    <PlatformCard
                        name={item.name}
                        image={item.image_background}
                        gamesCount={item.games_count}
                        onPress={() => console.log("Platform ID:", item.id)}
                    />
                )}
            />
        </View>
    );

    const renderCreators = () => (
        <View style={styles.section}>
            <SectionHeader title="Yapımcılar" />
            <FlatList
                horizontal
                data={creators} // Güvenli data
                keyExtractor={(item) => `cre-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalPadding}
                renderItem={({ item }) => (
                    <CreatorCard
                        creator={item}
                        onPress={() => navigation.navigate('CreatorDetail', { id: item.id, name: item.name })}
                    />
                )}
            />
        </View>
    );

    const renderTags = () => (
        <View style={styles.section}>
            <SectionHeader title="Popüler Etiketler" />
            <View style={styles.tagsWrapper}>
                {/* Güvenli slice ve map kullanımı */}
                {tags.slice(0, 15).map((tag: any) => (
                    <GenreChip
                        key={`tag-${tag.id}`}
                        name={tag.name}
                        onPress={() => console.log("Tag:", tag.slug)}
                    />
                ))}
            </View>
        </View>
    );

    // İlk yükleme anında iskelet ekranı göster
    if (discLoading['getPlatformsProcess'] && platforms.length === 0) {
        return <Container><Skeleton style={styles.fullSkeleton} /></Container>;
    }

    return (
        <Container style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                // Artık dinamik bir yenileme döngüsü var
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={fetchData}
                        tintColor={colors.primary}
                    />
                }
            >
                <View style={styles.header}>
                    <AppText variant="h1" color={colors.primary}>KEŞFET</AppText>
                    <AppText variant="caption">Oyun dünyasının tüm katmanlarını incele</AppText>
                </View>

                {renderPlatforms()}
                {renderTags()}
                {renderCreators()}

                <View style={{ height: 100 }} />
            </ScrollView>
        </Container>
    );
};