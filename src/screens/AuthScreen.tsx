import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { APP_NAME_KO, APP_TAGLINE } from '../constants';
import { signInWithApple, signInWithGoogle } from '../services/firebase/auth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AuthScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);

  const handleApple = async () => {
    setLoading('apple');
    try {
      const result = await signInWithApple();
      if (result.success) {
        navigation.navigate('Main', { screen: 'Home' } as never);
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
        navigation.navigate('Main', { screen: 'Home' } as never);
      }
    } finally {
      setLoading(null);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Main', { screen: 'Home' } as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>🌿</Text>
          </View>
          <Text style={styles.appName}>{APP_NAME_KO}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        </View>

        {/* Sign in area */}
        <View style={styles.authSection}>
          <Text style={styles.authPrompt}>로그인하고 루틴을 시작하세요</Text>

          {/* Apple Sign In */}
          <TouchableOpacity
            style={[styles.appleBtn, loading === 'apple' && styles.btnDisabled]}
            onPress={handleApple}
            disabled={loading !== null}
            activeOpacity={0.88}
          >
            <Text style={styles.appleBtnIcon}></Text>
            <Text style={styles.appleBtnText}>
              {loading === 'apple' ? '처리 중...' : 'Apple로 계속하기'}
            </Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.googleBtn, loading === 'google' && styles.btnDisabled]}
            onPress={handleGoogle}
            disabled={loading !== null}
            activeOpacity={0.88}
          >
            <Text style={styles.googleBtnIcon}>G</Text>
            <Text style={styles.googleBtnText}>
              {loading === 'google' ? '처리 중...' : 'Google로 계속하기'}
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipText}>지금은 넘어가기</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            계속하면{' '}
            <Text style={styles.legalLink}>서비스 이용약관</Text>
            {' '}및{' '}
            <Text style={styles.legalLink}>개인정보 처리방침</Text>
            에 동의하게 됩니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxl,
  },
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: Colors.primary500,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary600,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: Spacing.sm,
  },
  iconEmoji: { fontSize: 44 },
  appName: {
    ...Typography.title1,
    color: Colors.textPrimary,
  },
  tagline: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  authSection: {
    gap: Spacing.md,
  },
  authPrompt: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
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
    fontSize: 20,
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
  btnDisabled: { opacity: 0.55 },
  skipBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  skipText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  legalSection: {
    paddingTop: Spacing.base,
  },
  legalText: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: Colors.primary600,
    textDecorationLine: 'underline',
  },
});
