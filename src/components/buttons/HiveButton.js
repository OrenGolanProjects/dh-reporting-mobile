import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const HiveButton = ({ 
  projectId, 
  projectName, 
  location, 
  onStart, 
  onEnd, 
  isActive,
  isDisabled, // NEW: disable when other buttons are active
  elapsedTime,
  width = "100%", 
  height = 80 
}) => {
  const [internalStatus, setInternalStatus] = useState('idle');

  // Sync internal status with parent's isActive prop
  useEffect(() => {
    if (isActive && internalStatus !== 'started') {
      setInternalStatus('started');
    } else if (!isActive && internalStatus === 'started') {
      setInternalStatus('idle');
    }
  }, [isActive]);

  const handlePress = useCallback(async () => {
    // Don't allow press if disabled or in transition
    if (isDisabled || internalStatus === 'starting' || internalStatus === 'ending') {
      return;
    }

    const now = new Date();
    
    console.log(`[Button] ${projectName} (${location}) pressed, isActive: ${isActive}, isDisabled: ${isDisabled}`);
    
    if (isActive) {
      // End the current session - don't calculate startAt, let parent handle it
      setInternalStatus('ending');
      try {
        await onEnd({
          projectId,
          location,
          endAt: now
          // Remove startAt - the parent has the real start time from database
        });
        setInternalStatus('idle');
      } catch (error) {
        console.error('Error ending session:', error);
        setInternalStatus('started'); // Revert on error
      }
    } else {
      // Start a new session
      setInternalStatus('starting');
      try {
        await onStart({
          projectId,
          location,
          startAt: now
        });
        setInternalStatus('started');
      } catch (error) {
        console.error('Error starting session:', error);
        setInternalStatus('idle'); // Revert on error
      }
    }
  }, [isActive, isDisabled, projectId, location, projectName, onStart, onEnd, internalStatus]);

  // Helper function to parse elapsed time string to seconds
  const parseElapsedTime = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, { width, height }];
    
    if (isDisabled) {
      return [...baseStyle, styles.disabledButton];
    }
    
    if (isActive) {
      return [...baseStyle, styles.activeButton];
    }
    
    return baseStyle;
  };

  const getButtonText = () => {
    if (internalStatus === 'starting') return 'Starting...';
    if (internalStatus === 'ending') return 'Ending...';
    if (isActive && elapsedTime) return elapsedTime;
    return location;
  };

  const getTextStyle = () => {
    if (isDisabled) {
      return styles.disabledText;
    }
    if (isActive) {
      return styles.activeText;
    }
    return styles.locationText;
  };

  const getProjectNameStyle = () => {
    if (isDisabled) {
      return [styles.projectName, styles.disabledText];
    }
    if (isActive) {
      return [styles.projectName, styles.activeText];
    }
    return styles.projectName;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={isDisabled || internalStatus === 'starting' || internalStatus === 'ending'}
      activeOpacity={isDisabled ? 1 : 0.7}
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
    backgroundColor: appStyleConstants.COLOR_TIMER_ACTIVE,
    borderColor: appStyleConstants.COLOR_SECONDARY,
  },
  disabledButton: {
    backgroundColor: appStyleConstants.COLOR_DARK,
    borderColor: appStyleConstants.COLOR_MUTED,
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