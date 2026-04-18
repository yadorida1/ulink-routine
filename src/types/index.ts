// Core domain types for ULink Routine
// Designed to map cleanly to Firebase/Firestore documents when backend is integrated

export type AuthStatus = 'guest' | 'signedIn';
export type SubscriptionStatus = 'free' | 'premium';
export type PlantState = 'healthy' | 'slowed' | 'recovering' | 'resting';
export type PlantStage = 'seed' | 'sprout' | 'youngPlant' | 'bloom' | 'harvest';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

// Maps to Firestore: users/{userId}/topics/{topicId}
export interface Topic {
  id: string;
  name: string;
  description?: string;
  isPremiumOnly: boolean;
  isLocked: boolean;
  iconEmoji?: string;
  createdAt: string; // ISO string → Firestore Timestamp later
}

// Maps to Firestore: users/{userId}/routines/{routineId}
export interface Routine {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  youtubeUrl?: string;
  durationMin: number;
  difficulty: Difficulty;
  scheduledDays: DayOfWeek[];
  isActive: boolean;
  order: number;
  createdAt: string;
}

// Maps to Firestore: users/{userId}/progress/{progressId}
export interface RoutineProgress {
  id: string;
  routineId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO datetime
}

// Maps to Firestore: users/{userId}/plant/current
export interface PlantProgress {
  level: number;       // 0–100: overall growth
  vitality: number;    // 0–100: current energy/health
  streak: number;      // consecutive completed days
  daysCompletedInCycle: number;
  stage: PlantStage;
  state: PlantState;
  lastUpdated: string; // YYYY-MM-DD
}

// Local + maps to Firestore: users/{userId} document
export interface UserState {
  authStatus: AuthStatus;
  subscriptionStatus: SubscriptionStatus;
  activeTopicCount: number;
  userId?: string;       // Firebase UID
  displayName?: string;
  email?: string;
}

export interface WeeklyReport {
  weekStartDate: string; // YYYY-MM-DD (Monday)
  totalRoutines: number;
  completedRoutines: number;
  successRate: number;   // 0–1
  completedDates: string[];
  streakDays: number;
}

export interface RecommendedPackage {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  routineCount: number;
  isPremium: boolean;
  emoji: string;
}
