import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { mockRoutines } from '../data/mockData';
import { openYouTubeUrl, extractYouTubeId, getYouTubeThumbnailUrl } from '../services/youtube';
import { formatDuration } from '../utils/dateUtils';
import { DIFFICULTY_LABELS } from '../constants';
import Badge from '../components/Badge';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Play'>;

export default function PlayScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { routineId } = route.params;

  const routine = mockRoutines.find(r => r.id === routineId);

  if (!routine) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>루틴을 찾을 수 없어요</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const videoId = routine.youtubeUrl ? extractYouTubeId(routine.youtubeUrl) : null;
  const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

  const handleComplete = () => {
    navigation.replace('Done', { routineId });
  };

  const handleOpenYouTube = () => {
    if (routine.youtubeUrl) {
      openYouTubeUrl(routine.youtubeUrl);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>루틴 실행</Text>
        <View style={styles.navRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Routine info */}
        <View style={styles.infoSection}>
          <View style={styles.tags}>
            <Badge label={formatDuration(routine.durationMin)} variant="muted" />
            <Badge
              label={DIFFICULTY_LABELS[routine.difficulty] ?? routine.difficulty}
              variant="muted"
            />
          </View>
          <Text style={styles.title}>{routine.title}</Text>
          {routine.description ? (
            <Text style={styles.description}>{routine.description}</Text>
          ) : null}
        </View>

        {/* YouTube video block */}
        {routine.youtubeUrl ? (
          <TouchableOpacity
            style={styles.videoBlock}
            onPress={handleOpenYouTube}
            activeOpacity={0.9}
          >
            {thumbnailUrl ? (
              <Image
                source={{ uri: thumbnailUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.thumbnailPlaceholderText}>▷</Text>
              </View>
            )}
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>▷</Text>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoLabel}>YouTube에서 보기</Text>
                <Text style={styles.videoSub}>외부 앱으로 열립니다</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.noVideoBlock}>
            <Text style={styles.noVideoText}>이 루틴에는 영상이 없어요</Text>
            <Text style={styles.noVideoSub}>아래 완료 버튼으로 진행해 주세요</Text>
          </View>
        )}

        {/* Plant hint */}
        <View style={styles.plantHint}>
          <Text style={styles.plantHintEmoji}>🌱</Text>
          <Text style={styles.plantHintText}>완료하면 식물이 조금 자라요</Text>
        </View>
      </ScrollView>

      {/* Complete button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.85}>
          <Text style={styles.completeButtonText}>완료했어요</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  navTitle: {
    ...Typography.body1,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  navRight: {
    width: 40,
  },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },
  infoSection: {
    gap: Spacing.md,
    paddingTop: Spacing.base,
  },
  tags: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.title1,
    color: Colors.textPrimary,
  },
  description: {
    ...Typography.body2,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  videoBlock: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.textPrimary,
    height: 210,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: Colors.primary700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 48,
    color: Colors.textInverse,
    opacity: 0.6,
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 22,
    color: Colors.primary700,
    marginLeft: 3,
  },
  videoInfo: {
    alignItems: 'center',
    gap: 3,
  },
  videoLabel: {
    ...Typography.body1,
    color: Colors.textInverse,
  },
  videoSub: {
    ...Typography.caption2,
    color: 'rgba(255,255,255,0.75)',
  },
  noVideoBlock: {
    backgroundColor: Colors.mutedFill,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  noVideoText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  noVideoSub: {
    ...Typography.caption2,
    color: Colors.textTertiary,
  },
  plantHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  plantHintEmoji: {
    fontSize: 16,
  },
  plantHintText: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  completeButton: {
    height: ButtonHeight.primary,
    backgroundColor: Colors.primary600,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    ...Typography.body1,
    color: Colors.textInverse,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  notFoundText: {
    ...Typography.body1,
    color: Colors.textSecondary,
  },
  backBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backBtnText: {
    ...Typography.body2,
    color: Colors.primary600,
  },
});
