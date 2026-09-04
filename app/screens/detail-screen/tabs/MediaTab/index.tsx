import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useAppSelector } from '@hooks';
import { AppText, EmptyState } from '@components';
import { styles as globalStyles } from '../../styles'; // Ana sayfanın stilleri (Modal overlay vb. için)

export const MediaTab = () => {
    const { data } = useAppSelector(state => state.game);
    const screenshots = data.getGameScreenshotsProcess?.results || [];
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    // Eğer hiç ekran görüntüsü yoksa Boş Durum (Empty State) göster
    if (screenshots.length === 0) {
        return (
            <View style={localStyles.emptyContainer}>
                <EmptyState message="Bu oyun için henüz medya bulunmuyor." />
            </View>
        );
    }

    return (
        <View style={globalStyles.tabContent}>
            <FlatList
                data={screenshots}
                keyExtractor={(item) => `media-screenshot-${item.id}`}
                showsVerticalScrollIndicator={false}

                // İŞTE SİHİR BURADA: Doğrudan 2 kolonlu ızgara (Grid) oluşturur
                numColumns={2}
                // Kolonlar arası boşluğu eşit dağıtmak için:
                columnWrapperStyle={localStyles.rowWrapper}
                contentContainerStyle={localStyles.listContent}

                ListHeaderComponent={
                    <AppText variant="h2" style={localStyles.header}>Ekran Görüntüleri</AppText>
                }

                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={localStyles.imageCard}
                        onPress={() => setSelectedImg(item.image)}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={{ uri: item.image }}
                            style={localStyles.image}
                        />
                    </TouchableOpacity>
                )}
            />

            {/* Tam Ekran Önizleme Modalı */}
            <Modal
                visible={!!selectedImg}
                transparent={true}
                animationType="fade"
                // Android'deki fiziksel geri tuşunu yakalayıp sadece Modalı kapatır
                onRequestClose={() => setSelectedImg(null)}
                // Modal açıldığında üstteki saat/şarj çubuğunu da karanlık yapar
                statusBarTranslucent
            >
                <TouchableOpacity
                    style={globalStyles.modalOverlay}
                    onPress={() => setSelectedImg(null)}
                    activeOpacity={1}
                >
                    <Image
                        source={{ uri: selectedImg || '' }}
                        style={localStyles.fullScreenImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// Kodun okunabilirliğini artırmak için satır içi stilleri (inline-styles) buraya aldık
const localStyles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 15,
    },
    rowWrapper: {
        justifyContent: 'space-between',
    },
    listContent: {
        paddingBottom: 40,
    },
    imageCard: {
        width: '48%', // 2 Kolon olduğu için %48
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 120,
        borderRadius: 12,
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    }
});