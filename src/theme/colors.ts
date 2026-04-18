export const Colors = {
  // Primary palette — calm jade / mint / teal
  primary100: '#EAF4F2',
  primary200: '#C5E0DB',
  primary300: '#A3CEC8',
  primary400: '#86BDB7',
  primary500: '#7FAFA8', // main brand
  primary600: '#5C8F89', // interactive / darker
  primary700: '#3F6F6A',

  // Backgrounds
  background: '#F7FAF9',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFCFB',

  // Borders
  border: '#E3ECEA',
  borderLight: '#EEF5F3',

  // Text
  textPrimary: '#2F3E3D',
  textSecondary: '#8A9B99',
  textTertiary: '#B0C0BE',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#6FAFA0',
  warning: '#C9A96E',
  error: '#C0706B',

  // Fills
  mutedFill: '#F0F7F5',
  completedFill: '#E8F3F1',

  // Plant state tints
  plantHealthy: '#7FAFA8',
  plantSlowed: '#B0C0BE',
  plantRecovering: '#C9A96E',
  plantResting: '#D4CAC0',

  // Overlays
  overlay: 'rgba(47, 62, 61, 0.4)',
  overlayLight: 'rgba(47, 62, 61, 0.06)',
} as const;

export type ColorKey = keyof typeof Colors;
