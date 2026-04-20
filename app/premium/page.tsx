'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function PremiumPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-primary-700 px-4 pt-10 pb-8 text-center text-white relative">
          <button onClick={() => router.back()} className="absolute top-4 left-4 text-white/70 text-sm">✕</button>
          <span className="text-5xl mb-3 block">🌿</span>
          <h1 className="text-2xl font-bold mb-2">ULink Premium</h1>
          <p className="text-sm text-white/80">루틴의 모든 가능성을 열어보세요</p>
        </div>

        <div className="px-4 py-5 flex flex-col gap-5">
          {/* Plan selector */}
          <div className="flex gap-3">
            {(['yearly', 'monthly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                className={`flex-1 rounded-xl border-2 p-3 text-left transition-colors relative ${
                  plan === p ? 'border-primary-600 bg-primary-100' : 'border-border bg-white'
                }`}
              >
                {p === 'yearly' && (
                  <span className="absolute -top-2 right-2 text-[10px] bg-primary-600 text-white rounded-full px-2 py-0.5">추천</span>
                )}
                <p className="font-bold text-text-primary text-sm">{p === 'yearly' ? '연간 플랜' : '월간 플랜'}</p>
                <p className="text-primary-600 font-bold mt-1">
                  {p === 'yearly' ? '₩49,900/년' : '₩5,900/월'}
                </p>
                {p === 'yearly' && <p className="text-xs text-text-secondary">월 ₩4,158 · 30% 절약</p>}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button className="btn-primary">
            {plan === 'yearly' ? '연간 플랜으로 시작하기' : '월간 플랜으로 시작하기'}
          </button>
          <p className="text-[11px] text-text-tertiary text-center -mt-2">7일 무료 체험 · 언제든 취소 가능</p>

          {/* Benefits */}
          <div>
            <p className="text-sm font-bold text-text-primary mb-3">프리미엄 혜택</p>
            <div className="flex flex-col gap-3">
              {BENEFITS.map(b => (
                <div key={b.title} className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{b.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{b.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div>
            <p className="text-sm font-bold text-text-primary mb-3">무료 vs 프리미엄</p>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 bg-primary-100 px-4 py-2">
                <span className="text-xs text-text-secondary">기능</span>
                <span className="text-xs text-text-secondary text-center">무료</span>
                <span className="text-xs text-primary-600 font-medium text-center">프리미엄</span>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-3 px-4 py-3 ${i < COMPARISON.length - 1 ? 'border-b border-border-light' : ''}`}>
                  <span className="text-xs text-text-primary">{row.feature}</span>
                  <span className="text-xs text-text-secondary text-center">{row.free}</span>
                  <span className="text-xs text-primary-600 font-medium text-center">{row.premium}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
