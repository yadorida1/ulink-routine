import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { useRoutines } from '../hooks/useRoutines';
import { usePlantProgress } from '../hooks/usePlantProgress';
import {
  getWeekDates,
  formatWeekRangeKo,
  formatDate,
  isToday,
  getDayOfWeekKo,
} from '../utils/dateUtils';
import { getPlantEmoji, getPlantStageLabel } from '../utils/plantUtils';
import { mockTopics, ACTIVE_TOPIC_ID, MONTHLY_TARGET_DAYS } from '../data/mockData';
import { Routine } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'RoutineList'>;

const WEEK_DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export default function RoutineListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const topicId = route.params?.topicId ?? ACTIVE_TOPIC_ID;

  const topic = mockTopics.find(t => t.id === topicId);
  const { routines, isRoutineCompleted, getTodayRoutines } = useRoutines(topicId);
  const { plant } = usePlantProgress();

  const weekDates = useMemo(() => getWeekDates(), []);
  const weekLabel = useMemo(() => formatWeekRangeKo(), []);

  // Find the primary routine for a given date
  const getRoutineForDate = (date: Date): Routine | null => {
    const day = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    return routines.find(r => r.isActive && r.scheduledDays.includes(day)) ?? null;
  };

  const todayRoutine = getTodayRoutines()[0] ?? null;

  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);
  const progressPct = plant.daysCompletedInCycle / MONTHLY_TARGET_DAYS;

  const completedThisWeek = weekDates.filter(date => {
    const r = getRoutineForDate(date);
    return r ? isRoutineCompleted(r.id, formatDate(date)) : false;
  }).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Navigation bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{topic?.name ?? '루틴 목록'}</Text>
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <Text style={styles.moreIcon}>•••</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Week navigation */}
        <View style={styles.weekNav}>
          <TouchableOpacity style={styles.weekArrow} activeOpacity={0.7}>
            <Text style={styles.weekArrowText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.weekLabel}>{weekLabel}</Text>
          <TouchableOpacity style={styles.weekArrow} activeOpacity={0.7}>
            <Text style={styles.weekArrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Day rows */}
        <View style={styles.dayList}>
          {weekDates.map(date => {
            const dateStr = formatDate(date);
            const today = isToday(dateStr);
            const dayKo = WEEK_DAYS_KO[date.getDay()];
            const routine = getRoutineForDate(date);
            const completed = routine ? isRoutineCompleted(routine.id, dateStr) : false;
            const isRest = !routine;

            return (
              <TouchableOpacity
                key={dateStr}
                style={[styles.dayRow, today && styles.dayRowToday]}
                onPress={() => routine && navigation.navigate('Play', { routineId: routine.id })}
                activeOpacity={routine ? 0.8 : 1}
                disabled={!routine}
              >
                {/* Day circle */}
                <View style={[
                  styles.dayCircle,
                  today && styles.dayCircleToday,
                  completed && styles.dayCircleCompleted,
                ]}>
                  <Text style={[
                    styles.dayCircleText,
                    (today || completed) && styles.dayCircleTextActive,
                  ]}>
                    {dayKo}
                  </Text>
                </View>

                {/* Routine info */}
                <View style={styles.routineInfo}>
                  {isRest ? (
                    <Text style={styles.restLabel}>휴식</Text>
                  ) : (
                    <>
                      <Text style={[styles.routineName, completed && styles.routineNameDone]}>
                        {routine!.title}
                      </Text>
                      <Text style={styles.routineDuration}>{routine!.durationMin}분</Text>
                    </>
                  )}
                </View>

                {/* Checkbox */}
                {!isRest && (
                  <View style={[styles.checkbox, completed && styles.checkboxDone]}>
                    {completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Plant weekly progress */}
        <View style={styles.plantProgress}>
          <View style={styles.plantProgressLeft}>
            <Text style={styles.plantProgressEmoji}>{plantEmoji}</Text>
            <View>
              <Text style={styles.plantProgressTitle}>식물 주 성장</Text>
              <Text style={styles.plantProgressSub}>{stageLabel} 단계</Text>
            </View>
          </View>
          <View style={styles.plantProgressRight}>
            <Text style={styles.plantProgressCount}>{completedThisWeek} / 7일</Text>
            <View style={styles.plantBarTrack}>
              <View style={[styles.plantBarFill, { width: `${(completedThisWeek / 7) * 100}%` }]} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaButton, !todayRoutine && styles.ctaButtonDisabled]}
          onPress={() => todayRoutine && navigation.navigate('Play', { routineId: todayRoutine.id })}
          disabled={!todayRoutine}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>
            {todayRoutine ? '오늘 루틴 시작하기' : '오늘 예정된 루틴 없음'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  /* Nav */
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backArrow: { ...Typography.heading, color: Colors.textPrimary },
  navTitle: { flex: 1, ...Typography.body1, color: Colors.textPrimary, textAlign: 'center' },
  moreBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  moreIcon: { ...Typography.caption1, color: Colors.textSecondary, letterSpacing: 2 },

  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.md },

  /* Week nav */
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  weekArrow: { padding: Spacing.sm },
  weekArrowText: { ...Typography.body1, color: Colors.textSecondary },
  weekLabel: { ...Typography.body2, color: Colors.textPrimary },

  /* Day list */
  dayList: { gap: Spacing.xs },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayRowToday: {
    borderColor: Colors.primary400,
    backgroundColor: Colors.primary100,
  },

  /* Day circle */
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mutedFill,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dayCircleToday: {
    backgroundColor: Colors.primary500,
    borderColor: Colors.primary500,
  },
  dayCircleCompleted: {
    backgroundColor: Colors.primary600,
    borderColor: Colors.primary600,
  },
  dayCircleText: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  dayCircleTextActive: {
    color: Colors.textInverse,
  },

  /* Routine info */
  routineInfo: { flex: 1, gap: 2 },
  routineName: { ...Typography.body2, color: Colors.textPrimary },
  routineNameDone: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  routineDuration: { ...Typography.caption2, color: Colors.textSecondary },
  restLabel: { ...Typography.body2, color: Colors.textTertiary },

  /* Checkbox */
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: Colors.primary500,
    borderColor: Colors.primary500,
  },
  checkmark: { color: Colors.textInverse, fontSize: 13, fontWeight: '700' },

  /* Plant progress */
  plantProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  plantProgressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  plantProgressEmoji: { fontSize: 28 },
  plantProgressTitle: { ...Typography.caption1, color: Colors.textPrimary },
  plantProgressSub: { ...Typography.caption2, color: Colors.textSecondary, marginTop: 2 },
  plantProgressRight: { flex: 1, gap: Spacing.xs },
  plantProgressCount: { ...Typography.caption1, color: Colors.primary600, textAlign: 'right' },
  plantBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  plantBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary500,
  },

  /* Footer */
  footer: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ctaButton: {
    height: ButtonHeight.primary,
    backgroundColor: Colors.primary600,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: { backgroundColor: Colors.textTertiary },
  ctaButtonText: { ...Typography.body1, color: Colors.textInverse },
});
