import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../theme';

type Variant = 'primary' | 'success' | 'warning' | 'muted' | 'outline';

interface Props {
  label: string;
  variant?: Variant;
  style?: ViewStyle;
}

export default function Badge({ label, variant = 'primary', style }: Props) {
  return (
    <View style={[styles.base, variantStyles[variant].container, style]}>
      <Text style={[styles.label, variantStyles[variant].label]}>{label}</Text>
    </View>
  );
}

const variantStyles: Record<Variant, { container: ViewStyle; label: object }> = {
  primary: {
    container: { backgroundColor: Colors.primary100 },
    label: { color: Colors.primary600 },
  },
  success: {
    container: { backgroundColor: Colors.completedFill },
    label: { color: Colors.success },
  },
  warning: {
    container: { backgroundColor: '#FDF3E3' },
    label: { color: Colors.warning },
  },
  muted: {
    container: { backgroundColor: Colors.mutedFill },
    label: { color: Colors.textSecondary },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    label: { color: Colors.textSecondary },
  },
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption1,
  },
});
