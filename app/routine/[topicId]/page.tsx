'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useRoutines } from '@/src/hooks/useRoutines';
import { usePlantProgress } from '@/src/hooks/usePlantProgress';
import { getWeekDates, formatWeekRangeKo, formatDate, isToday } from '@/src/utils/dateUtils';
import { getPlantEmoji, getPlantStageLabel } from '@/src/utils/plantUtils';
import { mockTopics, ACTIVE_TOPIC_ID, MONTHLY_TARGET_DAYS } from '@/src/data/mockData';
import { extractYouTubeId, getYouTubeThumbnailUrl, openYouTubeUrl } from '@/src/services/youtube';
import { Routine } from '@/src/types';

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export default function RoutineListPage({ params }: { params: { topicId: string } }) {
  const router = useRouter();
  const topicId = params.topicId ?? ACTIVE_TOPIC_ID;
  const topic = mockTopics.find(t => t.id === topicId);
  const { routines, isRoutineCompleted, getTodayRoutines } = useRoutines(topicId);
  const { plant } = usePlantProgress();

  const weekDates = useMemo(() => getWeekDates(), []);
  const weekLabel = useMemo(() => formatWeekRangeKo(), []);

  const getRoutineForDate = (date: Date): Routine | null => {
    const day = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    return routines.find(r => r.isActive && r.scheduledDays.includes(day)) ?? null;
  };

  const todayRoutine = getTodayRoutines()[0] ?? null;
  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);

  const completedThisWeek = weekDates.filter(date => {
    const r = getRoutineForDate(date);
    return r ? isRoutineCompleted(r.id, formatDate(date)) : false;
  }).length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Nav bar */}
      <div className="flex items-center bg-white border-b border-border px-4 py-3 flex-shrink-0">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center text-text-primary font-bold text-lg">
          &lt;
        </button>
        <h1 className="flex-1 text-center text-base font-medium text-text-primary">{topic?.name ?? '루틴 목록'}</h1>
        <button className="w-10 h-10 flex items-center justify-center text-text-secondary text-xs tracking-widest">•••</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex flex-col gap-3">
          {/* Week nav */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button className="p-2 text-text-secondary">&lt;</button>
            <span className="text-sm text-text-primary">{weekLabel}</span>
            <button className="p-2 text-text-secondary">&gt;</button>
          </div>

          {/* Day rows */}
          <div className="flex flex-col gap-1.5">
            {weekDates.map(date => {
              const dateStr = formatDate(date);
              const today = isToday(dateStr);
              const dayKo = DAYS_KO[date.getDay()];
              const routine = getRoutineForDate(date);
              const completed = routine ? isRoutineCompleted(routine.id, dateStr) : false;
              const isRest = !routine;

              const videoId = today && routine?.youtubeUrl ? extractYouTubeId(routine.youtubeUrl) : null;
              const thumbUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;

              // Today + YouTube → featured card
              if (today && thumbUrl) {
                return (
                  <div key={dateStr} className="bg-white rounded-2xl border-2 border-primary-400 overflow-hidden">
                    <button
                      onClick={() => openYouTubeUrl(routine!.youtubeUrl!)}
                      className="w-full h-[180px] relative bg-primary-700 block"
                    >
                      <img src={thumbUrl} alt={routine!.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-white/92 flex items-center justify-center">
                          <span className="text-primary-700 text-xl ml-0.5">▶</span>
                        </div>
                      </div>
                      <span className="absolute top-2 left-2 text-[11px] text-white font-bold bg-primary-600 rounded-full px-2 py-0.5">
                        오늘
                      </span>
                    </button>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">{dayKo}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                          {routine!.title}
                        </p>
                        <p className="text-xs text-text-secondary">{routine!.durationMin}분</p>
                      </div>
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${completed ? 'bg-primary-500 border-primary-500' : 'border-border'}`}>
                        {completed && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              }

              // Default row
              const otherVideoId = !isRest && routine?.youtubeUrl ? extractYouTubeId(routine.youtubeUrl) : null;
              const otherThumb = otherVideoId ? getYouTubeThumbnailUrl(otherVideoId) : null;

              return (
                <button
                  key={dateStr}
                  onClick={() => routine && router.push(`/play/${routine.id}`)}
                  disabled={isRest}
                  className={`flex items-center gap-3 bg-white rounded-xl border px-4 py-3 w-full text-left ${
                    today ? 'border-primary-400 bg-primary-100' : 'border-border'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    today ? 'bg-primary-500 border-primary-500' : completed ? 'bg-primary-600 border-primary-600' : 'bg-muted-fill border-border'
                  }`}>
                    <span className={`text-xs font-medium ${today || completed ? 'text-white' : 'text-text-secondary'}`}>{dayKo}</span>
                  </div>
                  <div className="flex-1">
                    {isRest ? (
                      <span className="text-sm text-text-tertiary">휴식</span>
                    ) : (
                      <>
                        <p className={`text-sm font-medium ${completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{routine!.title}</p>
                        <p className="text-xs text-text-secondary">{routine!.durationMin}분</p>
                      </>
                    )}
                  </div>
                  {otherThumb && (
                    <img src={otherThumb} alt="" className="w-12 h-8 rounded object-cover flex-shrink-0" />
                  )}
                  {!isRest && (
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${completed ? 'bg-primary-500 border-primary-500' : 'border-border'}`}>
                      {completed && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Plant weekly progress */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-border p-4 mt-1 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{plantEmoji}</span>
              <div>
                <p className="text-xs font-medium text-text-primary">식물 주 성장</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{stageLabel} 단계</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-xs text-primary-600 text-right font-medium">{completedThisWeek} / 7일</p>
              <div className="h-1.5 rounded-full bg-border-light overflow-hidden">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${(completedThisWeek / 7) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div className="p-4 bg-white border-t border-border flex-shrink-0">
        {todayRoutine ? (
          <Link href={`/play/${todayRoutine.id}`} className="btn-primary">오늘 루틴 시작하기</Link>
        ) : (
          <div className="btn-primary opacity-40 cursor-not-allowed">오늘 예정된 루틴 없음</div>
        )}
      </div>
    </div>
  );
}
