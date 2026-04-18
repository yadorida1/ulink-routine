import {
  Topic,
  Routine,
  RoutineProgress,
  PlantProgress,
  UserState,
  RecommendedPackage,
} from '../types';

export const mockTopics: Topic[] = [
  {
    id: 'topic_morning',
    name: '모닝 루틴',
    description: '하루를 상쾌하게 시작하는 아침 루틴',
    isPremiumOnly: false,
    isLocked: false,
    iconEmoji: '🌅',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'topic_exercise',
    name: '운동 루틴',
    description: '규칙적인 운동 습관 만들기',
    isPremiumOnly: true,
    isLocked: true,
    iconEmoji: '💪',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'topic_study',
    name: '학습 루틴',
    description: '집중력 있는 학습 루틴',
    isPremiumOnly: true,
    isLocked: true,
    iconEmoji: '📚',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockRoutines: Routine[] = [
  {
    id: 'routine_001',
    topicId: 'topic_morning',
    title: '5분 스트레칭',
    description: '하루를 시작하는 부드러운 스트레칭으로 몸을 깨워요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 5,
    difficulty: 'easy',
    scheduledDays: [1, 2, 3, 4, 5],
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_002',
    topicId: 'topic_morning',
    title: '명상 & 호흡',
    description: '10분 집중 명상으로 하루를 차분하게 준비해요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 10,
    difficulty: 'easy',
    scheduledDays: [1, 2, 3, 4, 5, 6, 0],
    isActive: true,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_003',
    topicId: 'topic_morning',
    title: '긍정 확언 읽기',
    description: '오늘 하루를 위한 긍정적인 말들로 시작해요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 3,
    difficulty: 'easy',
    scheduledDays: [1, 2, 3, 4, 5],
    isActive: true,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_004',
    topicId: 'topic_morning',
    title: '물 한 잔 & 비타민',
    description: '아침에 물 한 잔으로 몸을 깨우세요',
    durationMin: 2,
    difficulty: 'easy',
    scheduledDays: [1, 2, 3, 4, 5, 6, 0],
    isActive: true,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Mock progress for the past week (relative to a static reference date for demo)
export const mockRoutineProgress: RoutineProgress[] = [
  { id: 'prog_001', routineId: 'routine_001', date: '2024-04-15', completed: true, completedAt: '2024-04-15T07:10:00Z' },
  { id: 'prog_002', routineId: 'routine_002', date: '2024-04-15', completed: true, completedAt: '2024-04-15T07:22:00Z' },
  { id: 'prog_003', routineId: 'routine_003', date: '2024-04-15', completed: true, completedAt: '2024-04-15T07:30:00Z' },
  { id: 'prog_004', routineId: 'routine_001', date: '2024-04-16', completed: true, completedAt: '2024-04-16T07:05:00Z' },
  { id: 'prog_005', routineId: 'routine_002', date: '2024-04-16', completed: false },
  { id: 'prog_006', routineId: 'routine_001', date: '2024-04-17', completed: true, completedAt: '2024-04-17T07:30:00Z' },
  { id: 'prog_007', routineId: 'routine_002', date: '2024-04-17', completed: true, completedAt: '2024-04-17T07:45:00Z' },
  { id: 'prog_008', routineId: 'routine_003', date: '2024-04-17', completed: false },
];

export const mockPlantProgress: PlantProgress = {
  level: 35,
  vitality: 78,
  streak: 3,
  daysCompletedInCycle: 5,
  stage: 'sprout',
  state: 'healthy',
  lastUpdated: '2024-04-17',
};

export const mockUserState: UserState = {
  authStatus: 'guest',
  subscriptionStatus: 'free',
  activeTopicCount: 1,
};

export const mockRecommendedPackages: RecommendedPackage[] = [
  {
    id: 'pkg_morning_yoga',
    title: '모닝 요가 루틴',
    description: '전문가가 설계한 15분 아침 요가',
    durationMin: 15,
    routineCount: 5,
    isPremium: true,
    emoji: '🧘',
  },
  {
    id: 'pkg_focus_study',
    title: '집중력 향상 학습',
    description: '포모도로 기법으로 효율적인 학습',
    durationMin: 25,
    routineCount: 4,
    isPremium: true,
    emoji: '🎯',
  },
  {
    id: 'pkg_evening_wind',
    title: '저녁 마무리 루틴',
    description: '하루를 차분하게 마무리하는 루틴',
    durationMin: 10,
    routineCount: 3,
    isPremium: true,
    emoji: '🌙',
  },
];
