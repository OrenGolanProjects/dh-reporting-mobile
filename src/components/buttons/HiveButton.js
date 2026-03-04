import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const HiveButton = ({
  projectName,
  location,
  status = 'idle', // 'idle' | 'starting' | 'started' | 'ending'
  onPress,
  isDisabled,
  elapsedTime,
  width = '100%',
  height = 80,
}) => {
  const isActive = status === 'started';
  const isTransitioning = status === 'starting' || status === 'ending';
  const buttonDisabled = isDisabled || isTransitioning;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, { width, height }];
    if (isDisabled) return [...baseStyle, styles.disabledButton];
    if (isActive) return [...baseStyle, styles.activeButton];
    return baseStyle;
  };

  const getButtonText = () => {
    if (status === 'starting') return 'Starting...';
    if (status === 'ending') return 'Ending...';
    if (isActive && elapsedTime) return elapsedTime;
    return location;
  };

  const getTextStyle = () => {
    if (isDisabled) return styles.disabledText;
    if (isActive) return styles.activeText;
    return styles.locationText;
  };

  const getProjectNameStyle = () => {
    if (isDisabled) return [styles.projectName, styles.disabledText];
    if (isActive) return [styles.projectName, styles.activeText];
    return styles.projectName;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={buttonDisabled}
      activeOpacity={isDisabled ? 1 : 0.7}
      accessibilityRole="button"
      accessibilityLabel={`${projectName} ${location}`}
      accessibilityState={{ disabled: buttonDisabled, selected: isActive }}
    >
      <View style={styles.content}>
        <Text style={getProjectNameStyle()} numberOfLines={1}>
          {projectName}
        </Text>
        <Text style={getTextStyle()} numberOfLines={1}>
          {getButtonText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_8,
    padding: appStyleConstants.SIZE_8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: appStyleConstants.COLOR_BORDER,
    ...appStyleConstants.SHADOW_BOX_2,
  },
  activeButton: {
    backgroundColor: appStyleConstants.COLOR_PRIMARY_DARK,
    borderColor: appStyleConstants.COLOR_SECONDARY,
  },
  disabledButton: {
    backgroundColor: appStyleConstants.COLOR_DARK,
    borderColor: appStyleConstants.COLOR_BORDER,
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  projectName: {
    ...appStyleConstants.STYLE_CAPTION,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: appStyleConstants.SIZE_4,
  },
  locationText: {
    fontSize: appStyleConstants.FONT_SIZE_12,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    fontWeight: appStyleConstants.FONT_WEIGHT_REGULAR,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    textAlign: 'center',
  },
  activeText: {
    color: appStyleConstants.COLOR_WHITE,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
  disabledText: {
    color: appStyleConstants.COLOR_TEXT_MUTED,
    opacity: 0.7,
  },
});

export default HiveButton;
