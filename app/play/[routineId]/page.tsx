'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mockRoutines } from '@/src/data/mockData';
import { extractYouTubeId, getYouTubeThumbnailUrl, openYouTubeUrl } from '@/src/services/youtube';

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function PlayPage({ params }: { params: { routineId: string } }) {
  const router = useRouter();
  const routine = mockRoutines.find(r => r.id === params.routineId);
  const total = (routine?.durationMin ?? 20) * 60;

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const idx = mockRoutines.findIndex(r => r.id === params.routineId);
  const remaining = total - elapsed;
  const pct = elapsed / total;

  const toggle = useCallback(() => {
    if (running) {
      clearInterval(timerRef.current!);
      setRunning(false);
    } else {
      setRunning(true);
      timerRef.current = setInterval(() => {
        setElapsed(p => {
          if (p >= total - 1) { clearInterval(timerRef.current!); setRunning(false); return total; }
          return p + 1;
        });
      }, 1000);
    }
  }, [running, total]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (!routine) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <p className="text-text-secondary">루틴을 찾을 수 없어요</p>
      <button onClick={() => router.back()} className="text-primary-600 text-sm underline">돌아가기</button>
    </div>
  );

  const videoId = routine.youtubeUrl ? extractYouTubeId(routine.youtubeUrl) : null;
  const thumbUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-muted-fill flex items-center justify-center text-text-secondary text-sm"
        >
          ✕
        </button>
        <span className="text-sm text-text-secondary">{idx + 1} / {mockRoutines.length}</span>
      </div>

      {/* Video area */}
      <button
        onClick={() => routine.youtubeUrl && openYouTubeUrl(routine.youtubeUrl)}
        className="w-full h-[220px] bg-primary-700 relative flex-shrink-0 block"
      >
        {thumbUrl
          ? <img src={thumbUrl} alt={routine.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-[#2A4A48]" />
        }
        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
          <div className="flex items-center gap-2">
            <button onClick={e => { e.stopPropagation(); toggle(); }} className="w-8 h-8 flex items-center justify-center">
              <span className="text-white text-base">{running ? '⏸' : '▶'}</span>
            </button>
            <span className="text-white text-xs w-9">{fmt(elapsed)}</span>
            <div className="flex-1 h-[3px] rounded bg-white/30 overflow-hidden">
              <div className="h-full rounded bg-primary-400" style={{ width: `${pct * 100}%` }} />
            </div>
            <span className="text-white text-xs w-9 text-right">{fmt(total)}</span>
            <span className="text-white text-sm ml-1">⛶</span>
          </div>
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-6 gap-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-text-primary text-center">{routine.title}</h2>
        {routine.description && (
          <p className="text-sm text-text-secondary text-center">{routine.description}</p>
        )}

        {/* Countdown */}
        <p className="text-6xl font-bold text-text-primary tracking-tight my-2">{fmt(remaining)}</p>

        {/* Pause button */}
        <button onClick={toggle} className="btn-primary flex items-center gap-2">
          <span>{running ? '⏸' : '▶'}</span>
          <span>{running ? '일시정지' : '시작'}</span>
        </button>

        {/* Complete */}
        <button
          onClick={() => router.replace(`/done/${routine.id}`)}
          className="btn-secondary flex items-center gap-2"
        >
          <span className="text-primary-600">✓</span>
          <span>완료했어요</span>
        </button>

        {/* Plant hint */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm">🌱</span>
          <span className="text-xs text-text-secondary">완료하면 식물에 물이 채워져요</span>
        </div>
      </div>
    </div>
  );
}
