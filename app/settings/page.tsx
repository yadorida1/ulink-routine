'use client';
import Link from 'next/link';
import { useUserState } from '@/src/hooks/useUserState';
import BottomNav from '@/src/components/web/BottomNav';

export default function SettingsPage() {
  const { userState, isGuest } = useUserState();

  const SECTIONS = [
    {
      title: '계정',
      items: [
        { label: '로그인 / 회원가입', href: '/auth', show: isGuest },
        { label: '로그아웃', href: '#', show: !isGuest },
        { label: '프리미엄 업그레이드', href: '/premium', show: true },
      ].filter(i => i.show),
    },
    {
      title: '앱',
      items: [
        { label: '알림 설정', href: '#', show: true },
        { label: '언어', href: '#', show: true },
        { label: '데이터 초기화', href: '#', show: true },
      ].filter(i => i.show),
    },
    {
      title: '정보',
      items: [
        { label: '버전 1.0.0', href: '#', show: true },
        { label: '개인정보처리방침', href: '#', show: true },
        { label: '이용약관', href: '#', show: true },
      ].filter(i => i.show),
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-text-primary mb-5">설정</h1>

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center text-2xl">
              🌱
            </div>
            <div className="flex-1">
              {isGuest ? (
                <>
                  <p className="text-sm font-medium text-text-primary">게스트 사용자</p>
                  <Link href="/auth" className="text-xs text-primary-600 underline">로그인하면 기록이 저장돼요</Link>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-text-primary">{userState.displayName ?? '사용자'}</p>
                  <p className="text-xs text-text-secondary">{userState.email ?? ''}</p>
                </>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              userState.subscriptionStatus === 'premium'
                ? 'bg-primary-600 text-white'
                : 'bg-muted-fill text-text-secondary border border-border'
            }`}>
              {userState.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
            </span>
          </div>

          {/* Settings sections */}
          {SECTIONS.map(section => (
            <div key={section.title} className="mb-5">
              <p className="text-xs text-text-tertiary font-medium uppercase tracking-wider px-1 mb-2">{section.title}</p>
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                {section.items.map((item, i) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3.5 active:bg-muted-fill transition-colors ${
                      i < section.items.length - 1 ? 'border-b border-border-light' : ''
                    }`}
                  >
                    <span className="text-sm text-text-primary">{item.label}</span>
                    <span className="text-text-tertiary text-sm">&gt;</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
