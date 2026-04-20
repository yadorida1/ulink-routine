export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Typography = {
  display:  { fontSize: 32, fontWeight: FontWeights.semibold, lineHeight: 40, letterSpacing: -0.5 },
  title1:   { fontSize: 28, fontWeight: FontWeights.semibold, lineHeight: 36, letterSpacing: -0.3 },
  title2:   { fontSize: 24, fontWeight: FontWeights.semibold, lineHeight: 32, letterSpacing: -0.2 },
  heading:  { fontSize: 20, fontWeight: FontWeights.semibold, lineHeight: 28, letterSpacing: -0.1 },
  body1:    { fontSize: 16, fontWeight: FontWeights.medium,   lineHeight: 24 },
  body2:    { fontSize: 15, fontWeight: FontWeights.regular,  lineHeight: 22 },
  caption1: { fontSize: 13, fontWeight: FontWeights.medium,   lineHeight: 18 },
  caption2: { fontSize: 12, fontWeight: FontWeights.regular,  lineHeight: 16 },
} as const;
