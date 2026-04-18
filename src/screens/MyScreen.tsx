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
import { APP_NAME_KO } from '../constants';
import { getPlantEmoji, getPlantStageLabel } from '../utils/plantUtils';
import AppIconPreviewCard from '../components/AppIconPreviewCard';
import { SmallRoutineWidget, MediumWeeklyWidget } from '../components/SimpleWidgetPreviewCard';
import Badge from '../components/Badge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MyScreen() {
  const navigation = useNavigation<Nav>();
  const { userState, isGuest, isPremium, signOut } = useUserState();
  const { plant } = usePlantProgress();

  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);

  const mockWeekDays = [
    { label: '월', completed: true },
    { label: '화', completed: true },
    { label: '수', completed: false },
    { label: '목', completed: true },
    { label: '금', completed: false },
    { label: '토', completed: true },
    { label: '일', completed: false },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>내 정보</Text>

        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {isGuest ? '👤' : (userState.displayName?.[0] ?? '👤')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {isGuest ? '게스트 사용자' : (userState.displayName ?? '사용자')}
            </Text>
            {!isGuest && userState.email && (
              <Text style={styles.userEmail}>{userState.email}</Text>
            )}
            <View style={styles.badgeRow}>
              <Badge label={isGuest ? '게스트' : '로그인됨'} variant={isGuest ? 'muted' : 'success'} />
              <Badge
                label={isPremium ? '프리미엄' : '무료'}
                variant={isPremium ? 'primary' : 'outline'}
              />
            </View>
          </View>
        </View>

        {/* Auth / Premium CTA */}
        {isGuest ? (
          <TouchableOpacity
            style={styles.ctaCard}
            onPress={() => navigation.navigate('Auth')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaTitle}>로그인하고 기록을 저장하세요</Text>
            <Text style={styles.ctaSub}>루틴 기록이 안전하게 보관돼요</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </TouchableOpacity>
        ) : !isPremium ? (
          <TouchableOpacity
            style={[styles.ctaCard, styles.premiumCtaCard]}
            onPress={() => navigation.navigate('Premium')}
            activeOpacity={0.85}
          >
            <Text style={[styles.ctaTitle, { color: Colors.primary700 }]}>프리미엄으로 업그레이드</Text>
            <Text style={styles.ctaSub}>더 많은 토픽과 상세 리포트를 사용해 보세요</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </TouchableOpacity>
        ) : null}

        {/* Plant status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 식물</Text>
          <View style={styles.plantCard}>
            <Text style={styles.plantEmoji}>{plantEmoji}</Text>
            <View style={styles.plantInfo}>
              <Text style={styles.plantStage}>{stageLabel}</Text>
              <Text style={styles.plantStreak}>{plant.streak}일 연속 달성 중</Text>
              <View style={styles.levelBar}>
                <View style={[styles.levelFill, { width: `${plant.level}%` }]} />
              </View>
              <Text style={styles.levelText}>성장도 {plant.level}%</Text>
            </View>
          </View>
        </View>

        {/* Widget preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위젯 미리보기</Text>
          <Text style={styles.sectionSub}>실제 위젯은 추후 지원 예정이에요</Text>
          <View style={styles.widgetPreview}>
            <SmallRoutineWidget
              routineTitle="5분 스트레칭"
              isCompleted={false}
              dayLabel="오늘"
            />
            <View style={styles.widgetSpacer} />
          </View>
          <MediumWeeklyWidget weekDays={mockWeekDays} successRate={0.71} />
        </View>

        {/* App icon preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 아이콘</Text>
          <AppIconPreviewCard />
        </View>

        {/* Settings rows */}
        <View style={styles.settingsSection}>
          {[
            { label: '알림 설정', icon: '🔔' },
            { label: '언어', icon: '🌐', value: '한국어' },
            { label: '개인정보 처리방침', icon: '🔒' },
            { label: '서비스 이용약관', icon: '📄' },
            { label: `${APP_NAME_KO} 버전`, icon: 'ℹ️', value: '1.0.0' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.settingsRow} activeOpacity={0.75}>
              <Text style={styles.settingsIcon}>{item.icon}</Text>
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Text style={styles.settingsValue}>{item.value ?? '→'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        {!isGuest && (
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={signOut}
            activeOpacity={0.75}
          >
            <Text style={styles.signOutText}>로그아웃</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingTop: Spacing.xl },
  pageTitle: { ...Typography.title2, color: Colors.textPrimary, marginBottom: Spacing.xl },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary200,
  },
  avatarText: { fontSize: 24 },
  userInfo: { flex: 1, gap: Spacing.xs },
  userName: { ...Typography.body1, color: Colors.textPrimary },
  userEmail: { ...Typography.caption2, color: Colors.textSecondary },
  badgeRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  ctaCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    gap: 3,
    position: 'relative',
  },
  premiumCtaCard: {
    backgroundColor: Colors.primary100,
    borderColor: Colors.primary200,
  },
  ctaTitle: { ...Typography.body1, color: Colors.textPrimary },
  ctaSub: { ...Typography.caption2, color: Colors.textSecondary },
  ctaArrow: {
    position: 'absolute',
    right: Spacing.base,
    top: '50%',
    ...Typography.body1,
    color: Colors.textTertiary,
  },
  section: { marginBottom: Spacing.xl, gap: Spacing.sm },
  sectionTitle: { ...Typography.caption1, color: Colors.textSecondary },
  sectionSub: { ...Typography.caption2, color: Colors.textTertiary, marginTop: -Spacing.xs },
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
  plantEmoji: { fontSize: 40 },
  plantInfo: { flex: 1, gap: Spacing.xs },
  plantStage: { ...Typography.body1, color: Colors.textPrimary },
  plantStreak: { ...Typography.caption2, color: Colors.textSecondary },
  levelBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  levelFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.primary500,
  },
  levelText: { ...Typography.caption2, color: Colors.textSecondary },
  widgetPreview: { flexDirection: 'row', gap: Spacing.md },
  widgetSpacer: { flex: 1 },
  settingsSection: {
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  settingsIcon: { fontSize: 16, width: 24 },
  settingsLabel: { ...Typography.body2, color: Colors.textPrimary, flex: 1 },
  settingsValue: { ...Typography.caption1, color: Colors.textSecondary },
  signOutBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.base,
  },
  signOutText: { ...Typography.body2, color: Colors.error, textDecorationLine: 'underline' },
  bottomSpacer: { height: Spacing.xxl },
});
