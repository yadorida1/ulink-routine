import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Colors, Typography } from '../theme';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TABS: { name: keyof BottomTabParamList; label: string; icon: string; iconActive: string }[] = [
  { name: 'Home',     label: '홈',    icon: '⌂',  iconActive: '⌂'  },
  { name: 'Report',   label: '리포트', icon: '▦',  iconActive: '▦'  },
  { name: 'Settings', label: '설정',  icon: '⚙',  iconActive: '⚙'  },
];

const SCREEN_MAP = {
  Home: HomeScreen,
  Report: ReportScreen,
  Settings: SettingsScreen,
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
      {TABS.map(({ name, label, icon, iconActive }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={SCREEN_MAP[name]}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabIcon}>
                <Text style={[styles.tabSymbol, { color: focused ? Colors.primary600 : Colors.textTertiary }]}>
                  {focused ? iconActive : icon}
                </Text>
                <Text style={[styles.tabLabel, { color: focused ? Colors.primary600 : Colors.textTertiary }]}>
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
    fontSize: 18,
    lineHeight: 22,
  },
  tabLabel: {
    ...Typography.caption2,
  },
});
