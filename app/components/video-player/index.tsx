import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ITrailer } from '@types';
import { AppText } from '../app-text';
import { styles } from './styles';
import { colors } from '@theme';

interface VideoPlayerProps {
  trailer: ITrailer;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ trailer }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // RAWG fragmanları bazen boş gelebilir
  if (!trailer) return null;

  return (
    <View style={styles.container}>
      {!isPlaying ? (
        // Video Önizleme (Kapak Resmi)
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.9}
          onPress={() => setIsPlaying(true)}
        >
          <Image
            source={{ uri: trailer.preview }}
            style={styles.placeholderImage}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <AppText style={{ fontSize: 30 }}>▶</AppText>
          </View>
        </TouchableOpacity>
      ) : (
        /* 
           Burada normalde <Video /> bileşeni olur. 
           Şimdilik WebView veya Video yüklendiğinde buraya gelecek.
        */
        <View style={styles.container}>
          <ActivityIndicator color={colors.primary} size="large" />
          <AppText variant="caption" style={{ marginTop: 10 }}>
            Video Yükleniyor...
          </AppText>
          <TouchableOpacity onPress={() => setIsPlaying(false)} style={{ marginTop: 20 }}>
            <AppText color={colors.primary} bold>DURDUR</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};