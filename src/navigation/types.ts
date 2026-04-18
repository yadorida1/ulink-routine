import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  RoutineList: undefined;
  Report: undefined;
  My: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  Play: { routineId: string };
  Done: { routineId: string };
  Premium: undefined;
  Auth: undefined;
  LoginPromptSheet: { trigger?: 'addTopic' | 'progress' | 'general' };
};
