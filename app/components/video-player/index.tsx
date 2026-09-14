import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  PanResponder,
  Pressable,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import Video, { type VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../types/navigation';

import { ITrailer } from '@types';
import { AppText } from '../app-text';
import { colors } from '@theme';
import { styles } from './styles';

interface VideoPlayerProps {
  trailer: ITrailer;
}

const sourceQuality = (quality: string, uri: string) => {
  if (/^max$/i.test(quality.trim())) {
    return Number.POSITIVE_INFINITY;
  }

  const keyResolution = Number.parseInt(quality, 10);
  const urlResolution = uri.match(/(?:^|[^0-9])(\d{3,4})(?:p)?(?:[^0-9]|$)/i);
  const parsedUrlResolution = urlResolution
    ? Number.parseInt(urlResolution[1], 10)
    : 0;

  return Math.max(
    Number.isFinite(keyResolution) ? keyResolution : 0,
    parsedUrlResolution,
  );
};

export const VideoPlayer = ({ trailer }: VideoPlayerProps) => {
  const sources = trailer?.data as Record<string, unknown> | undefined;

  // RAWG genellikle 480 ve max kaynaklarını birlikte döndürür. Anahtar sırası
  // kaliteyi garanti etmediği için anahtarı ve URL içindeki çözünürlüğü
  // karşılaştırıp mevcut en yüksek kaynağı seçiyoruz.
  const videoUrl = Object.entries(sources || {})
    .filter(([, value]) =>
      typeof value === 'string' && /^https?:\/\//i.test(value.trim()),
    )
    .sort(([firstQuality, firstUri], [secondQuality, secondUri]) => {
      return sourceQuality(secondQuality, String(secondUri)) -
        sourceQuality(firstQuality, String(firstUri));
    })
    .map(([, value]) => (value as string).trim())[0] || '';

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
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [inlinePlaying, setInlinePlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = React.useRef<VideoRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const openFullscreen = () => {
    navigation.navigate('Video', { videoUrl, preview });
  };

  return (
    <View style={styles.wrapper}>
      {!inlinePlaying ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Fragmanı küçük oynatıcıda oynat"
          activeOpacity={0.85}
          disabled={!videoUrl}
          style={styles.previewContainer}
          onPress={() => {
            setInlinePlaying(true);
            setPaused(false);
            setError(false);
          }}
        >
          {!!preview && (
            <Image
              source={{ uri: preview }}
              style={styles.fill}
              resizeMode="cover"
            />
          )}

          <View pointerEvents="none" style={styles.previewShade} />

          {videoUrl ? (
            <>
              <View style={styles.playButton}>
                <AppText style={styles.playIcon}>▶</AppText>
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
      ) : (
        <View style={styles.inlinePlayer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.fill}
            pointerEvents="none"
            resizeMode="cover"
            controls={false}
            paused={paused}
            repeat={false}
            onLoadStart={() => {
              setLoading(true);
              setError(false);
            }}
            onLoad={({ duration: loadedDuration }) => {
              setDuration(loadedDuration || 0);
              setLoading(false);
            }}
            onProgress={({ currentTime: nextTime }) => setCurrentTime(nextTime)}
            onReadyForDisplay={() => setLoading(false)}
            onBuffer={({ isBuffering }) => setLoading(isBuffering)}
            onEnd={() => {
              setPaused(true);
              setCurrentTime(duration);
            }}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={paused ? 'Fragmanı oynat' : 'Fragmanı durdur'}
            style={styles.inlineTouchSurface}
            onPress={() => {
              if (paused && duration > 0 && currentTime >= duration) {
                videoRef.current?.seek(0);
                setCurrentTime(0);
              }
              setPaused(value => !value);
            }}
          >
            {paused && (
              <View style={styles.inlinePlayButton}>
                <AppText style={styles.playIcon}>▶</AppText>
              </View>
            )}
          </Pressable>

          <View pointerEvents="none" style={styles.inlineShade} />

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Fragmanı tam ekranda aç"
            style={styles.inlineExpandButton}
            onPress={openFullscreen}
          >
            <AppText style={styles.inlineExpandText}>⛶</AppText>
          </TouchableOpacity>

          {loading && (
            <View pointerEvents="none" style={styles.inlineLoading}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {error && (
            <View pointerEvents="none" style={styles.inlineError}>
              <AppText style={styles.message}>Video oynatılamadı.</AppText>
            </View>
          )}
        </View>
      )}

    </View>
  );
};

interface FullscreenPlayerProps extends PlayerProps {
  onClose: () => void;
  onToggleOrientation: () => void;
}

const FullscreenPlayer = ({
  videoUrl,
  preview,
  onClose,
  onToggleOrientation,
}: FullscreenPlayerProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [videoRatio, setVideoRatio] = useState(16 / 9);

  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const videoRef = React.useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsInteraction, setControlsInteraction] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const heightRef = React.useRef(0);

  heightRef.current = size.height;


  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );

  const landscape = size.width > size.height;
  const waiting = loading || buffering;

  useEffect(() => {
    if (!controlsVisible || paused || waiting || !appActive || error) return;

    const timer = setTimeout(() => setControlsVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [controlsVisible, controlsInteraction, paused, waiting, appActive, error]);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      'change',
      state => setAppActive(state === 'active'),
    );

    return () => appStateSubscription.remove();
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
    setPaused(false);
    setCurrentTime(0);
    setDuration(0);
    setControlsVisible(true);
  };

  const toggleOrientation = () => {
    onToggleOrientation();
    showControls();
  };

  const showControls = () => {
    setControlsVisible(true);
    setControlsInteraction(value => value + 1);
  };

  const toggleControls = () => {
    setControlsVisible(value => !value);
  };

  const seekFromBar = (locationX: number) => {
    if (!barWidth || !duration) return;
    const nextTime = Math.max(
      0,
      Math.min(duration, (locationX / barWidth) * duration),
    );
    videoRef.current?.seek(nextTime);
    setCurrentTime(nextTime);
    showControls();
  };

  const formatTime = (value: number) => {
    const seconds = Math.max(0, Math.floor(value));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  const backSwipeResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) => {
        const currentHeight = heightRef.current;
        if (!currentHeight) return false;

        const bottomEdge = Math.min(140, currentHeight * 0.2);
        return (
          gesture.y0 >= currentHeight - bottomEdge &&
          gesture.dy < -16 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx)
        );
      },
      onPanResponderRelease: (_, gesture) => {
        const currentHeight = heightRef.current;
        const bottomEdge = Math.min(140, currentHeight * 0.2);
        const dismissDistance = Math.min(
          220,
          Math.max(90, currentHeight * 0.14),
        );

        if (
          gesture.y0 >= currentHeight - bottomEdge &&
          gesture.dy <= -dismissDistance &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx)
        ) {
          onClose();
        }
      },
    }),
  ).current;

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
      {...backSwipeResponder.panHandlers}
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

      {!error && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={controlsVisible ? 'Video kontrollerini gizle' : 'Video kontrollerini göster'}
          style={styles.touchSurface}
          onPress={toggleControls}
        />
      )}

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
          pointerEvents="box-none"
          style={{
            width: playerWidth,
            height: playerHeight,
            backgroundColor: '#000000',
            zIndex: 2,

          }}
        >
          <View style={styles.fill} pointerEvents="none" collapsable={false}>
            <Video
              key={attempt}
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.fill}
              pointerEvents="none"
              resizeMode="cover"
              controls={false}
              paused={!appActive || paused}
              repeat={false}
              playInBackground={false}
              playWhenInactive={false}
              onLoadStart={() => setLoading(true)}
              onLoad={({ naturalSize, duration: loadedDuration }) => {
                const { width, height } = naturalSize;

                if (width > 0 && height > 0) {
                  setVideoRatio(width / height);
                }

                setLoading(false);
                setDuration(loadedDuration || 0);
              }}
              onProgress={({ currentTime: nextTime }) => setCurrentTime(nextTime)}
              onReadyForDisplay={() => {
                setLoading(false);
                setBuffering(false);
              }}
              onBuffer={({ isBuffering }) => {
                setBuffering(isBuffering);
              }}
              onEnd={() => {
                setPaused(true);
                setCurrentTime(duration);
                showControls();
              }}
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
          </View>

          {controlsVisible && !error && (
            <View style={styles.controls} pointerEvents="box-none">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={landscape ? 'Dikey görünüme dön' : 'Yatay görünümü aç'}
                style={styles.orientationButton}
                onPress={toggleOrientation}
              >
                <AppText style={styles.orientationText}>{landscape ? '⛶' : '⛶'}</AppText>
              </TouchableOpacity>
              <View style={styles.controlCenter} pointerEvents="box-none">
                <View style={styles.seekButtons} pointerEvents="box-none">
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="10 saniye geri al"
                    style={styles.skipButton}
                    onPress={() => {
                      const nextTime = Math.max(0, currentTime - 10);
                      videoRef.current?.seek(nextTime);
                      setCurrentTime(nextTime);
                      showControls();
                    }}
                  >
                    <AppText style={styles.skipText}>↺ 10</AppText>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={paused ? 'Videoyu oynat' : 'Videoyu durdur'}
                  style={styles.playPauseButton}
                  onPress={() => {
                    if (duration > 0 && currentTime >= duration) {
                      videoRef.current?.seek(0);
                      setCurrentTime(0);
                    }
                    setPaused(value => !value);
                    showControls();
                  }}
                >
                  <AppText style={styles.controlIcon}>{paused ? '▶' : 'Ⅱ'}</AppText>
                </TouchableOpacity>
                <View style={styles.seekButtons} pointerEvents="box-none">
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="10 saniye ileri al"
                    style={styles.skipButton}
                    onPress={() => {
                      const nextTime = Math.min(duration, currentTime + 10);
                      videoRef.current?.seek(nextTime);
                      setCurrentTime(nextTime);
                      showControls();
                    }}
                  >
                    <AppText style={styles.skipText}>10 ↻</AppText>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bottomControls} pointerEvents="box-none">
                <AppText style={styles.timeText}>{formatTime(currentTime)}</AppText>
                <Pressable
                  style={styles.seekTrack}
                  onLayout={event => setBarWidth(event.nativeEvent.layout.width)}
                  onPress={event => seekFromBar(event.nativeEvent.locationX)}
                >
                  <View
                    style={[
                      styles.seekProgress,
                      {
                        width: duration
                          ? `${Math.min(100, (currentTime / duration) * 100)}%`
                          : '0%',
                      },
                    ]}
                  />
                </Pressable>
                <AppText style={styles.timeText}>{formatTime(duration)}</AppText>
              </View>
            </View>
          )}

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

export const VideoScreen = ({ route, navigation }: NativeStackScreenProps<AppStackParamList, 'Video'>) => {
  const [wide, setWide] = useState(false);
  React.useLayoutEffect(() => {
    navigation.setOptions({ orientation: wide ? 'landscape' : 'portrait' });
  }, [navigation, wide]);
  React.useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const toggleOrientation = () => {
    setWide(value => {
      const next = !value;

      if (next) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }

      return next;
    });
  };

  return (
    <FullscreenPlayer
      {...route.params}
      onClose={() => navigation.goBack()}
      onToggleOrientation={toggleOrientation}
    />
  );
};
