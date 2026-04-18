import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  label: string;
  value: string | number;
  subLabel?: string;
  tintColor?: string;
}

export default function ProgressCard({ label, value, subLabel, tintColor }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, tintColor ? { color: tintColor } : undefined]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
      {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 3,
    minHeight: 80,
  },
  value: {
    ...Typography.title2,
    color: Colors.primary600,
  },
  label: {
    ...Typography.caption1,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subLabel: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
