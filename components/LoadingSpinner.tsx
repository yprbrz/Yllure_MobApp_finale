import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export function LoadingSpinner({ size = 'medium', style }: LoadingSpinnerProps) {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 48;
      default:
        return 32;
    }
  };

  const spinnerSize = getSize();

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  spinner: {
    borderWidth: 3,
    borderColor: colors.champagne,
    borderTopColor: colors.taupe,
  },
});