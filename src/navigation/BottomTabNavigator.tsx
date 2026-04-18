import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import RoutineListScreen from '../screens/RoutineListScreen';
import ReportScreen from '../screens/ReportScreen';
import MyScreen from '../screens/MyScreen';
import { Colors, Typography } from '../theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ITEMS: {
  name: keyof BottomTabParamList;
  label: string;
  emoji: string;
  activeEmoji: string;
}[] = [
  { name: 'Home', label: '홈', emoji: '○', activeEmoji: '●' },
  { name: 'RoutineList', label: '루틴', emoji: '☰', activeEmoji: '☰' },
  { name: 'Report', label: '리포트', emoji: '◫', activeEmoji: '◫' },
  { name: 'My', label: '내 정보', emoji: '◯', activeEmoji: '◉' },
];

const SCREEN_MAP = {
  Home: HomeScreen,
  RoutineList: RoutineListScreen,
  Report: ReportScreen,
  My: MyScreen,
} as const;

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { height: 58 + insets.bottom, paddingBottom: insets.bottom },
        ],
      }}
    >
      {TAB_ITEMS.map(({ name, label, emoji, activeEmoji }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={SCREEN_MAP[name]}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabIcon}>
                <Text
                  style={[
                    styles.tabSymbol,
                    { color: focused ? Colors.primary600 : Colors.textTertiary },
                  ]}
                >
                  {focused ? activeEmoji : emoji}
                </Text>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: focused ? Colors.primary600 : Colors.textTertiary },
                  ]}
                >
                  {label}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Platform.select({
      ios: { shadowColor: 'transparent' },
      android: { elevation: 8 },
    }),
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 3,
  },
  tabSymbol: {
    fontSize: 16,
    lineHeight: 20,
  },
  tabLabel: {
    ...Typography.caption2,
  },
});
