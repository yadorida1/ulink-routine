import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useRoutines } from '../hooks/useRoutines';
import { usePlantProgress } from '../hooks/usePlantProgress';
import {
  getWeekDates,
  formatWeekRangeKo,
  getDayOfWeekKo,
  formatDate,
  isToday,
} from '../utils/dateUtils';
import { WEEK_DAYS_KO } from '../constants';
import RoutineDayItem from '../components/RoutineDayItem';
import PlantStatusCard from '../components/PlantStatusCard';
import Badge from '../components/Badge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function RoutineListScreen() {
  const navigation = useNavigation<Nav>();
  const { routines, progress, isRoutineCompleted } = useRoutines();
  const { plant } = usePlantProgress();

  const weekDates = useMemo(() => getWeekDates(), []);
  const weekRangeLabel = useMemo(() => formatWeekRangeKo(), []);

  const getDayStats = (date: Date) => {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const scheduledRoutines = routines.filter(
      r => r.isActive && r.scheduledDays.includes(dayOfWeek),
    );
    const completed = scheduledRoutines.filter(r => isRoutineCompleted(r.id, dateStr)).length;
    return { total: scheduledRoutines.length, completed };
  };

  const weekStats = useMemo(() => {
    const completed = weekDates.reduce((acc, d) => {
      const s = getDayStats(d);
      return acc + s.completed;
    }, 0);
    const total = weekDates.reduce((acc, d) => {
      const s = getDayStats(d);
      return acc + s.total;
    }, 0);
    return { completed, total, rate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [weekDates, routines, progress]);

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
            <Text style={styles.weekRange}>{weekRangeLabel}</Text>
            <Text style={styles.title}>이번 주</Text>
          </View>
          <View style={styles.headerRight}>
            <Badge label={`${plant.streak}일 연속`} variant="primary" />
            <Text style={styles.weekRate}>{weekStats.rate}%</Text>
          </View>
        </View>

        {/* Weekly progress summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weekStats.completed}</Text>
              <Text style={styles.summaryLabel}>완료</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weekStats.total}</Text>
              <Text style={styles.summaryLabel}>전체</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: Colors.primary600 }]}>
                {weekStats.rate}%
              </Text>
              <Text style={styles.summaryLabel}>성공률</Text>
            </View>
          </View>
          <View style={styles.summaryBarTrack}>
            <View
              style={[styles.summaryBarFill, { width: `${weekStats.rate}%` }]}
            />
          </View>
        </View>

        {/* Day list */}
        <View style={styles.dayList}>
          {weekDates.map(date => {
            const dateStr = formatDate(date);
            const dayKo = getDayOfWeekKo(date);
            const today = isToday(dateStr);
            const stats = getDayStats(date);

            return (
              <RoutineDayItem
                key={dateStr}
                dayLabel={dayKo}
                dateLabel={String(date.getDate())}
                isToday={today}
                completedCount={stats.completed}
                totalCount={stats.total}
                onPress={
                  today
                    ? () => navigation.navigate('Main', { screen: 'Home' } as never)
                    : undefined
                }
              />
            );
          })}
        </View>

        {/* Compact plant summary */}
        <View style={styles.plantSection}>
          <Text style={styles.plantSectionLabel}>식물 현황</Text>
          <PlantStatusCard plant={plant} compact />
        </View>

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
  scroll: { flex: 1 },
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
  weekRange: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  title: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  weekRate: {
    ...Typography.heading,
    color: Colors.primary600,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  summaryValue: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  summaryLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  summaryBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  summaryBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.primary500,
  },
  dayList: {
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  plantSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  plantSectionLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  bottomSpacer: { height: Spacing.xxl },
});
