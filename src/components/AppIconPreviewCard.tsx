import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

// Preview-only component — shows what the app icon looks like
// Actual icon is generated from src/assets/icon.png via Expo

export default function AppIconPreviewCard() {
  return (
    <View style={styles.wrapper}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          {/* Soft leaf + link motif */}
          <View style={styles.leafShape}>
            <Text style={styles.leafEmoji}>🌿</Text>
          </View>
          <View style={styles.linkDot} />
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.appName}>ULink Routine</Text>
        <Text style={styles.tagline}>링크로 만드는 습관 관리</Text>
      </View>

      <View style={styles.sizes}>
        <Text style={styles.sizesLabel}>앱 아이콘 미리보기</Text>
        <View style={styles.sizeRow}>
          {[60, 44, 29].map(size => (
            <View key={size} style={[styles.miniIcon, { width: size, height: size, borderRadius: size * 0.22 }]}>
              <Text style={{ fontSize: size * 0.4 }}>🌿</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.base,
  },
  iconContainer: {
    shadowColor: Colors.primary600,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: Colors.primary500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafShape: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafEmoji: {
    fontSize: 44,
  },
  linkDot: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.surface,
    opacity: 0.85,
  },
  meta: {
    alignItems: 'center',
    gap: 4,
  },
  appName: {
    ...Typography.heading,
    color: Colors.textPrimary,
  },
  tagline: {
    ...Typography.caption1,
    color: Colors.textSecondary,
  },
  sizes: {
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sizesLabel: {
    ...Typography.caption2,
    color: Colors.textTertiary,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  miniIcon: {
    backgroundColor: Colors.primary500,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
