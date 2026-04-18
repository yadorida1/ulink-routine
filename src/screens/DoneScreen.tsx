import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { mockRoutines } from '../data/mockData';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { useRoutines } from '../hooks/useRoutines';
import { getToday } from '../utils/dateUtils';
import { PLANT_COMPLETION_MESSAGES } from '../constants';
import { getPlantEmoji } from '../utils/plantUtils';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Done'>;

export default function DoneScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { routineId } = route.params;

  const { plant, onRoutineCompleted } = usePlantProgress();
  const { markComplete } = useRoutines();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const routine = mockRoutines.find(r => r.id === routineId);
  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const completionMessage = PLANT_COMPLETION_MESSAGES[plant.streak % PLANT_COMPLETION_MESSAGES.length];

  useEffect(() => {
    markComplete(routineId);
    onRoutineCompleted();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Plant feedback — calm, not flashy */}
        <View style={styles.plantSection}>
          <Text style={styles.plantEmoji}>{plantEmoji}</Text>
          <Text style={styles.plantMessage}>{completionMessage}</Text>
          <View style={styles.vitalityRow}>
            <Text style={styles.vitalityLabel}>활력</Text>
            <View style={styles.vitalityTrack}>
              <View style={[styles.vitalityFill, { width: `${plant.vitality}%` }]} />
            </View>
            <Text style={styles.vitalityValue}>{plant.vitality}%</Text>
          </View>
        </View>

        {/* Completion info */}
        <View style={styles.infoSection}>
          {routine && (
            <Text style={styles.routineTitle}>{routine.title}</Text>
          )}
          <Text style={styles.completedLabel}>완료</Text>

          {/* Streak */}
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>{plant.streak}일 연속</Text>
              <Text style={styles.streakSub}>오늘도 루틴을 지켰어요</Text>
            </View>
          </View>
        </View>

        {/* CTAs */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Report' } as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>리포트 보기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Home' } as never)}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryBtnText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  plantSection: {
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.mutedFill,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  plantEmoji: {
    fontSize: 56,
  },
  plantMessage: {
    ...Typography.body1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  vitalityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    paddingTop: Spacing.sm,
  },
  vitalityLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    width: 28,
  },
  vitalityTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  vitalityFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary500,
  },
  vitalityValue: {
    ...Typography.caption1,
    color: Colors.primary600,
    width: 32,
    textAlign: 'right',
  },
  infoSection: {
    alignItems: 'center',
    gap: Spacing.base,
  },
  routineTitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  completedLabel: {
    ...Typography.title1,
    color: Colors.textPrimary,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakValue: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  streakSub: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  actions: {
    gap: Spacing.sm,
  },
  primaryBtn: {
    height: ButtonHeight.primary,
    backgroundColor: Colors.primary600,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    ...Typography.body1,
    color: Colors.textInverse,
  },
  secondaryBtn: {
    height: ButtonHeight.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
