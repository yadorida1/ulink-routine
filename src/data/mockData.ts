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
    id: 'topic_exercise',
    name: '운동 루틴',
    description: '매일 꾸준히 하는 운동 습관 만들기',
    isPremiumOnly: false,
    isLocked: false,
    iconEmoji: '💪',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'topic_morning',
    name: '모닝 루틴',
    description: '하루를 상쾌하게 시작하는 아침 루틴',
    isPremiumOnly: true,
    isLocked: true,
    iconEmoji: '🌅',
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

// One routine per weekday for the active topic
export const mockRoutines: Routine[] = [
  {
    id: 'routine_mon',
    topicId: 'topic_exercise',
    title: '전신 스트레칭',
    description: '부드럽게 몸을 풀어볼까요?',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 20,
    difficulty: 'easy',
    scheduledDays: [1], // Monday
    isActive: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_tue',
    topicId: 'topic_exercise',
    title: '하체 운동',
    description: '스쿼트와 런지로 하체를 강화해요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 20,
    difficulty: 'medium',
    scheduledDays: [2], // Tuesday
    isActive: true,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_wed',
    topicId: 'topic_exercise',
    title: '코어 운동',
    description: '플랭크와 크런치로 코어를 단련해요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 20,
    difficulty: 'medium',
    scheduledDays: [3], // Wednesday
    isActive: true,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_thu',
    topicId: 'topic_exercise',
    title: '상체 운동',
    description: '푸시업과 덤벨로 상체를 키워요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 20,
    difficulty: 'medium',
    scheduledDays: [4], // Thursday
    isActive: true,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_fri',
    topicId: 'topic_exercise',
    title: '전신 유산소',
    description: '점프잭과 버피로 심폐를 강화해요',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 20,
    difficulty: 'hard',
    scheduledDays: [5], // Friday
    isActive: true,
    order: 5,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'routine_sat',
    topicId: 'topic_exercise',
    title: '가벼운 스트레칭',
    description: '한 주를 마무리하는 가벼운 스트레칭',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMin: 10,
    difficulty: 'easy',
    scheduledDays: [6], // Saturday
    isActive: true,
    order: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockRoutineProgress: RoutineProgress[] = [
  { id: 'p1', routineId: 'routine_mon', date: '2024-06-24', completed: true, completedAt: '2024-06-24T07:30:00Z' },
  { id: 'p2', routineId: 'routine_wed', date: '2024-06-26', completed: true, completedAt: '2024-06-26T07:30:00Z' },
];

export const mockPlantProgress: PlantProgress = {
  level: 35,
  vitality: 78,
  streak: 3,
  daysCompletedInCycle: 12, // 12 / 30일
  stage: 'sprout',
  state: 'healthy',
  lastUpdated: '2024-06-26',
};

export const mockUserState: UserState = {
  authStatus: 'guest',
  subscriptionStatus: 'free',
  activeTopicCount: 1,
};

export const mockRecommendedPackages: RecommendedPackage[] = [
  {
    id: 'pkg_sleep',
    title: '숙면 루틴',
    description: '깊은 잠을 위한 저녁 루틴',
    durationMin: 15,
    routineCount: 4,
    isPremium: true,
    emoji: '🌙',
  },
  {
    id: 'pkg_reading',
    title: '독서 루틴',
    description: '매일 30분 독서 습관 만들기',
    durationMin: 30,
    routineCount: 3,
    isPremium: true,
    emoji: '📖',
  },
  {
    id: 'pkg_mindfulness',
    title: '마음 챙김',
    description: '명상과 호흡으로 마음을 정리해요',
    durationMin: 10,
    routineCount: 5,
    isPremium: true,
    emoji: '🍃',
  },
];

export const ACTIVE_TOPIC_ID = 'topic_exercise';
export const MONTHLY_TARGET_DAYS = 30;
