import { PlantStage, PlantState } from '../types';

export const APP_NAME = 'ULink Routine';
export const APP_NAME_KO = '유링크 루틴';
export const APP_TAGLINE = '링크로 만드는 습관 관리';

export const PLANT_STAGES: PlantStage[] = ['seed', 'sprout', 'youngPlant', 'bloom', 'harvest'];

export const PLANT_STAGE_LABELS: Record<PlantStage, string> = {
  seed: '씨앗',
  sprout: '새싹',
  youngPlant: '어린 식물',
  bloom: '꽃',
  harvest: '열매',
};

export const PLANT_STATE_MESSAGES: Record<PlantState, string> = {
  healthy: '좋은 흐름을 이어가고 있어요',
  slowed: '조금 쉬어가도 괜찮아요',
  recovering: '내일 다시 하면 금방 회복할 수 있어요',
  resting: '식물이 조용히 기다리고 있어요',
};

export const PLANT_COMPLETION_MESSAGES = [
  '오늘도 잘하고 있어요',
  '식물이 조금 자랐어요',
  '좋은 습관이 쌓이고 있어요',
  '꾸준함이 빛나고 있어요',
];

export const WEEK_DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export const GUEST_TOPIC_LIMIT = 1;
export const FREE_TOPIC_LIMIT = 1;

export const STORAGE_KEYS = {
  USER_STATE: '@ulink/user_state',
  ROUTINE_PROGRESS: '@ulink/routine_progress',
  PLANT_PROGRESS: '@ulink/plant_progress',
  TOPICS: '@ulink/topics',
  ROUTINES: '@ulink/routines',
} as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};
