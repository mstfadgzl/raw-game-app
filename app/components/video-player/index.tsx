import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  Modal,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';

import { ITrailer } from '@types';
import { AppText } from '../app-text';
import { colors } from '@theme';
import { styles } from './styles';

interface VideoPlayerProps {
  trailer: ITrailer;
}

export const VideoPlayer = ({ trailer }: VideoPlayerProps) => {
  const sources = trailer?.data as
    | { '480'?: string; max?: string }
    | undefined;

  const videoUrl =
    [sources?.['480'], sources?.max].find(
      value =>
        typeof value === 'string' &&
        /^https?:\/\//i.test(value.trim()),
    )?.trim() || '';

  if (!trailer) return null;

  return (
    <PlayerPreview
      key={videoUrl || trailer.preview || 'empty'}
      videoUrl={videoUrl}
      preview={trailer.preview}
    />
  );
};

interface PlayerProps {
  videoUrl: string;
  preview?: string | null;
}

const PlayerPreview = ({ videoUrl, preview }: PlayerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Fragmanı oynat"
        activeOpacity={0.85}
        disabled={!videoUrl}
        style={styles.previewContainer}
        onPress={() => setOpen(true)}
      >
        {!!preview && (
          <Image
            source={{ uri: preview }}
            style={styles.fill}
            resizeMode="cover"
          />
        )}

        <View
          pointerEvents="none"
          style={styles.previewShade}
        />

        {videoUrl ? (
          <>
            <View style={styles.playButton}>
              <AppText style={styles.playIcon}>
                ▶
              </AppText>
            </View>

            <AppText style={styles.previewLabel}>
              Fragmanı oynat
            </AppText>
          </>
        ) : (
          <AppText style={styles.message}>
            Oynatılabilir video bulunmuyor.
          </AppText>
        )}
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent={false}
        animationType="fade"
        presentationStyle="fullScreen"
        hardwareAccelerated
        statusBarTranslucent
        navigationBarTranslucent
        supportedOrientations={[
          'portrait',
          'landscape-left',
          'landscape-right',
        ]}
        onRequestClose={() => setOpen(false)}
      >
        {open && (
          <FullscreenPlayer
            videoUrl={videoUrl}
            preview={preview}
            onClose={() => setOpen(false)}
          />
        )}
      </Modal>
    </View>
  );
};

interface FullscreenPlayerProps extends PlayerProps {
  onClose: () => void;
}

const FullscreenPlayer = ({
  videoUrl,
  preview,
  onClose,
}: FullscreenPlayerProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [videoRatio, setVideoRatio] = useState(16 / 9);

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );

  const landscape = size.width > size.height;
  const waiting = loading || buffering;

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      state => setAppActive(state === 'active'),
    );

    return () => {
      subscription.remove();
      StatusBar.setHidden(false);
    };
  }, []);

  useEffect(() => {
    if (!waiting || error || !appActive) return;

    const timer = setTimeout(() => {
      setError('Video yüklenemedi. Tekrar deneyebilirsin.');
      setLoading(false);
      setBuffering(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, [waiting, error, appActive, attempt]);

  const retry = () => {
    setError(null);
    setLoading(true);
    setBuffering(false);
    setAttempt(value => value + 1);
  };

  const portraitWidth = size.width;

  const playerWidth = landscape
    ? size.width
    : portraitWidth;

  const playerHeight = landscape
    ? size.height
    : Math.min(
      size.height * 0.7,
      portraitWidth / videoRatio + 100,
    );

  return (
    <View
      style={styles.fullscreen}
      onLayout={({ nativeEvent }) => {
        const { width, height } = nativeEvent.layout;

        setSize(previous =>
          previous.width === width &&
            previous.height === height
            ? previous
            : { width, height },
        );
      }}
    >
      <StatusBar hidden />

      {!!preview && (
        <Image
          pointerEvents="none"
          source={{ uri: preview }}
          style={styles.blurBackground}
          resizeMode="cover"
          blurRadius={24}
        />
      )}

      <View
        pointerEvents="none"
        style={styles.backgroundShade}
      />

      {error ? (
        <View style={styles.errorContent}>
          <AppText style={styles.message}>
            {error}
          </AppText>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.retryButton}
            onPress={retry}
          >
            <AppText color={colors.primary} bold>
              Tekrar dene
            </AppText>
          </TouchableOpacity>
        </View>
      ) : size.width > 0 && size.height > 0 ? (
        <View
          style={{
            width: playerWidth,
            height: playerHeight,
            backgroundColor: '#000000',

          }}
        >
          <Video
            key={attempt}
            source={{ uri: videoUrl }}
            style={styles.fill}
            resizeMode="cover"
            controls={true}
            controlsStyles={{
              hideFullscreen: true,
            }}
            paused={!appActive}
            repeat={false}
            playInBackground={false}
            playWhenInactive={false}
            onLoadStart={() => setLoading(true)}
            onLoad={({ naturalSize }) => {
              const { width, height } = naturalSize;

              if (width > 0 && height > 0) {
                setVideoRatio(width / height);
              }

              setLoading(false);
            }}
            onReadyForDisplay={() => {
              setLoading(false);
              setBuffering(false);
            }}
            onBuffer={({ isBuffering }) => {
              setBuffering(isBuffering);
            }}
            onEnd={onClose}
            onError={event => {
              if (__DEV__) {
                console.log(
                  '[VideoPlayer hata]',
                  event.error,
                );
              }

              setError(
                'Video oynatılamadı. Bağlantını kontrol edip tekrar dene.',
              );
              setLoading(false);
              setBuffering(false);
            }}
          />

          {waiting && (
            <View
              pointerEvents="none"
              style={styles.loadingOverlay}
            >
              <ActivityIndicator
                color={colors.primary}
                size="large"
              />

              <AppText style={styles.loadingText}>
                Video yükleniyor…
              </AppText>
            </View>
          )}
        </View>
      ) : null}

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Videoyu kapat"
        style={styles.closeButton}
        onPress={onClose}
      >
        <AppText style={styles.closeText}>✕</AppText>
      </TouchableOpacity>
    </View>
  );
};
