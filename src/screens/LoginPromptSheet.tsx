import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { signInWithApple, signInWithGoogle } from '../services/firebase/auth';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'LoginPromptSheet'>;

const TRIGGER_COPY: Record<string, { title: string; body: string }> = {
  addTopic: {
    title: '로그인이 필요해요',
    body: '토픽을 추가하려면 먼저 로그인해 주세요.\n로그인하면 루틴 기록도 안전하게 보관돼요.',
  },
  progress: {
    title: '기록을 저장하세요',
    body: '지금까지의 루틴 기록을\n로그인하면 언제든 다시 불러올 수 있어요.',
  },
  general: {
    title: '계속하려면 로그인하세요',
    body: '로그인하면 모든 기기에서\n루틴을 이어갈 수 있어요.',
  },
};

export default function LoginPromptSheet() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const trigger = route.params?.trigger ?? 'general';

  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);
  const copy = TRIGGER_COPY[trigger] ?? TRIGGER_COPY.general;

  const handleApple = async () => {
    setLoading('apple');
    try {
      const result = await signInWithApple();
      if (result.success) {
        navigation.goBack();
        // INTEGRATION POINT: call useUserState.signIn(result.userId!, result.displayName, result.email)
        // This requires lifting state or using a context/store
      }
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setLoading('google');
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigation.goBack();
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Drag handle */}
      <View style={styles.handleRow}>
        <View style={styles.handle} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>🌿</Text>
        </View>

        {/* Copy */}
        <View style={styles.copySection}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.body}>{copy.body}</Text>
        </View>

        {/* Sign in buttons */}
        <View style={styles.buttons}>
          {/* Apple Sign In */}
          <TouchableOpacity
            style={[styles.appleBtn, loading === 'apple' && styles.btnLoading]}
            onPress={handleApple}
            disabled={loading !== null}
            activeOpacity={0.85}
          >
            <Text style={styles.appleBtnIcon}></Text>
            <Text style={styles.appleBtnText}>
              {loading === 'apple' ? '로그인 중...' : 'Apple로 로그인'}
            </Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.googleBtn, loading === 'google' && styles.btnLoading]}
            onPress={handleGoogle}
            disabled={loading !== null}
            activeOpacity={0.85}
          >
            <Text style={styles.googleBtnIcon}>G</Text>
            <Text style={styles.googleBtnText}>
              {loading === 'google' ? '로그인 중...' : 'Google로 로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Later */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.laterBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.laterText}>나중에 할게요</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    gap: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  icon: { fontSize: 32 },
  copySection: { alignItems: 'center', gap: Spacing.sm },
  title: {
    ...Typography.heading,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttons: {
    width: '100%',
    gap: Spacing.sm,
  },
  appleBtn: {
    height: ButtonHeight.primary,
    backgroundColor: '#000000',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  appleBtnIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  appleBtnText: {
    ...Typography.body1,
    color: '#FFFFFF',
  },
  googleBtn: {
    height: ButtonHeight.primary,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  googleBtnIcon: {
    fontSize: 18,
    color: '#4285F4',
    fontWeight: '700',
  },
  googleBtnText: {
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  btnLoading: {
    opacity: 0.6,
  },
  laterBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  laterText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
