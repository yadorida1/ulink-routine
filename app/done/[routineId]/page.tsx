'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { mockRoutines } from '@/src/data/mockData';
import { usePlantProgress } from '@/src/hooks/usePlantProgress';
import { useRoutines } from '@/src/hooks/useRoutines';
import { getPlantEmoji, getPlantStageLabel } from '@/src/utils/plantUtils';

export default function DonePage({ params }: { params: { routineId: string } }) {
  const { plant, onRoutineCompleted } = usePlantProgress();
  const { markComplete } = useRoutines();
  const routine = mockRoutines.find(r => r.id === params.routineId);
  const plantEmoji = getPlantEmoji(plant.stage, plant.state);
  const stageLabel = getPlantStageLabel(plant.stage);

  useEffect(() => {
    markComplete(params.routineId);
    onRoutineCompleted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.routineId]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 animate-fade-in">
      {/* Plant circle */}
      <div className="w-36 h-36 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center">
        <span className="text-6xl">{plantEmoji}</span>
      </div>

      {/* Message */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">잘했어요! 🌱</h1>
        <p className="text-sm text-text-secondary">오늘의 루틴을 완료했어요</p>
      </div>

      {/* Plant state card */}
      <div className="w-full bg-white rounded-xl border border-border p-4 flex flex-col gap-2">
        <p className="text-xs text-text-secondary">식물 상태</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-text-primary">{stageLabel} 단계</span>
          <span className="text-text-tertiary text-sm">•</span>
          <span className="text-sm text-primary-600">{plant.streak}일째</span>
        </div>
        <div className="h-1.5 rounded-full bg-primary-100 overflow-hidden">
          <div className="h-full rounded-full bg-primary-500" style={{ width: `${plant.vitality}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-2">
        <Link href="/report" className="btn-primary">리포트 보기</Link>
        <Link href="/" className="block text-center text-sm text-text-secondary underline py-2">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}
