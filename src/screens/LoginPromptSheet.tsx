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

export default function LoginPromptSheet() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProps>();
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);

  const handleApple = async () => {
    setLoading('apple');
    try {
      const result = await signInWithApple();
      if (result.success) navigation.goBack();
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = async () => {
    setLoading('google');
    try {
      const result = await signInWithGoogle();
      if (result.success) navigation.goBack();
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Handle */}
      <View style={styles.handleRow}>
        <View style={styles.handle} />
      </View>

      <View style={styles.content}>
        {/* Plant illustration */}
        <View style={styles.plantWrap}>
          <Text style={styles.plantEmoji}>🌱</Text>
        </View>

        {/* Copy */}
        <View style={styles.copySection}>
          <Text style={styles.title}>루틴을 저장하고{'\n'}이어서 사용해보세요</Text>
          <Text style={styles.body}>
            로그인하면 식물 성장과 기록이 안전하게 저장되고{'\n'}
            모든 기기에서 이어서 사용할 수 있어요.
          </Text>
        </View>

        {/* Sign in buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.appleBtn, loading === 'apple' && styles.btnDimmed]}
            onPress={handleApple}
            disabled={loading !== null}
            activeOpacity={0.88}
          >
            <Text style={styles.appleBtnIcon}></Text>
            <Text style={styles.appleBtnText}>
              {loading === 'apple' ? '로그인 중...' : 'Apple로 로그인'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleBtn, loading === 'google' && styles.btnDimmed]}
            onPress={handleGoogle}
            disabled={loading !== null}
            activeOpacity={0.88}
          >
            <Text style={styles.googleBtnIcon}>G</Text>
            <Text style={styles.googleBtnText}>
              {loading === 'google' ? '로그인 중...' : 'Google로 로그인'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Later */}
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.laterText}>나중에 할게요</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  handleRow: { alignItems: 'center', paddingTop: Spacing.md, paddingBottom: Spacing.xs },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },

  /* Plant */
  plantWrap: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  plantEmoji: { fontSize: 40 },

  /* Copy */
  copySection: { alignItems: 'center', gap: Spacing.sm },
  title: {
    ...Typography.title2,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
  },
  body: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  /* Buttons */
  buttons: { width: '100%', gap: Spacing.sm },
  appleBtn: {
    height: ButtonHeight.primary,
    backgroundColor: '#000000',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  appleBtnIcon: { fontSize: 18, color: '#FFFFFF' },
  appleBtnText: { ...Typography.body1, color: '#FFFFFF' },

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
  googleBtnIcon: { fontSize: 18, color: '#4285F4', fontWeight: '700' },
  googleBtnText: { ...Typography.body1, color: Colors.textPrimary },

  btnDimmed: { opacity: 0.55 },

  /* Later */
  laterText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
