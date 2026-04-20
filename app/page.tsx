'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRoutines } from '@/src/hooks/useRoutines';
import { usePlantProgress } from '@/src/hooks/usePlantProgress';
import { useUserState } from '@/src/hooks/useUserState';
import { getToday } from '@/src/utils/dateUtils';
import { getPlantEmoji, getPlantStageLabel } from '@/src/utils/plantUtils';
import { mockTopics, mockRecommendedPackages, ACTIVE_TOPIC_ID, MONTHLY_TARGET_DAYS } from '@/src/data/mockData';
import { extractYouTubeId, getYouTubeThumbnailUrl, openYouTubeUrl } from '@/src/services/youtube';
import BottomNav from '@/src/components/web/BottomNav';

export default function HomePage() {
  const { todayRoutines, isRoutineCompleted } = useRoutines(ACTIVE_TOPIC_ID);
  const { plant } = usePlantProgress();
  const { userState, isGuest } = useUserState();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const activeTopic = mockTopics.find(t => t.id === ACTIVE_TOPIC_ID);
  const todayRoutine = todayRoutines[0] ?? null;
  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);
  const progressPct = plant.daysCompletedInCycle / MONTHLY_TARGET_DAYS;

  const videoId = todayRoutine?.youtubeUrl ? extractYouTubeId(todayRoutine.youtubeUrl) : null;
  const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-6">

          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-text-secondary">
              {isGuest ? '안녕하세요,' : `안녕하세요, ${userState.displayName ?? ''}님`}
            </span>
            {isGuest && (
              <span className="text-xs text-text-secondary bg-muted-fill border border-border rounded-full px-2 py-0.5">
                게스트
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-text-primary leading-tight mb-6">
            오늘도,<br />나를 연결하는 시간
          </h1>

          {/* Main routine card */}
          <Link href={`/routine/${ACTIVE_TOPIC_ID}`} className="block mb-3">
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              {/* Thumbnail banner */}
              {thumbnailUrl && (
                <button
                  onClick={e => { e.preventDefault(); openYouTubeUrl(todayRoutine!.youtubeUrl!); }}
                  className="w-full h-40 relative bg-primary-700 block"
                >
                  <img src={thumbnailUrl} alt="오늘 루틴 영상" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
                      <span className="text-primary-700 text-lg ml-0.5">▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 rounded-full px-2 py-0.5">
                    오늘의 루틴 영상
                  </span>
                </button>
              )}
              <div className="p-4 flex flex-col gap-3">
                {/* Topic + title + plant */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-primary-600 font-medium mb-1">{activeTopic?.name ?? '루틴'}</p>
                    <p className="text-lg font-bold text-text-primary truncate">
                      {todayRoutine ? todayRoutine.title : '오늘 루틴 없음'}
                    </p>
                  </div>
                  <span className="text-5xl leading-none ml-2">{plantEmoji}</span>
                </div>
                {/* Streak badge */}
                <div>
                  <span className="inline-block bg-primary-600 text-white text-xs font-medium rounded-full px-3 py-1">
                    성장 {plant.streak}일째
                  </span>
                </div>
                {/* Water gauge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">💧</span>
                  <div className="flex-1 h-1.5 rounded-full bg-primary-100 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${progressPct * 100}%` }} />
                  </div>
                  <span className="text-xs text-text-secondary min-w-[52px] text-right">
                    {plant.daysCompletedInCycle} / {MONTHLY_TARGET_DAYS}일
                  </span>
                </div>
                {/* Footer */}
                <div className="flex justify-between items-end pt-2 border-t border-border-light">
                  <div>
                    <p className="text-[11px] text-text-tertiary mb-0.5">식물 상태</p>
                    <p className="text-sm text-text-primary font-medium">{stageLabel} 단계</p>
                  </div>
                  <span className="text-xs text-primary-600">자세히 보기 &gt;</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Add topic */}
          <Link href="/premium" className="flex items-center gap-3 bg-white rounded-xl border-2 border-dashed border-border p-4 mb-6 active:opacity-70">
            <span className="text-2xl text-text-tertiary w-8 text-center">＋</span>
            <div>
              <p className="text-sm font-medium text-text-primary">주제 추가</p>
              <p className="text-xs text-text-secondary mt-0.5">새로운 루틴을 시작해보세요</p>
            </div>
          </Link>

          {/* Recommended packages */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-text-primary">추천 루틴 패키지</p>
            <Link href="/premium" className="text-xs text-primary-600">전체보기 &gt;</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 mb-6">
            {mockRecommendedPackages.map(pkg => (
              <Link key={pkg.id} href="/premium" className="flex flex-col items-center gap-2 w-[90px] flex-shrink-0 active:opacity-70">
                <div className="w-[72px] h-[72px] rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-3xl">
                  {pkg.emoji}
                </div>
                <span className="text-xs text-text-primary text-center leading-tight">{pkg.title}</span>
              </Link>
            ))}
          </div>

          {/* Login banner */}
          {isGuest && !bannerDismissed && (
            <div className="flex items-center gap-3 bg-white rounded-xl border border-border p-4 mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">진행 상황을 저장하세요</p>
                <p className="text-xs text-text-secondary mt-0.5">로그인하면 루틴 기록이 안전하게 보관돼요</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/auth" className="btn-primary !w-auto px-4 !h-9 text-sm">로그인</Link>
                <button onClick={() => setBannerDismissed(true)} className="text-xs text-text-tertiary">나중에</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
