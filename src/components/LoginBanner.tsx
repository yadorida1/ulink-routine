import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

interface Props {
  onPress: () => void;
  onDismiss?: () => void;
}

export default function LoginBanner({ onPress, onDismiss }: Props) {
  return (
    <View style={styles.banner}>
      <View style={styles.left}>
        <Text style={styles.title}>진행 상황을 저장하세요</Text>
        <Text style={styles.body}>로그인하면 루틴 기록이 안전하게 보관돼요</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onPress} style={styles.loginBtn} activeOpacity={0.8}>
          <Text style={styles.loginBtnText}>로그인</Text>
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} activeOpacity={0.7}>
            <Text style={styles.dismiss}>나중에</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.primary100,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.primary200,
    gap: Spacing.md,
  },
  left: {
    flex: 1,
    gap: 3,
  },
  title: {
    ...Typography.caption1,
    color: Colors.primary700,
  },
  body: {
    ...Typography.caption2,
    color: Colors.primary600,
  },
  actions: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  loginBtn: {
    backgroundColor: Colors.primary600,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  loginBtnText: {
    ...Typography.caption1,
    color: Colors.textInverse,
  },
  dismiss: {
    ...Typography.caption2,
    color: Colors.primary600,
  },
});
