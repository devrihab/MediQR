import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
          text: { color: Colors.text },
        };
      case 'outline':
        return {
          container: { backgroundColor: Colors.transparent, borderWidth: 1, borderColor: Colors.border },
          text: { color: Colors.text },
        };
      case 'ghost':
        return {
          container: { backgroundColor: Colors.transparent },
          text: { color: Colors.primaryLight },
        };
      case 'danger':
        return {
          container: { backgroundColor: Colors.error },
          text: { color: Colors.white },
        };
      case 'primary':
      default:
        return {
          container: { backgroundColor: Colors.primary },
          text: { color: Colors.white },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyles.container,
        (disabled || isLoading) && styles.disabled,
        style
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text style={[styles.text, variantStyles.text, textStyle, icon ? { marginLeft: Spacing.sm } : null]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48, // Accessibility: Touch target >= 44px
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  text: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
