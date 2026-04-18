import { PlantProgress, PlantStage, PlantState } from '../types';
import { PLANT_STAGE_LABELS, PLANT_STATE_MESSAGES } from '../constants';

const STAGE_LEVEL_THRESHOLDS: Record<PlantStage, number> = {
  seed: 0,
  sprout: 20,
  youngPlant: 40,
  bloom: 65,
  harvest: 85,
};

export const getStageFromLevel = (level: number): PlantStage => {
  if (level >= STAGE_LEVEL_THRESHOLDS.harvest) return 'harvest';
  if (level >= STAGE_LEVEL_THRESHOLDS.bloom) return 'bloom';
  if (level >= STAGE_LEVEL_THRESHOLDS.youngPlant) return 'youngPlant';
  if (level >= STAGE_LEVEL_THRESHOLDS.sprout) return 'sprout';
  return 'seed';
};

export const getPlantStateMessage = (plant: PlantProgress): string =>
  PLANT_STATE_MESSAGES[plant.state] ?? '오늘도 잘하고 있어요';

export const getPlantStageLabel = (stage: PlantStage): string =>
  PLANT_STAGE_LABELS[stage] ?? '성장 중';

export const getPlantEmoji = (stage: PlantStage, state: PlantState): string => {
  if (state === 'resting') return '🌑';
  if (state === 'recovering') return '🌱';
  const map: Record<PlantStage, string> = {
    seed: '🌰',
    sprout: '🌱',
    youngPlant: '🌿',
    bloom: '🌸',
    harvest: '🌳',
  };
  return map[stage];
};

export const getVitalityColor = (vitality: number): string => {
  if (vitality >= 70) return '#7FAFA8';
  if (vitality >= 40) return '#C9A96E';
  return '#D4CAC0';
};

// Called when a routine is completed (client-side preview; server confirms via Cloud Function)
export const calculateGrowthAfterCompletion = (plant: PlantProgress): Partial<PlantProgress> => {
  const newLevel = Math.min(100, plant.level + 2);
  return {
    vitality: Math.min(100, plant.vitality + 8),
    level: newLevel,
    stage: getStageFromLevel(newLevel),
    streak: plant.streak + 1,
    state: 'healthy',
    daysCompletedInCycle: plant.daysCompletedInCycle + 1,
  };
};

// Called when days are missed
export const calculateGrowthAfterMissedDay = (
  plant: PlantProgress,
  daysMissed: number,
): Partial<PlantProgress> => {
  const vitalityDrop = Math.min(plant.vitality - 10, daysMissed * 10);
  const newVitality = Math.max(10, plant.vitality - vitalityDrop);

  let newState: PlantState = 'slowed';
  if (daysMissed >= 5) newState = 'resting';
  else if (daysMissed >= 3) newState = 'recovering';

  return {
    vitality: newVitality,
    streak: 0,
    state: newState,
  };
};
