import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlantProgress } from '../types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import {
  getPlantEmoji,
  getPlantStageLabel,
  getPlantStateMessage,
  getVitalityColor,
} from '../utils/plantUtils';

interface Props {
  plant: PlantProgress;
  compact?: boolean;
}

export default function PlantStatusCard({ plant, compact = false }: Props) {
  const emoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);
  const message = getPlantStateMessage(plant);
  const vitalityColor = getVitalityColor(plant.vitality);

  if (compact) {
    return (
      <View style={styles.compact}>
        <Text style={styles.compactEmoji}>{emoji}</Text>
        <View style={styles.compactInfo}>
          <Text style={styles.compactStage}>{stageLabel}</Text>
          <View style={styles.vitalityBarTrack}>
            <View
              style={[
                styles.vitalityBarFill,
                { width: `${plant.vitality}%`, backgroundColor: vitalityColor },
              ]}
            />
          </View>
        </View>
        <Text style={styles.compactStreak}>{plant.streak}일 연속</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.stagRow}>
            <Text style={styles.stageLabel}>{stageLabel}</Text>
            <Text style={styles.streakText}>{plant.streak}일 연속</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>

      {/* Vitality bar */}
      <View style={styles.vitalitySection}>
        <View style={styles.vitalityHeader}>
          <Text style={styles.vitalityLabel}>활력</Text>
          <Text style={[styles.vitalityValue, { color: vitalityColor }]}>
            {plant.vitality}%
          </Text>
        </View>
        <View style={styles.vitalityBarTrackFull}>
          <View
            style={[
              styles.vitalityBarFillFull,
              { width: `${plant.vitality}%`, backgroundColor: vitalityColor },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.mutedFill,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  stagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageLabel: {
    ...Typography.caption1,
    color: Colors.primary600,
  },
  streakText: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
  message: {
    ...Typography.body2,
    color: Colors.textPrimary,
  },
  vitalitySection: {
    gap: Spacing.xs,
  },
  vitalityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vitalityLabel: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  vitalityValue: {
    ...Typography.caption1,
  },
  vitalityBarTrackFull: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  vitalityBarFillFull: {
    height: '100%',
    borderRadius: 3,
  },
  // Compact styles
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.mutedFill,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  compactEmoji: {
    fontSize: 18,
  },
  compactInfo: {
    flex: 1,
    gap: 3,
  },
  compactStage: {
    ...Typography.caption1,
    color: Colors.primary600,
  },
  vitalityBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  vitalityBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  compactStreak: {
    ...Typography.caption2,
    color: Colors.textSecondary,
  },
});
