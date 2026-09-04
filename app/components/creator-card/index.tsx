import React, { memo } from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import { AppText } from "../app-text";
import { ICreator } from "@types"; // Daha önce yazdığımız ICreator interface'i
import { styles } from "./styles";

interface CreatorCardProps {
    // RAWG /creators listesi her bir creator içinde o kişiye ait oyunları da döner
    creator: ICreator & {
        games: { id: number; name: string; slug: string }[]
    };
    onPress: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = memo(({ creator, onPress }) => (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
        <Image
            source={{ uri: creator.image || 'https://via.placeholder.com/150' }}
            style={styles.image}
        />
        <View style={styles.content}>
            <AppText variant="h2" bold numberOfLines={1}>{creator.name}</AppText>
            <View style={styles.gamesRow}>
                {creator.games?.slice(0, 2).map(g => (
                    <AppText key={g.id} variant="caption" style={styles.gameTag}>
                        • {g.name}
                    </AppText>
                ))}
            </View>
        </View>
    </TouchableOpacity>
));