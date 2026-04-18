import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Radius, ButtonHeight } from '../theme';
import { getAvailablePackages } from '../services/premium';

const BENEFITS = [
  { emoji: '📂', title: '여러 토픽', desc: '운동, 학습, 자기계발 등 원하는 만큼 토픽 추가' },
  { emoji: '📊', title: '상세 리포트', desc: '월간 분석, 패턴 인사이트, 트렌드 시각화' },
  { emoji: '✨', title: 'AI 추천', desc: '나에게 맞는 루틴을 AI가 추천해 드려요 (예정)' },
  { emoji: '☁️', title: '클라우드 동기화', desc: '기기 간 루틴과 기록을 자동으로 동기화' },
  { emoji: '🌿', title: '식물 풀 성장', desc: '다양한 식물 스테이지와 월간 하베스트 기능' },
];

const COMPARISON = [
  { feature: '토픽', free: '1개', premium: '무제한' },
  { feature: '루틴 추가', free: '제한', premium: '무제한' },
  { feature: '리포트', free: '기본', premium: '상세 + AI' },
  { feature: '클라우드 동기화', free: '✗', premium: '✓' },
  { feature: 'AI 추천', free: '✗', premium: '✓ (예정)' },
];

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    // INTEGRATION POINT: RevenueCat purchasePremium(selectedPlan)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleRestore = async () => {
    // INTEGRATION POINT: RevenueCat restorePurchases()
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🌳</Text>
          <Text style={styles.headerTitle}>ULink Routine 프리미엄</Text>
          <Text style={styles.headerSub}>더 넓고 깊은 루틴 경험</Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={styles.benefitEmoji}>{b.emoji}</Text>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan selector */}
        <View style={styles.planSection}>
          <View style={styles.planRow}>
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.85}
            >
              <Text style={[styles.planTitle, selectedPlan === 'monthly' && styles.planTitleSelected]}>
                월간
              </Text>
              <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.planPriceSelected]}>
                ₩4,900
              </Text>
              <Text style={styles.planPeriod}>/ 월</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
              onPress={() => setSelectedPlan('yearly')}
              activeOpacity={0.85}
            >
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsBadgeText}>32% 절약</Text>
              </View>
              <Text style={[styles.planTitle, selectedPlan === 'yearly' && styles.planTitleSelected]}>
                연간
              </Text>
              <Text style={[styles.planPrice, selectedPlan === 'yearly' && styles.planPriceSelected]}>
                ₩39,900
              </Text>
              <Text style={styles.planPeriod}>/ 년</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comparison table */}
        <View style={styles.comparisonTable}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonFeatureHeader} />
            <Text style={styles.comparisonTierHeader}>무료</Text>
            <Text style={[styles.comparisonTierHeader, { color: Colors.primary600 }]}>프리미엄</Text>
          </View>
          {COMPARISON.map((row, i) => (
            <View key={i} style={[styles.comparisonRow, i % 2 === 0 && styles.comparisonRowAlt]}>
              <Text style={styles.comparisonFeature}>{row.feature}</Text>
              <Text style={styles.comparisonFreeVal}>{row.free}</Text>
              <Text style={styles.comparisonPremiumVal}>{row.premium}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.purchaseBtn, loading && styles.purchaseBtnDisabled]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.purchaseBtnText}>
            {loading ? '처리 중...' : selectedPlan === 'yearly' ? '연간 구독 시작' : '월간 구독 시작'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRestore} activeOpacity={0.7}>
          <Text style={styles.restoreText}>구매 복원</Text>
        </TouchableOpacity>
        <Text style={styles.legalText}>
          구독은 언제든지 취소할 수 있습니다. 결제는 App Store / Google Play를 통해 처리됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.base,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mutedFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 14, color: Colors.textSecondary },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.xxl },
  header: { alignItems: 'center', gap: Spacing.sm },
  headerEmoji: { fontSize: 52 },
  headerTitle: { ...Typography.title1, color: Colors.textPrimary, textAlign: 'center' },
  headerSub: { ...Typography.body2, color: Colors.textSecondary, textAlign: 'center' },
  benefits: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.base,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  benefitEmoji: { fontSize: 20, width: 28 },
  benefitText: { flex: 1, gap: 3 },
  benefitTitle: { ...Typography.body1, color: Colors.textPrimary },
  benefitDesc: { ...Typography.caption2, color: Colors.textSecondary },
  planSection: { gap: Spacing.sm },
  planRow: { flexDirection: 'row', gap: Spacing.md },
  planCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 3,
    position: 'relative',
    paddingTop: Spacing.xl,
  },
  planCardSelected: {
    borderColor: Colors.primary500,
    backgroundColor: Colors.primary100,
  },
  savingsBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    backgroundColor: Colors.primary600,
    borderTopRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  savingsBadgeText: { ...Typography.caption2, color: Colors.textInverse },
  planTitle: { ...Typography.caption1, color: Colors.textSecondary },
  planTitleSelected: { color: Colors.primary600 },
  planPrice: { ...Typography.title2, color: Colors.textPrimary },
  planPriceSelected: { color: Colors.primary700 },
  planPeriod: { ...Typography.caption2, color: Colors.textTertiary },
  comparisonTable: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.mutedFill,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  comparisonFeatureHeader: { flex: 2 },
  comparisonTierHeader: { flex: 1, ...Typography.caption1, color: Colors.textSecondary, textAlign: 'center' },
  comparisonRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
  },
  comparisonRowAlt: { backgroundColor: Colors.surfaceElevated },
  comparisonFeature: { flex: 2, ...Typography.caption1, color: Colors.textPrimary },
  comparisonFreeVal: { flex: 1, ...Typography.caption2, color: Colors.textTertiary, textAlign: 'center' },
  comparisonPremiumVal: { flex: 1, ...Typography.caption1, color: Colors.primary600, textAlign: 'center' },
  footer: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  purchaseBtn: {
    width: '100%',
    height: ButtonHeight.primary,
    backgroundColor: Colors.primary600,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseBtnDisabled: { opacity: 0.6 },
  purchaseBtnText: { ...Typography.body1, color: Colors.textInverse },
  restoreText: { ...Typography.caption1, color: Colors.textSecondary, textDecorationLine: 'underline' },
  legalText: {
    ...Typography.caption2,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.base,
  },
  bottomSpacer: { height: Spacing.base },
});
