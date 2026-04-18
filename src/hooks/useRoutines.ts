import { useState, useCallback, useMemo } from 'react';
import { Routine, RoutineProgress } from '../types';
import { mockRoutines, mockRoutineProgress } from '../data/mockData';
import { getToday, getWeekRange, formatDate } from '../utils/dateUtils';

// INTEGRATION POINT: Replace mock data with Firestore queries:
//   const routines = await routinesRepository.getAll(userId);
//   const progress = await progressRepository.getByDateRange(userId, startDate, endDate);

export const useRoutines = (topicId?: string) => {
  const [routines] = useState<Routine[]>(
    topicId ? mockRoutines.filter(r => r.topicId === topicId) : mockRoutines,
  );
  const [progress, setProgress] = useState<RoutineProgress[]>(mockRoutineProgress);

  const getTodayRoutines = useCallback(() => {
    const dayOfWeek = new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    return routines.filter(r => r.isActive && r.scheduledDays.includes(dayOfWeek));
  }, [routines]);

  const getProgressForDate = useCallback(
    (date: string) => progress.filter(p => p.date === date),
    [progress],
  );

  const isRoutineCompleted = useCallback(
    (routineId: string, date: string) =>
      progress.some(p => p.routineId === routineId && p.date === date && p.completed),
    [progress],
  );

  const markComplete = useCallback(
    (routineId: string) => {
      const today = getToday();
      if (isRoutineCompleted(routineId, today)) return;

      const newProgress: RoutineProgress = {
        id: `prog_${Date.now()}`,
        routineId,
        date: today,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setProgress(prev => [...prev, newProgress]);
      // INTEGRATION POINT: await progressRepository.markCompleted(userId, routineId, today);
    },
    [isRoutineCompleted],
  );

  const getWeekProgress = useCallback(() => {
    const { start, end } = getWeekRange();
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    const weekProgress = progress.filter(p => p.date >= startStr && p.date <= endStr);
    const completed = weekProgress.filter(p => p.completed).length;
    const total = weekProgress.length;
    return { completed, total, rate: total > 0 ? completed / total : 0 };
  }, [progress]);

  const todayRoutines = useMemo(() => getTodayRoutines(), [getTodayRoutines]);

  return {
    routines,
    progress,
    todayRoutines,
    getTodayRoutines,
    getProgressForDate,
    isRoutineCompleted,
    markComplete,
    getWeekProgress,
  };
};
