import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { mockRoutines } from '../data/mockData';
import { openYouTubeUrl, extractYouTubeId, getYouTubeThumbnailUrl } from '../services/youtube';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Play'>;

const formatTime = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function PlayScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { routineId } = route.params;

  const routine = mockRoutines.find(r => r.id === routineId);
  const totalSeconds = (routine?.durationMin ?? 20) * 60;

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Find which index this routine is (for "1/5" style indicator)
  const routineIndex = mockRoutines.findIndex(r => r.id === routineId);
  const totalRoutines = mockRoutines.length;

  const remaining = totalSeconds - elapsed;
  const progressPct = elapsed / totalSeconds;

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= totalSeconds - 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!routine) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>루틴을 찾을 수 없어요</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const videoId = routine.youtubeUrl ? extractYouTubeId(routine.youtubeUrl) : null;
  const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressIndicator}>
          {routineIndex + 1} / {totalRoutines}
        </Text>
      </View>

      {/* Video area */}
      <TouchableOpacity
        style={styles.videoArea}
        onPress={() => routine.youtubeUrl && openYouTubeUrl(routine.youtubeUrl)}
        activeOpacity={0.92}
      >
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}
        {/* Video overlay controls */}
        <View style={styles.videoOverlay}>
          <View style={styles.videoControls}>
            <TouchableOpacity onPress={toggleTimer} style={styles.playPauseBtn} activeOpacity={0.85}>
              <Text style={styles.playPauseIcon}>{isRunning ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            <View style={styles.videoTimeline}>
              <Text style={styles.videoTimeElapsed}>{formatTime(elapsed)}</Text>
              <View style={styles.videoProgressTrack}>
                <View style={[styles.videoProgressFill, { width: `${progressPct * 100}%` }]} />
              </View>
              <Text style={styles.videoTimeTotal}>{formatTime(totalSeconds)}</Text>
            </View>
            <TouchableOpacity style={styles.fullscreenBtn} activeOpacity={0.7}>
              <Text style={styles.fullscreenIcon}>⛶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.routineTitle}>{routine.title}</Text>
        {routine.description ? (
          <Text style={styles.routineDesc}>{routine.description}</Text>
        ) : null}

        {/* Big countdown timer */}
        <Text style={styles.countdown}>{formatTime(remaining)}</Text>

        {/* Pause / Resume button */}
        <TouchableOpacity style={styles.pauseBtn} onPress={toggleTimer} activeOpacity={0.85}>
          <Text style={styles.pauseBtnIcon}>{isRunning ? '⏸' : '▶'}</Text>
          <Text style={styles.pauseBtnText}>{isRunning ? '일시정지' : '시작'}</Text>
        </TouchableOpacity>

        {/* Complete button */}
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => navigation.replace('Done', { routineId })}
          activeOpacity={0.85}
        >
          <Text style={styles.completeBtnCheck}>✓</Text>
          <Text style={styles.completeBtnText}>완료했어요</Text>
        </TouchableOpacity>

        {/* Plant hint */}
        <View style={styles.plantHint}>
          <Text style={styles.plantHintEmoji}>🌱</Text>
          <Text style={styles.plantHintText}>완료하면 식물에 물이 채워져요</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mutedFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 14, color: Colors.textSecondary },
  progressIndicator: { ...Typography.body2, color: Colors.textSecondary },

  /* Video area */
  videoArea: {
    height: 220,
    backgroundColor: Colors.primary700,
    position: 'relative',
  },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailPlaceholder: { flex: 1, backgroundColor: '#2A4A48' },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  videoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playPauseBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseIcon: { fontSize: 16, color: Colors.textInverse },
  videoTimeline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  videoTimeElapsed: { ...Typography.caption2, color: 'rgba(255,255,255,0.9)', width: 36 },
  videoProgressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  videoProgressFill: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: Colors.primary400,
  },
  videoTimeTotal: { ...Typography.caption2, color: 'rgba(255,255,255,0.9)', width: 36, textAlign: 'right' },
  fullscreenBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  fullscreenIcon: { fontSize: 14, color: Colors.textInverse },

  /* Content */
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.base,
  },
  routineTitle: {
    ...Typography.heading,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  routineDesc: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  /* Big countdown */
  countdown: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginVertical: Spacing.sm,
  },

  /* Pause button */
  pauseBtn: {
    width: '100%',
    height: ButtonHeight.primary,
    backgroundColor: Colors.primary600,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  pauseBtnIcon: { fontSize: 16, color: Colors.textInverse },
  pauseBtnText: { ...Typography.body1, color: Colors.textInverse },

  /* Complete button */
  completeBtn: {
    width: '100%',
    height: ButtonHeight.secondary,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  completeBtnCheck: { fontSize: 14, color: Colors.primary600 },
  completeBtnText: { ...Typography.body2, color: Colors.primary600 },

  /* Plant hint */
  plantHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  plantHintEmoji: { fontSize: 14 },
  plantHintText: { ...Typography.caption1, color: Colors.textSecondary },

  /* Not found */
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  notFoundText: { ...Typography.body1, color: Colors.textSecondary },
  backLink: { ...Typography.body2, color: Colors.primary600, textDecorationLine: 'underline' },
});
