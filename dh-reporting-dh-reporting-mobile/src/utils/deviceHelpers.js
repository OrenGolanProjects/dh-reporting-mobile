import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Screen dimensions
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Responsive sizing helpers
export const wp = (widthPercent) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return Math.round((SCREEN_WIDTH * elemWidth) / 100);
};

export const hp = (heightPercent) => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return Math.round((SCREEN_HEIGHT * elemHeight) / 100);
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

// Safe area helpers
export const getStatusBarHeight = () => {
  if (isIOS) {
    return isSmallDevice ? 20 : 44; // iPhone SE vs iPhone with notch
  }
  return StatusBar.currentHeight || 0;
};

export const getBottomSpace = () => {
  if (isIOS) {
    return isSmallDevice ? 0 : 34; // iPhone SE vs iPhone with home indicator
  }
  return 0;
};

// Platform-specific styles helper
export const platformStyles = (iosStyle, androidStyle) => {
  return Platform.select({
    ios: iosStyle,
    android: androidStyle,
  });
};
