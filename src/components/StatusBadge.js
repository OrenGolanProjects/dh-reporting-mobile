import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const statusStyles = {
  'Complete': {
    backgroundColor: appStyleConstants.COLOR_STATUS_COMPLETED,
    borderColor: appStyleConstants.COLOR_STATUS_COMPLETED_BORDER,
    textColor: appStyleConstants.COLOR_STATUS_COMPLETED_TEXT,
  },
  'In Progress': {
    backgroundColor: appStyleConstants.COLOR_STATUS_IN_PROGRESS,
    borderColor: appStyleConstants.COLOR_STATUS_IN_PROGRESS_BORDER,
    textColor: appStyleConstants.COLOR_STATUS_IN_PROGRESS_TEXT,
  },
  'Pending': {
    backgroundColor: appStyleConstants.COLOR_STATUS_PENDING,
    borderColor: appStyleConstants.COLOR_STATUS_PENDING_BORDER,
    textColor: appStyleConstants.COLOR_STATUS_PENDING_TEXT,
  },
  'Failed': {
    backgroundColor: appStyleConstants.COLOR_STATUS_FAILED,
    borderColor: appStyleConstants.COLOR_STATUS_FAILED_BORDER,
    textColor: appStyleConstants.COLOR_STATUS_FAILED_TEXT,
  },

};

const StatusBadge = ({ status }) => {
  const theme = statusStyles[status] || statusStyles['Pending'];

  return (
    <View style={[styles.badge, { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor }]}>
      <Text style={[styles.text, { color: theme.textColor }]}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: appStyleConstants.SIZE_12,
    paddingVertical: appStyleConstants.SIZE_4,
    borderRadius: appStyleConstants.SIZE_20,
    borderWidth: 1,
  },
  text: {
    fontSize: appStyleConstants.FONT_CAPTION,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
