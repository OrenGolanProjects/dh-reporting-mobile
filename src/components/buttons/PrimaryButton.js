import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

const PrimaryButton = ({ title, onPress, disabled = false, loading = false }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
      <TouchableOpacity
        style={[
          buttonStyles.button,
          disabled && buttonStyles.disabled,
          loading && buttonStyles.loading,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        <Text style={[buttonStyles.text, disabled && buttonStyles.disabledText]}>
          {loading ? 'Loading...' : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: styles.COLOR_PRIMARY,
    paddingVertical: styles.SIZE_16,
    paddingHorizontal: styles.SIZE_24,
    borderRadius: styles.RADIUS_LARGE,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...styles.SHADOW_MEDIUM,
  },
  disabled: {
    backgroundColor: styles.COLOR_MUTED,
    opacity: 0.5,
  },
  loading: {
    opacity: 0.8,
  },
  text: {
    color: styles.COLOR_WHITE,
    fontSize: styles.FONT_SIZE_16,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    letterSpacing: 0.3,
  },
  disabledText: {
    color: styles.COLOR_TEXT_SUBTLE,
  },
});

export default PrimaryButton;