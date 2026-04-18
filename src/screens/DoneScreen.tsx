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
import { getPlantEmoji, getPlantStageLabel } from '../utils/plantUtils';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'Done'>;

export default function DoneScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const { routineId } = route.params;

  const { plant, onRoutineCompleted } = usePlantProgress();
  const { markComplete } = useRoutines();
  const routine = mockRoutines.find(r => r.id === routineId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);

  useEffect(() => {
    markComplete(routineId);
    onRoutineCompleted();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

        {/* Plant illustration */}
        <View style={styles.plantArea}>
          <View style={styles.plantCircle}>
            <Text style={styles.plantEmoji}>{plantEmoji}</Text>
          </View>
        </View>

        {/* Done message */}
        <View style={styles.messageArea}>
          <Text style={styles.doneTitle}>잘했어요! 🌱</Text>
          <Text style={styles.doneSubtitle}>오늘의 루틴을 완료했어요</Text>
        </View>

        {/* Plant state card */}
        <View style={styles.plantStateCard}>
          <Text style={styles.plantStateLabel}>식물 상태</Text>
          <View style={styles.plantStateRow}>
            <Text style={styles.plantStageName}>{stageLabel} 단계</Text>
            <Text style={styles.plantStreakDot}>•</Text>
            <Text style={styles.plantStreakText}>{plant.streak}일째</Text>
          </View>
          {/* Vitality bar */}
          <View style={styles.vitalityTrack}>
            <View style={[styles.vitalityFill, { width: `${plant.vitality}%` }]} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Report' } as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.reportBtnText}>리포트 보기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Home' } as never)}
            activeOpacity={0.75}
          >
            <Text style={styles.homeBtnText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.xl,
  },

  /* Plant */
  plantArea: { alignItems: 'center' },
  plantCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary200,
  },
  plantEmoji: { fontSize: 64 },

  /* Message */
  messageArea: { alignItems: 'center', gap: Spacing.sm },
  doneTitle: {
    ...Typography.title1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  doneSubtitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  /* Plant state card */
  plantStateCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  plantStateLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  plantStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  plantStageName: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  plantStreakDot: {
    ...Typography.body2,
    color: Colors.textTertiary,
  },
  plantStreakText: {
    ...Typography.body2,
    color: Colors.primary600,
  },
  vitalityTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary100,
    overflow: 'hidden',
  },
  vitalityFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary500,
  },

  /* Actions */
  actions: { gap: Spacing.sm },
  reportBtn: {
    height: ButtonHeight.primary,
    backgroundColor: Colors.primary600,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBtnText: { ...Typography.body1, color: Colors.textInverse },
  homeBtn: {
    height: ButtonHeight.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
