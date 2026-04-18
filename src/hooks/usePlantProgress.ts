import { useState, useCallback } from 'react';
import { PlantProgress } from '../types';
import { mockPlantProgress } from '../data/mockData';
import { calculateGrowthAfterCompletion, calculateGrowthAfterMissedDay } from '../utils/plantUtils';
import { getToday } from '../utils/dateUtils';

// INTEGRATION POINT: Firestore + Cloud Functions
// In production, plant growth is calculated server-side via Cloud Functions
// to prevent client-side manipulation. The client reads plant state from Firestore.
//
// Client-side update here is an optimistic preview only.
// The authoritative update comes from onRoutineCompleted Cloud Function.

export const usePlantProgress = () => {
  const [plant, setPlant] = useState<PlantProgress>(mockPlantProgress);

  const onRoutineCompleted = useCallback(() => {
    setPlant(prev => ({
      ...prev,
      ...calculateGrowthAfterCompletion(prev),
      lastUpdated: getToday(),
    }));
    // INTEGRATION POINT: Cloud Function triggered by Firestore write in progressRepository.markCompleted
  }, []);

  const onDayMissed = useCallback((daysMissed: number) => {
    setPlant(prev => ({
      ...prev,
      ...calculateGrowthAfterMissedDay(prev, daysMissed),
      lastUpdated: getToday(),
    }));
  }, []);

  return { plant, onRoutineCompleted, onDayMissed };
};
