import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useRoutines } from '../hooks/useRoutines';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { useUserState } from '../hooks/useUserState';
import { getGreeting, getToday } from '../utils/dateUtils';
import { getPlantEmoji, getPlantStageLabel } from '../utils/plantUtils';
import {
  mockTopics,
  mockRecommendedPackages,
  ACTIVE_TOPIC_ID,
  MONTHLY_TARGET_DAYS,
} from '../data/mockData';
import LoginBanner from '../components/LoginBanner';
import { extractYouTubeId, getYouTubeThumbnailUrl, openYouTubeUrl } from '../services/youtube';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { plant } = usePlantProgress();
  const { todayRoutines, isRoutineCompleted } = useRoutines(ACTIVE_TOPIC_ID);
  const { userState, isGuest, canAddTopic } = useUserState();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const activeTopic = mockTopics.find(t => t.id === ACTIVE_TOPIC_ID);
  const todayRoutine = todayRoutines[0] ?? null;
  const isCompleted = todayRoutine ? isRoutineCompleted(todayRoutine.id, getToday()) : false;
  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);
  const progressPct = plant.daysCompletedInCycle / MONTHLY_TARGET_DAYS;

  const todayVideoId = todayRoutine?.youtubeUrl ? extractYouTubeId(todayRoutine.youtubeUrl) : null;
  const todayThumbnailUrl = todayVideoId ? getYouTubeThumbnailUrl(todayVideoId) : null;

  const handleAddTopic = () => {
    const action = canAddTopic();
    if (action === 'needs_login') navigation.navigate('LoginPromptSheet', { trigger: 'addTopic' });
    else if (action === 'needs_premium') navigation.navigate('Premium');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {isGuest ? '안녕하세요,' : `안녕하세요, ${userState.displayName ?? ''}님`}
            </Text>
            {isGuest && (
              <View style={styles.guestBadge}>
                <Text style={styles.guestBadgeText}>게스트</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.titleLine1}>오늘도,</Text>
        <Text style={styles.titleLine2}>나를 연결하는 시간</Text>

        {/* Main routine + plant card */}
        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => navigation.navigate('RoutineList', { topicId: ACTIVE_TOPIC_ID })}
          activeOpacity={0.9}
        >
          {/* YouTube thumbnail banner for today's routine */}
          {todayThumbnailUrl && (
            <TouchableOpacity
              style={styles.thumbnailBanner}
              onPress={() => todayRoutine?.youtubeUrl && openYouTubeUrl(todayRoutine.youtubeUrl)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: todayThumbnailUrl }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              <View style={styles.thumbnailOverlay}>
                <View style={styles.playCircle}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
              <View style={styles.thumbnailLabel}>
                <Text style={styles.thumbnailLabelText}>오늘의 루틴 영상</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Card body (padded) */}
          <View style={styles.mainCardBody}>
            {/* Top: topic + routine info */}
            <View style={styles.mainCardTop}>
              <View style={styles.mainCardInfo}>
                <Text style={styles.topicLabel}>{activeTopic?.name ?? '루틴'}</Text>
                <Text style={styles.routineTitle} numberOfLines={1}>
                  {todayRoutine ? todayRoutine.title : '오늘 루틴 없음'}
                </Text>
              </View>
              {/* Plant illustration */}
              <View style={styles.plantIllustration}>
                <Text style={styles.plantEmoji}>{plantEmoji}</Text>
              </View>
            </View>

            {/* Streak badge */}
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>성장 {plant.streak}일째</Text>
            </View>

            {/* Water / progress gauge */}
            <View style={styles.waterGauge}>
              <Text style={styles.waterIcon}>💧</Text>
              <View style={styles.waterBarTrack}>
                <View style={[styles.waterBarFill, { width: `${progressPct * 100}%` }]} />
              </View>
              <Text style={styles.waterCount}>
                {plant.daysCompletedInCycle} / {MONTHLY_TARGET_DAYS}일
              </Text>
            </View>

            {/* Plant state footer */}
            <View style={styles.mainCardFooter}>
              <View>
                <Text style={styles.plantStateLabel}>식물 상태</Text>
                <Text style={styles.plantStateName}>{stageLabel} 단계</Text>
              </View>
              <Text style={styles.detailLink}>자세히 보기  {'>'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Add topic card */}
        <TouchableOpacity style={styles.addTopicCard} onPress={handleAddTopic} activeOpacity={0.85}>
          <Text style={styles.addTopicPlus}>＋</Text>
          <View>
            <Text style={styles.addTopicTitle}>주제 추가</Text>
            <Text style={styles.addTopicSub}>새로운 루틴을 시작해보세요</Text>
          </View>
        </TouchableOpacity>

        {/* Recommended packages */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>추천 루틴 패키지</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Premium')} activeOpacity={0.7}>
            <Text style={styles.sectionAction}>전체보기  {'>'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.packageRow}
        >
          {mockRecommendedPackages.map(pkg => (
            <TouchableOpacity
              key={pkg.id}
              style={styles.packageCard}
              onPress={() => navigation.navigate('Premium')}
              activeOpacity={0.85}
            >
              <View style={styles.packageIconWrap}>
                <Text style={styles.packageIcon}>{pkg.emoji}</Text>
              </View>
              <Text style={styles.packageTitle}>{pkg.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Login banner */}
        {isGuest && !bannerDismissed && (
          <View style={styles.bannerWrap}>
            <LoginBanner
              onPress={() => navigation.navigate('LoginPromptSheet', { trigger: 'progress' })}
              onDismiss={() => setBannerDismissed(true)}
            />
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  greeting: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  guestBadge: {
    backgroundColor: Colors.mutedFill,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guestBadgeText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },

  /* Title */
  titleLine1: {
    ...Typography.title1,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  titleLine2: {
    ...Typography.title1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },

  /* Main card */
  mainCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    gap: Spacing.md,
  },

  /* Thumbnail banner */
  thumbnailBanner: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.primary700,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  playCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: Colors.primary700,
    marginLeft: 3,
  },
  thumbnailLabel: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  thumbnailLabelText: {
    ...Typography.caption2,
    color: Colors.textInverse,
  },
  mainCardBody: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  mainCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  mainCardInfo: {
    flex: 1,
    gap: 4,
  },
  topicLabel: {
    ...Typography.caption1,
    color: Colors.primary600,
  },
  routineTitle: {
    ...Typography.heading,
    color: Colors.textPrimary,
  },
  plantIllustration: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantEmoji: {
    fontSize: 52,
  },

  /* Streak badge */
  streakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary600,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  streakBadgeText: {
    ...Typography.caption1,
    color: Colors.textInverse,
  },

  /* Water gauge */
  waterGauge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  waterIcon: { fontSize: 14 },
  waterBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary100,
    overflow: 'hidden',
  },
  waterBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary500,
  },
  waterCount: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    minWidth: 52,
    textAlign: 'right',
  },

  /* Card footer */
  mainCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  plantStateLabel: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  plantStateName: {
    ...Typography.caption1,
    color: Colors.textPrimary,
  },
  detailLink: {
    ...Typography.caption1,
    color: Colors.primary600,
  },

  /* Add topic card */
  addTopicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: Spacing.xl,
  },
  addTopicPlus: {
    fontSize: 22,
    color: Colors.textTertiary,
    width: 32,
    textAlign: 'center',
  },
  addTopicTitle: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  addTopicSub: {
    ...Typography.caption2,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  sectionAction: {
    ...Typography.caption1,
    color: Colors.primary600,
  },

  /* Package cards */
  packageRow: {
    gap: Spacing.md,
    paddingRight: Spacing.base,
    marginBottom: Spacing.xl,
  },
  packageCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    width: 90,
  },
  packageIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  packageIcon: { fontSize: 30 },
  packageTitle: {
    ...Typography.caption1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  /* Login banner */
  bannerWrap: { marginBottom: Spacing.base },
});
