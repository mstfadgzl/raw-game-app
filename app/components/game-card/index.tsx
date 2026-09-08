import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IGame } from '@types';
import { styles } from './styles';

interface GameCardProps {
    game: IGame;
    onPress: (id: number, name: string) => void;
}

export const GameCard: React.FC<GameCardProps> = memo(({ game, onPress }) => {
    // İsteğin üzerine puanı tam 3.91 / 5 formatına getiriyoruz. 
    // Puan yoksa "N/A" (Bilinmiyor) gösterecek.
    const ratingDisplay = game.rating ? `${game.rating.toFixed(2)} / 5` : 'N/A';

    // "2024-05-12" gibi gelen tarihi sadece "2024" olarak almak tasarımı çok daha şık yapar.
    const releaseYear = game.released ? game.released.substring(0, 20) : 'TBA';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.container}
            onPress={() => onPress(game.id, game.name)}
        >
            {/* Görsel ve Yüzen Puan Rozeti Alanı */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: game.background_image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* 🌟 Premium Dokunuş: Sağ üstte asılı duran yarı saydam puan rozeti */}
                <View style={styles.floatingRating}>
                    <Text style={styles.starIcon}>★</Text>
                    <Text style={styles.ratingText}>{ratingDisplay}</Text>
                </View>
            </View>

            {/* Metin İçerik Alanı */}
            <View style={styles.content}>
                {/* İsim uzunsa 2 satıra sarar, tasarım bozulmaz */}
                <Text style={styles.title} numberOfLines={2}>
                    {game.name}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.releaseDate}>Çıkış: {releaseYear}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});