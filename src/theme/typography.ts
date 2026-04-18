import { TextStyle } from 'react-native';

export const FontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: FontWeights.semibold,
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,
  title1: {
    fontSize: 28,
    fontWeight: FontWeights.semibold,
    lineHeight: 36,
    letterSpacing: -0.3,
  } as TextStyle,
  title2: {
    fontSize: 24,
    fontWeight: FontWeights.semibold,
    lineHeight: 32,
    letterSpacing: -0.2,
  } as TextStyle,
  heading: {
    fontSize: 20,
    fontWeight: FontWeights.semibold,
    lineHeight: 28,
    letterSpacing: -0.1,
  } as TextStyle,
  body1: {
    fontSize: 16,
    fontWeight: FontWeights.medium,
    lineHeight: 24,
  } as TextStyle,
  body2: {
    fontSize: 15,
    fontWeight: FontWeights.regular,
    lineHeight: 22,
  } as TextStyle,
  caption1: {
    fontSize: 13,
    fontWeight: FontWeights.medium,
    lineHeight: 18,
  } as TextStyle,
  caption2: {
    fontSize: 12,
    fontWeight: FontWeights.regular,
    lineHeight: 16,
  } as TextStyle,
} as const;
