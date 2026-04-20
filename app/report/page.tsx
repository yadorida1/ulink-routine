'use client';
import { useState, useMemo } from 'react';
import { useRoutines } from '@/src/hooks/useRoutines';
import { usePlantProgress } from '@/src/hooks/usePlantProgress';
import { getWeekDates, formatWeekRangeKo, formatDate, isToday } from '@/src/utils/dateUtils';
import { getPlantEmoji, getPlantStageLabel } from '@/src/utils/plantUtils';
import { MONTHLY_TARGET_DAYS } from '@/src/data/mockData';
import BottomNav from '@/src/components/web/BottomNav';

type Period = 'weekly' | 'monthly' | 'all';
const PERIOD_LABELS: Record<Period, string> = { weekly: '이번 주', monthly: '이번 달', all: '전체' };
const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export default function ReportPage() {
  const [period, setPeriod] = useState<Period>('weekly');
  const { routines, isRoutineCompleted } = useRoutines();
  const { plant } = usePlantProgress();
  const weekDates = useMemo(() => getWeekDates(), []);
  const weekLabel = useMemo(() => formatWeekRangeKo(), []);
  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);

  const weekStats = useMemo(() => {
    let completed = 0; let total = 0;
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      const day = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const scheduled = routines.filter(r => r.isActive && r.scheduledDays.includes(day));
      total += scheduled.length;
      completed += scheduled.filter(r => isRoutineCompleted(r.id, dateStr)).length;
    });
    return { completed, total, rate: total > 0 ? completed / total : 0 };
  }, [weekDates, routines, isRoutineCompleted]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-text-primary mb-1">리포트</h1>
          <p className="text-sm text-text-secondary mb-5">{weekLabel}</p>

          {/* Period tabs */}
          <div className="flex gap-2 mb-5">
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  period === p ? 'bg-primary-600 text-white' : 'bg-white border border-border text-text-secondary'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: '완료', value: weekStats.completed, unit: '회' },
              { label: '달성률', value: Math.round(weekStats.rate * 100), unit: '%' },
              { label: '연속', value: plant.streak, unit: '일' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-3 text-center">
                <p className="text-2xl font-bold text-primary-600">{s.value}<span className="text-sm ml-0.5">{s.unit}</span></p>
                <p className="text-xs text-text-secondary mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Plant card */}
          <div className="bg-white rounded-xl border border-border p-4 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{plantEmoji}</span>
              <div>
                <p className="text-sm font-medium text-text-primary">{stageLabel} 단계</p>
                <p className="text-xs text-text-secondary">{plant.streak}일 연속 · 활력 {plant.vitality}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary w-12">{plant.daysCompletedInCycle}일</span>
              <div className="flex-1 h-2 rounded-full bg-primary-100 overflow-hidden">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${(plant.daysCompletedInCycle / MONTHLY_TARGET_DAYS) * 100}%` }} />
              </div>
              <span className="text-xs text-text-secondary w-12 text-right">{MONTHLY_TARGET_DAYS}일 목표</span>
            </div>
          </div>

          {/* Weekly calendar */}
          <p className="text-sm font-medium text-text-primary mb-3">이번 주 달성</p>
          <div className="flex gap-2 mb-5">
            {weekDates.map(date => {
              const dateStr = formatDate(date);
              const today = isToday(dateStr);
              const day = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
              const scheduled = routines.filter(r => r.isActive && r.scheduledDays.includes(day));
              const done = scheduled.length > 0 && scheduled.every(r => isRoutineCompleted(r.id, dateStr));
              return (
                <div key={dateStr} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`text-xs ${today ? 'text-primary-600 font-bold' : 'text-text-secondary'}`}>
                    {DAYS_KO[date.getDay()]}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    done ? 'bg-primary-500 text-white' : scheduled.length === 0 ? 'bg-muted-fill text-text-tertiary' : 'bg-white border border-border text-text-secondary'
                  }`}>
                    {done ? '✓' : date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Routine list */}
          <p className="text-sm font-medium text-text-primary mb-3">루틴별 현황</p>
          <div className="flex flex-col gap-2">
            {routines.map(r => {
              const completedCount = weekDates.filter(d => {
                const day = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
                return r.scheduledDays.includes(day) && isRoutineCompleted(r.id, formatDate(d));
              }).length;
              const totalScheduled = weekDates.filter(d => r.scheduledDays.includes(d.getDay() as 0|1|2|3|4|5|6)).length;
              return (
                <div key={r.id} className="bg-white rounded-xl border border-border p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{r.title}</p>
                    <p className="text-xs text-text-secondary">{r.durationMin}분</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${completedCount > 0 ? 'text-primary-600' : 'text-text-tertiary'}`}>
                      {completedCount}/{totalScheduled}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
