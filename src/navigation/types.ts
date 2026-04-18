import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Report: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  RoutineList: { topicId?: string };
  Play: { routineId: string };
  Done: { routineId: string };
  Premium: undefined;
  Auth: undefined;
  LoginPromptSheet: { trigger?: 'addTopic' | 'progress' | 'general' };
};
