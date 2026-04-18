import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import RoutineListScreen from '../screens/RoutineListScreen';
import PlayScreen from '../screens/PlayScreen';
import DoneScreen from '../screens/DoneScreen';
import PremiumScreen from '../screens/PremiumScreen';
import AuthScreen from '../screens/AuthScreen';
import LoginPromptSheet from '../screens/LoginPromptSheet';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="RoutineList" component={RoutineListScreen} />
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="Done" component={DoneScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen
          name="LoginPromptSheet"
          component={LoginPromptSheet}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
