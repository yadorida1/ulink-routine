import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useRoutines } from '../hooks/useRoutines';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { useUserState } from '../hooks/useUserState';
import { getGreeting } from '../utils/dateUtils';
import { mockRecommendedPackages } from '../data/mockData';
import PlantStatusCard from '../components/PlantStatusCard';
import RoutineCard from '../components/RoutineCard';
import LoginBanner from '../components/LoginBanner';
import SectionTitle from '../components/SectionTitle';
import Badge from '../components/Badge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { plant } = usePlantProgress();
  const { todayRoutines, isRoutineCompleted } = useRoutines();
  const { userState, isGuest, canAddTopic } = useUserState();
  const [loginBannerDismissed, setLoginBannerDismissed] = useState(false);

  const greeting = getGreeting();
  const displayName = userState.displayName ?? '사용자';
  const completedCount = todayRoutines.filter(r =>
    isRoutineCompleted(r.id, new Date().toISOString().slice(0, 10)),
  ).length;

  const handleAddTopic = () => {
    const action = canAddTopic();
    if (action === 'needs_login') {
      navigation.navigate('LoginPromptSheet', { trigger: 'addTopic' });
    } else if (action === 'needs_premium') {
      navigation.navigate('Premium');
    }
    // 'allowed' → navigate to topic creation (future screen)
  };

  const handleRoutinePress = (routineId: string) => {
    navigation.navigate('Play', { routineId });
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
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>
              {isGuest ? '오늘도 루틴을 시작해요' : `${displayName}님, 오늘도 화이팅`}
            </Text>
          </View>
          {isGuest && (
            <Badge label="게스트" variant="muted" />
          )}
        </View>

        {/* Plant status */}
        <View style={styles.section}>
          <PlantStatusCard plant={plant} />
        </View>

        {/* Today's routines */}
        <View style={styles.section}>
          <SectionTitle
            title="오늘의 루틴"
            actionLabel="전체 보기"
            onAction={() => navigation.navigate('Main', { screen: 'RoutineList' } as never)}
          />
          {todayRoutines.length > 0 ? (
            <>
              <View style={styles.progressSummary}>
                <Text style={styles.progressText}>
                  {completedCount}/{todayRoutines.length}개 완료
                </Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${todayRoutines.length > 0 ? (completedCount / todayRoutines.length) * 100 : 0}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              {todayRoutines.map(routine => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  isCompleted={isRoutineCompleted(
                    routine.id,
                    new Date().toISOString().slice(0, 10),
                  )}
                  onPress={() => handleRoutinePress(routine.id)}
                />
              ))}
            </>
          ) : (
            <View style={styles.emptyRoutine}>
              <Text style={styles.emptyRoutineText}>오늘 예정된 루틴이 없어요</Text>
            </View>
          )}
        </View>

        {/* Add topic CTA */}
        <TouchableOpacity style={styles.addTopicCard} onPress={handleAddTopic} activeOpacity={0.85}>
          <View style={styles.addTopicLeft}>
            <Text style={styles.addTopicIcon}>＋</Text>
            <View>
              <Text style={styles.addTopicTitle}>새 토픽 추가</Text>
              <Text style={styles.addTopicSub}>다른 영역의 루틴도 관리해요</Text>
            </View>
          </View>
          {!isGuest && userState.subscriptionStatus === 'free' && (
            <Badge label="프리미엄" variant="primary" />
          )}
        </TouchableOpacity>

        {/* Recommended packages */}
        <View style={styles.section}>
          <SectionTitle
            title="추천 루틴 패키지"
            actionLabel="더 보기"
            onAction={() => navigation.navigate('Premium')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packageScroll}
          >
            {mockRecommendedPackages.map(pkg => (
              <TouchableOpacity
                key={pkg.id}
                style={styles.packageCard}
                onPress={() => navigation.navigate('Premium')}
                activeOpacity={0.85}
              >
                <Text style={styles.packageEmoji}>{pkg.emoji}</Text>
                <Text style={styles.packageTitle}>{pkg.title}</Text>
                <Text style={styles.packageDesc} numberOfLines={2}>{pkg.description}</Text>
                <View style={styles.packageMeta}>
                  <Text style={styles.packageDuration}>{pkg.durationMin}분</Text>
                  <Badge label="프리미엄" variant="primary" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Login banner (for guests who haven't dismissed it) */}
        {isGuest && !loginBannerDismissed && (
          <View style={styles.section}>
            <LoginBanner
              onPress={() => navigation.navigate('LoginPromptSheet', { trigger: 'progress' })}
              onDismiss={() => setLoginBannerDismissed(true)}
            />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  name: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  progressText: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    width: 60,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.primary500,
  },
  emptyRoutine: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyRoutineText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  addTopicCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: Spacing.xl,
  },
  addTopicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  addTopicIcon: {
    fontSize: 20,
    color: Colors.primary500,
    width: 36,
    textAlign: 'center',
  },
  addTopicTitle: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  addTopicSub: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  packageScroll: {
    gap: Spacing.md,
    paddingRight: Spacing.base,
  },
  packageCard: {
    width: 180,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  packageEmoji: {
    fontSize: 28,
  },
  packageTitle: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  packageDesc: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  packageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  packageDuration: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: Spacing.xxl,
  },
});
