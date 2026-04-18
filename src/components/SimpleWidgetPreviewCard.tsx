import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

// Preview-only component — no actual native widget integration
// INTEGRATION POINT: For real widget support, use expo-widgets (iOS 16+) or
// react-native-widget-extension once those APIs stabilize for Expo managed workflow.

interface SmallWidgetProps {
  routineTitle: string;
  isCompleted: boolean;
  dayLabel: string;
}

export function SmallRoutineWidget({ routineTitle, isCompleted, dayLabel }: SmallWidgetProps) {
  return (
    <View style={styles.smallWidget}>
      <View style={styles.widgetHeader}>
        <Text style={styles.appName}>ULink</Text>
        <Text style={styles.dayLabel}>{dayLabel}</Text>
      </View>
      <View style={styles.smallContent}>
        <Text style={styles.smallRoutineTitle} numberOfLines={2}>
          {routineTitle}
        </Text>
        <View style={[styles.statusPill, isCompleted && styles.statusPillDone]}>
          <Text style={[styles.statusText, isCompleted && styles.statusTextDone]}>
            {isCompleted ? '완료' : '진행 중'}
          </Text>
        </View>
      </View>
    </View>
  );
}

interface MediumWidgetProps {
  weekDays: { label: string; completed: boolean }[];
  successRate: number;
}

export function MediumWeeklyWidget({ weekDays, successRate }: MediumWidgetProps) {
  return (
    <View style={styles.mediumWidget}>
      <View style={styles.widgetHeader}>
        <Text style={styles.appName}>ULink Routine</Text>
        <Text style={styles.weekLabel}>이번 주</Text>
      </View>
      <View style={styles.mediumContent}>
        <View style={styles.dayDots}>
          {weekDays.map((d, i) => (
            <View key={i} style={styles.dayDotItem}>
              <View style={[styles.dayDot, d.completed && styles.dayDotDone]} />
              <Text style={styles.dayDotLabel}>{d.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>성공률</Text>
          <Text style={styles.rateValue}>{Math.round(successRate * 100)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Small widget (2×2 grid unit)
  smallWidget: {
    width: 155,
    height: 155,
    backgroundColor: Colors.primary100,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    ...Typography.caption1,
    color: Colors.primary600,
  },
  dayLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  smallContent: {
    gap: Spacing.sm,
  },
  smallRoutineTitle: {
    ...Typography.body2,
    color: Colors.textPrimary,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusPillDone: {
    backgroundColor: Colors.completedFill,
    borderColor: Colors.primary300,
  },
  statusText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  statusTextDone: {
    color: Colors.primary600,
  },

  // Medium widget (4×2 grid unit)
  mediumWidget: {
    width: 329,
    height: 155,
    backgroundColor: Colors.primary100,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  weekLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  mediumContent: {
    gap: Spacing.md,
  },
  dayDots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dayDotItem: {
    alignItems: 'center',
    gap: 3,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
  },
  dayDotDone: {
    backgroundColor: Colors.primary500,
  },
  dayDotLabel: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  rateValue: {
    ...Typography.heading,
    color: Colors.primary600,
  },
});
