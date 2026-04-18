// Firestore data repositories
//
// INTEGRATION POINT: Cloud Firestore
// ─────────────────────────────────────────────────────────────────────────────
// Install: @react-native-firebase/firestore
// Import:  import firestore from '@react-native-firebase/firestore';
//
// Firestore collection structure:
//   users/{userId}/
//     topics/{topicId}        → Topic documents
//     routines/{routineId}    → Routine documents
//     progress/{progressId}  → RoutineProgress documents
//     plant/current           → PlantProgress document
//
// INTEGRATION POINT: Cloud Functions (2nd gen)
// ─────────────────────────────────────────────────────────────────────────────
// Functions to implement in functions/src/index.ts:
//   onRoutineCompleted  → triggered by progress write → updates plant growth
//   onDailySchedule     → scheduled function → checks missed days
//   onMonthlyHarvest    → scheduled function → archives cycle, resets state
// ─────────────────────────────────────────────────────────────────────────────

import { Topic, Routine, RoutineProgress, PlantProgress } from '../../types';
import {
  mockTopics,
  mockRoutines,
  mockRoutineProgress,
  mockPlantProgress,
} from '../../data/mockData';

export const topicsRepository = {
  getAll: async (_userId: string): Promise<Topic[]> => {
    // TODO: const snap = await firestore().collection('users').doc(userId).collection('topics').get();
    // return snap.docs.map(d => ({ id: d.id, ...d.data() } as Topic));
    return mockTopics;
  },

  create: async (_userId: string, topic: Omit<Topic, 'id'>): Promise<Topic> => {
    // TODO: const ref = await firestore().collection('users').doc(userId).collection('topics').add(topic);
    // return { ...topic, id: ref.id };
    return { ...topic, id: `topic_${Date.now()}` };
  },

  update: async (_userId: string, _topicId: string, _updates: Partial<Topic>): Promise<void> => {
    // TODO: await firestore().collection('users').doc(userId).collection('topics').doc(topicId).update(updates);
  },
};

export const routinesRepository = {
  getAll: async (_userId: string): Promise<Routine[]> => {
    // TODO: const snap = await firestore().collection('users').doc(userId).collection('routines').orderBy('order').get();
    return mockRoutines;
  },

  getByTopic: async (_userId: string, topicId: string): Promise<Routine[]> => {
    // TODO: const snap = await firestore().collection('users').doc(userId)
    //   .collection('routines').where('topicId', '==', topicId).orderBy('order').get();
    return mockRoutines.filter(r => r.topicId === topicId);
  },

  create: async (_userId: string, routine: Omit<Routine, 'id'>): Promise<Routine> => {
    // TODO: const ref = await firestore().collection('users').doc(userId).collection('routines').add(routine);
    return { ...routine, id: `routine_${Date.now()}` };
  },
};

export const progressRepository = {
  getByDateRange: async (
    _userId: string,
    startDate: string,
    endDate: string,
  ): Promise<RoutineProgress[]> => {
    // TODO: const snap = await firestore().collection('users').doc(userId).collection('progress')
    //   .where('date', '>=', startDate).where('date', '<=', endDate).get();
    return mockRoutineProgress.filter(p => p.date >= startDate && p.date <= endDate);
  },

  markCompleted: async (
    _userId: string,
    routineId: string,
    date: string,
  ): Promise<RoutineProgress> => {
    // INTEGRATION POINT: Cloud Function listens to this write to trigger plant growth calculation
    // TODO: const ref = await firestore().collection('users').doc(userId).collection('progress').add({
    //   routineId, date, completed: true, completedAt: firestore.FieldValue.serverTimestamp(),
    // });
    return {
      id: `prog_${Date.now()}`,
      routineId,
      date,
      completed: true,
      completedAt: new Date().toISOString(),
    };
  },
};

export const plantRepository = {
  get: async (_userId: string): Promise<PlantProgress> => {
    // TODO: const doc = await firestore().collection('users').doc(userId).collection('plant').doc('current').get();
    return mockPlantProgress;
  },

  update: async (_userId: string, _updates: Partial<PlantProgress>): Promise<void> => {
    // TODO: await firestore().collection('users').doc(userId).collection('plant').doc('current').update(updates);
  },
};
