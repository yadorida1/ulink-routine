import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useUserState } from '../hooks/useUserState';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { getPlantEmoji, getPlantStageLabel } from '../utils/plantUtils';
import { APP_NAME_KO, MONTHLY_TARGET_DAYS } from '../constants';
import { mockPlantProgress, ACTIVE_TOPIC_ID, mockTopics } from '../data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SETTINGS_ROWS = [
  { icon: '🔔', label: '알림 설정' },
  { icon: '🌐', label: '언어', value: '한국어' },
  { icon: '☁️', label: '데이터 동기화' },
  { icon: '🔒', label: '개인정보 처리방침' },
  { icon: '📄', label: '서비스 이용약관' },
  { icon: 'ℹ️', label: '버전', value: '1.0.0' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { userState, isGuest, isPremium, signOut } = useUserState();
  const { plant } = usePlantProgress();

  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);
  const activeTopic = mockTopics.find(t => t.id === ACTIVE_TOPIC_ID);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>설정</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{isGuest ? '👤' : (userState.displayName?.[0] ?? '👤')}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {isGuest ? '게스트 사용자' : (userState.displayName ?? '사용자')}
            </Text>
            {!isGuest && userState.email ? (
              <Text style={styles.profileEmail}>{userState.email}</Text>
            ) : null}
            <View style={styles.badgeRow}>
              <View style={[styles.badge, isGuest ? styles.badgeMuted : styles.badgeSuccess]}>
                <Text style={[styles.badgeText, isGuest ? styles.badgeTextMuted : styles.badgeTextSuccess]}>
                  {isGuest ? '게스트' : '로그인됨'}
                </Text>
              </View>
              <View style={[styles.badge, isPremium ? styles.badgePrimary : styles.badgeOutline]}>
                <Text style={[styles.badgeText, isPremium ? styles.badgeTextPrimary : styles.badgeTextMuted]}>
                  {isPremium ? '프리미엄' : '무료'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Login / Premium CTA */}
        {isGuest ? (
          <TouchableOpacity
            style={styles.ctaCard}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaTitle}>로그인하고 기록을 저장하세요</Text>
            <Text style={styles.ctaSub}>루틴 기록이 안전하게 보관돼요</Text>
          </TouchableOpacity>
        ) : !isPremium ? (
          <TouchableOpacity
            style={[styles.ctaCard, styles.premiumCtaCard]}
            onPress={() => navigation.navigate('Premium')}
            activeOpacity={0.85}
          >
            <Text style={[styles.ctaTitle, { color: Colors.primary700 }]}>
              프리미엄으로 업그레이드
            </Text>
            <Text style={styles.ctaSub}>더 많은 토픽과 상세 리포트를 사용해 보세요</Text>
          </TouchableOpacity>
        ) : null}

        {/* Plant & topic summary */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>내 식물</Text>
          <View style={styles.plantCard}>
            <Text style={styles.plantEmoji}>{plantEmoji}</Text>
            <View style={styles.plantInfo}>
              <Text style={styles.plantStage}>{stageLabel} 단계</Text>
              <Text style={styles.plantStreak}>{plant.streak}일 연속 달성 중</Text>
              <View style={styles.plantBarTrack}>
                <View style={[styles.plantBarFill, { width: `${(plant.daysCompletedInCycle / MONTHLY_TARGET_DAYS) * 100}%` }]} />
              </View>
              <Text style={styles.plantProgress}>
                {plant.daysCompletedInCycle} / {MONTHLY_TARGET_DAYS}일
              </Text>
            </View>
          </View>
        </View>

        {/* Active topic */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>활성 토픽</Text>
          <View style={styles.topicCard}>
            <Text style={styles.topicEmoji}>{activeTopic?.iconEmoji ?? '📌'}</Text>
            <View>
              <Text style={styles.topicName}>{activeTopic?.name ?? '루틴'}</Text>
              <Text style={styles.topicDesc}>{activeTopic?.description ?? ''}</Text>
            </View>
          </View>
        </View>

        {/* Settings list */}
        <View style={styles.settingsList}>
          {SETTINGS_ROWS.map((row, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.settingsRow,
                i < SETTINGS_ROWS.length - 1 && styles.settingsRowBorder,
              ]}
              activeOpacity={0.75}
            >
              <Text style={styles.settingsIcon}>{row.icon}</Text>
              <Text style={styles.settingsLabel}>{row.label}</Text>
              <Text style={styles.settingsValue}>{row.value ?? '›'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        {!isGuest && (
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.75}>
            <Text style={styles.signOutText}>로그아웃</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingTop: Spacing.xl },
  pageTitle: { ...Typography.title2, color: Colors.textPrimary, marginBottom: Spacing.xl },

  /* Profile */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  avatarEmoji: { fontSize: 22 },
  profileInfo: { flex: 1, gap: Spacing.xs },
  profileName: { ...Typography.body1, color: Colors.textPrimary },
  profileEmail: { ...Typography.caption2, color: Colors.textSecondary },
  badgeRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeMuted: { backgroundColor: Colors.mutedFill, borderColor: Colors.border },
  badgeSuccess: { backgroundColor: Colors.completedFill, borderColor: Colors.primary300 },
  badgePrimary: { backgroundColor: Colors.primary100, borderColor: Colors.primary300 },
  badgeOutline: { backgroundColor: 'transparent', borderColor: Colors.border },
  badgeText: { ...Typography.caption2 },
  badgeTextMuted: { color: Colors.textSecondary },
  badgeTextSuccess: { color: Colors.success },
  badgeTextPrimary: { color: Colors.primary600 },

  /* CTA */
  ctaCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    gap: 4,
  },
  premiumCtaCard: { backgroundColor: Colors.primary100, borderColor: Colors.primary200 },
  ctaTitle: { ...Typography.body1, color: Colors.textPrimary },
  ctaSub: { ...Typography.caption2, color: Colors.textSecondary },

  /* Section */
  section: { marginBottom: Spacing.xl, gap: Spacing.sm },
  sectionLabel: { ...Typography.caption1, color: Colors.textSecondary },

  /* Plant card */
  plantCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  plantEmoji: { fontSize: 36 },
  plantInfo: { flex: 1, gap: 4 },
  plantStage: { ...Typography.body1, color: Colors.textPrimary },
  plantStreak: { ...Typography.caption2, color: Colors.textSecondary },
  plantBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
    marginTop: 4,
  },
  plantBarFill: { height: '100%', borderRadius: 2, backgroundColor: Colors.primary500 },
  plantProgress: { ...Typography.caption2, color: Colors.textSecondary },

  /* Topic card */
  topicCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  topicEmoji: { fontSize: 24 },
  topicName: { ...Typography.body1, color: Colors.textPrimary },
  topicDesc: { ...Typography.caption2, color: Colors.textSecondary, marginTop: 2 },

  /* Settings list */
  settingsList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  settingsRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  settingsIcon: { fontSize: 16, width: 24 },
  settingsLabel: { ...Typography.body2, color: Colors.textPrimary, flex: 1 },
  settingsValue: { ...Typography.caption1, color: Colors.textSecondary },

  /* Sign out */
  signOutBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  signOutText: { ...Typography.body2, color: Colors.error, textDecorationLine: 'underline' },
});
