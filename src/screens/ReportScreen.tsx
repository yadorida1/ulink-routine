import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useRoutines } from '../hooks/useRoutines';
import { usePlantProgress } from '../hooks/usePlantProgress';
import {
  getWeekDates,
  formatWeekRangeKo,
  formatDate,
  isToday,
  getDayOfWeekKo,
} from '../utils/dateUtils';
import PlantStatusCard from '../components/PlantStatusCard';
import ProgressCard from '../components/ProgressCard';

type Period = 'weekly' | 'monthly' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  weekly: '이번 주',
  monthly: '이번 달',
  all: '전체',
};

export default function ReportScreen() {
  const [period, setPeriod] = useState<Period>('weekly');
  const { routines, progress, isRoutineCompleted } = useRoutines();
  const { plant } = usePlantProgress();

  const weekDates = useMemo(() => getWeekDates(), []);
  const weekRangeLabel = useMemo(() => formatWeekRangeKo(), []);

  const weekStats = useMemo(() => {
    let completed = 0;
    let total = 0;
    const completedDates: string[] = [];

    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const scheduled = routines.filter(r => r.isActive && r.scheduledDays.includes(dayOfWeek));
      total += scheduled.length;

      const dayCompleted = scheduled.filter(r => isRoutineCompleted(r.id, dateStr)).length;
      completed += dayCompleted;

      if (dayCompleted === scheduled.length && scheduled.length > 0) {
        completedDates.push(dateStr);
      }
    });

    return {
      completed,
      total,
      rate: total > 0 ? completed / total : 0,
      completedDates,
    };
  }, [weekDates, routines, progress]);

  const successPercent = Math.round(weekStats.rate * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>리포트</Text>
          <Text style={styles.subtitle}>{weekRangeLabel}</Text>
        </View>

        {/* Period selector */}
        <View style={styles.segmentControl}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.segmentItem, period === p && styles.segmentItemActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  period === p ? styles.segmentLabelActive : styles.segmentLabelInactive,
                ]}
              >
                {PERIOD_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Success rate card */}
        <View style={styles.rateCard}>
          <View style={styles.rateCircleWrapper}>
            <View style={styles.rateCircle}>
              <Text style={styles.ratePercent}>{successPercent}%</Text>
              <Text style={styles.rateLabel}>성공률</Text>
            </View>
          </View>
          <View style={styles.rateDetails}>
            <View style={styles.rateRow}>
              <Text style={styles.rateDetailLabel}>완료</Text>
              <Text style={styles.rateDetailValue}>{weekStats.completed}회</Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateDetailLabel}>전체</Text>
              <Text style={styles.rateDetailValue}>{weekStats.total}회</Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateDetailLabel}>연속</Text>
              <Text style={[styles.rateDetailValue, { color: Colors.primary600 }]}>
                {plant.streak}일
              </Text>
            </View>
          </View>
        </View>

        {/* Progress cards row */}
        <View style={styles.progressRow}>
          <ProgressCard
            label="완료 루틴"
            value={weekStats.completed}
            subLabel="이번 주"
            tintColor={Colors.primary600}
          />
          <ProgressCard
            label="연속 달성"
            value={`${plant.streak}일`}
            subLabel="현재 스트릭"
            tintColor={Colors.warning}
          />
          <ProgressCard
            label="이번 주 성공"
            value={`${weekStats.completedDates.length}일`}
            tintColor={Colors.success}
          />
        </View>

        {/* Week calendar dots */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>요일별 현황</Text>
          <View style={styles.calendarRow}>
            {weekDates.map(date => {
              const dateStr = formatDate(date);
              const today = isToday(dateStr);
              const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
              const scheduled = routines.filter(r => r.isActive && r.scheduledDays.includes(dayOfWeek));
              const completedCount = scheduled.filter(r => isRoutineCompleted(r.id, dateStr)).length;
              const allDone = scheduled.length > 0 && completedCount === scheduled.length;
              const partial = completedCount > 0 && completedCount < scheduled.length;

              return (
                <View key={dateStr} style={styles.calendarDay}>
                  <Text style={[styles.calendarDayLabel, today && styles.calendarDayLabelToday]}>
                    {getDayOfWeekKo(date)}
                  </Text>
                  <View
                    style={[
                      styles.calendarDot,
                      allDone && styles.calendarDotDone,
                      partial && styles.calendarDotPartial,
                      today && styles.calendarDotToday,
                    ]}
                  >
                    {allDone && <Text style={styles.calendarDotCheck}>✓</Text>}
                  </View>
                  <Text style={[styles.calendarDateNum, today && { color: Colors.primary600 }]}>
                    {date.getDate()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* AI comment placeholder */}
        <View style={styles.aiCommentCard}>
          <View style={styles.aiCommentHeader}>
            <Text style={styles.aiCommentBadge}>AI 코멘트</Text>
            <Text style={styles.aiCommentBadgeNote}>곧 출시 예정</Text>
          </View>
          <Text style={styles.aiCommentText}>
            이번 주 루틴 흐름이 안정적이에요. 꾸준한 아침 루틴이 하루의 리듬을 만들고 있어요.
            내일도 같은 시간에 시작해 보세요.
          </Text>
          <View style={styles.aiCommentOverlay}>
            <Text style={styles.aiCommentOverlayText}>프리미엄에서 실제 AI 코멘트를 확인하세요</Text>
          </View>
        </View>

        {/* Plant growth summary */}
        <View style={styles.plantSection}>
          <Text style={styles.sectionTitle}>식물 현황</Text>
          <PlantStatusCard plant={plant} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingTop: Spacing.xl },
  header: { marginBottom: Spacing.xl, gap: 4 },
  title: { ...Typography.title2, color: Colors.textPrimary },
  subtitle: { ...Typography.caption1, color: Colors.textSecondary },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: Colors.mutedFill,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  segmentItemActive: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: { ...Typography.caption1 },
  segmentLabelActive: { color: Colors.textPrimary },
  segmentLabelInactive: { color: Colors.textSecondary },
  rateCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
    gap: Spacing.xl,
  },
  rateCircleWrapper: { alignItems: 'center', justifyContent: 'center' },
  rateCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: Colors.primary300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary100,
  },
  ratePercent: { ...Typography.title2, color: Colors.primary600 },
  rateLabel: { ...Typography.caption2, color: Colors.textSecondary },
  rateDetails: { flex: 1, gap: Spacing.sm },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rateDetailLabel: { ...Typography.body2, color: Colors.textSecondary },
  rateDetailValue: { ...Typography.body1, color: Colors.textPrimary },
  progressRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  calendarSection: { marginBottom: Spacing.xl, gap: Spacing.md },
  sectionTitle: { ...Typography.caption1, color: Colors.textSecondary },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calendarDay: { alignItems: 'center', gap: Spacing.xs },
  calendarDayLabel: { ...Typography.caption2, color: Colors.textSecondary },
  calendarDayLabelToday: { color: Colors.primary600 },
  calendarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.mutedFill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calendarDotDone: { backgroundColor: Colors.primary500, borderColor: Colors.primary500 },
  calendarDotPartial: { backgroundColor: '#FDF3E3', borderColor: Colors.warning },
  calendarDotToday: { borderColor: Colors.primary400 },
  calendarDotCheck: { color: Colors.textInverse, fontSize: 13, fontWeight: '700' },
  calendarDateNum: { ...Typography.caption2, color: Colors.textSecondary },
  aiCommentCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  aiCommentHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  aiCommentBadge: { ...Typography.caption1, color: Colors.primary600 },
  aiCommentBadgeNote: { ...Typography.caption2, color: Colors.textTertiary },
  aiCommentText: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 22, opacity: 0.4 },
  aiCommentOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(247,250,249,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
  },
  aiCommentOverlayText: { ...Typography.caption1, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.base },
  plantSection: { gap: Spacing.sm, marginBottom: Spacing.xl },
  bottomSpacer: { height: Spacing.xxl },
});
