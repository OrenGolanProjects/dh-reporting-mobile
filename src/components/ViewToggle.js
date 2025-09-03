import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

export const ViewToggle = ({ viewMode, onViewModeChange }) => (
  <View style={styles.viewToggle}>
    <TouchableOpacity
      style={[styles.toggleButton, viewMode === 'list' && styles.activeToggleButton]}
      onPress={() => onViewModeChange('list')}
      activeOpacity={0.7}
    >
      <Text style={[styles.toggleText, viewMode === 'list' && styles.activeToggleText]}>
        List
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.toggleButton, viewMode === 'gallery' && styles.activeToggleButton]}
      onPress={() => onViewModeChange('gallery')}
      activeOpacity={0.7}
    >
      <Text style={[styles.toggleText, viewMode === 'gallery' && styles.activeToggleText]}>
        Gallery
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_12,
    padding: appStyleConstants.SIZE_4,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
  },
  toggleButton: {
    paddingVertical: appStyleConstants.SIZE_8,
    paddingHorizontal: appStyleConstants.SIZE_16,
    borderRadius: appStyleConstants.SIZE_8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  activeToggleButton: {
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
  },
  toggleText: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  activeToggleText: {
    color: appStyleConstants.COLOR_WHITE,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
});
