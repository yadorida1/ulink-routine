'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="flex-1 flex flex-col px-6 pt-10 gap-6">
      <button onClick={() => router.back()} className="self-start text-text-secondary text-sm">✕ 닫기</button>

      <div className="text-center">
        <span className="text-5xl block mb-3">🌱</span>
        <h1 className="text-xl font-bold text-text-primary">ULink Routine</h1>
        <p className="text-sm text-text-secondary mt-1">루틴을 하면 식물이 자라요</p>
      </div>

      {/* Tab */}
      <div className="flex rounded-xl bg-muted-fill p-1">
        {(['login', 'signup'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary'
            }`}
          >
            {m === 'login' ? '로그인' : '회원가입'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <input className="w-full h-12 border border-border rounded-xl px-4 text-sm outline-none focus:border-primary-500" placeholder="이메일" type="email" />
        <input className="w-full h-12 border border-border rounded-xl px-4 text-sm outline-none focus:border-primary-500" placeholder="비밀번호" type="password" />
        {mode === 'signup' && (
          <input className="w-full h-12 border border-border rounded-xl px-4 text-sm outline-none focus:border-primary-500" placeholder="닉네임" type="text" />
        )}
        <button className="btn-primary mt-1">{mode === 'login' ? '로그인' : '회원가입'}</button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-tertiary">또는</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button className="w-full h-12 bg-[#FEE500] rounded-xl text-sm font-medium text-[#3C1E1E]">
        카카오로 계속하기
      </button>
      <button className="w-full h-12 bg-white border border-border rounded-xl text-sm font-medium text-text-primary">
        Google로 계속하기
      </button>
    </div>
  );
}
