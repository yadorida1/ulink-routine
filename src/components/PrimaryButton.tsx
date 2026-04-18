import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Radius, ButtonHeight } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'solid' | 'outline';
}

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'solid',
}: Props) {
  const isSolid = variant === 'solid';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        isSolid ? styles.solid : styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? Colors.textInverse : Colors.primary600} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            isSolid ? styles.labelSolid : styles.labelOutline,
            (disabled || loading) && styles.labelDisabled,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: ButtonHeight.primary,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  solid: {
    backgroundColor: Colors.primary600,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary600,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...Typography.body1,
  },
  labelSolid: {
    color: Colors.textInverse,
  },
  labelOutline: {
    color: Colors.primary600,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});
