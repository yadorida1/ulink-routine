import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  dayLabel: string;        // e.g. '월'
  dateLabel: string;       // e.g. '14'
  isToday: boolean;
  completedCount: number;
  totalCount: number;
  onPress?: () => void;
}

export default function RoutineDayItem({
  dayLabel,
  dateLabel,
  isToday,
  completedCount,
  totalCount,
  onPress,
}: Props) {
  const allDone = totalCount > 0 && completedCount === totalCount;
  const partial = completedCount > 0 && completedCount < totalCount;
  const hasRoutines = totalCount > 0;

  return (
    <TouchableOpacity
      style={[styles.row, isToday && styles.rowToday]}
      onPress={onPress}
      activeOpacity={onPress ? 0.75 : 1}
      disabled={!onPress}
    >
      {/* Day label */}
      <View style={styles.dayBlock}>
        <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{dayLabel}</Text>
        <Text style={[styles.dateText, isToday && styles.dateTextToday]}>{dateLabel}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.barContainer}>
        {hasRoutines ? (
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                allDone && styles.barFillComplete,
                partial && styles.barFillPartial,
                { width: `${(completedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        ) : (
          <Text style={styles.noRoutineText}>루틴 없음</Text>
        )}
      </View>

      {/* Count */}
      {hasRoutines && (
        <Text style={[styles.countText, allDone && styles.countTextDone]}>
          {completedCount}/{totalCount}
        </Text>
      )}

      {/* Status dot */}
      <View
        style={[
          styles.statusDot,
          allDone && styles.statusDotDone,
          partial && styles.statusDotPartial,
          !hasRoutines && styles.statusDotEmpty,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  rowToday: {
    borderColor: Colors.primary400,
    backgroundColor: Colors.primary100,
  },
  dayBlock: {
    width: 36,
    alignItems: 'center',
    gap: 1,
  },
  dayText: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  dayTextToday: {
    color: Colors.primary600,
  },
  dateText: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  dateTextToday: {
    color: Colors.primary600,
    fontWeight: '700',
  },
  barContainer: {
    flex: 1,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  barFillPartial: {
    backgroundColor: Colors.warning,
  },
  barFillComplete: {
    backgroundColor: Colors.primary500,
  },
  noRoutineText: {
    ...Typography.caption2,
    color: Colors.textTertiary,
  },
  countText: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    width: 30,
    textAlign: 'right',
  },
  countTextDone: {
    color: Colors.primary600,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  statusDotPartial: {
    backgroundColor: Colors.warning,
  },
  statusDotDone: {
    backgroundColor: Colors.success,
  },
  statusDotEmpty: {
    backgroundColor: Colors.borderLight,
  },
});
