import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Routine } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { formatDuration } from '../utils/dateUtils';
import { DIFFICULTY_LABELS } from '../constants';
import Badge from './Badge';

interface Props {
  routine: Routine;
  isCompleted?: boolean;
  onPress: () => void;
}

export default function RoutineCard({ routine, isCompleted = false, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.left}>
        <View style={[styles.checkCircle, isCompleted && styles.checkCircleCompleted]}>
          {isCompleted && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={1}
        >
          {routine.title}
        </Text>
        {routine.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {routine.description}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.duration}>{formatDuration(routine.durationMin)}</Text>
          <Badge
            label={DIFFICULTY_LABELS[routine.difficulty] ?? routine.difficulty}
            variant="muted"
            style={styles.badge}
          />
        </View>
      </View>

      {routine.youtubeUrl ? (
        <View style={styles.youtubeDot}>
          <Text style={styles.youtubeDotText}>▷</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  cardCompleted: {
    backgroundColor: Colors.completedFill,
    borderColor: Colors.primary200,
  },
  left: {
    flexShrink: 0,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: Colors.primary500,
    borderColor: Colors.primary500,
  },
  checkMark: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  titleCompleted: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  description: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  duration: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  youtubeDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  youtubeDotText: {
    fontSize: 12,
    color: Colors.primary600,
  },
});
