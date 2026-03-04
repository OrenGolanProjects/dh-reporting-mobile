// src/screens/ReportsScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import EmptyState from '../components/EmptyState';

const ReportsScreen = () => {
  return (
    <ScreenWrapper
      headerTitle="Reports"
      headerSubtitle="Work session summaries"
      headerVariant="compact"
    >
      <View style={styles.container}>
        <EmptyState
          icon="📊"
          title="Reports Coming Soon"
          subtitle="View daily and comparison reports for your work sessions"
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: appStyleConstants.SIZE_16,
  },
});

export default ReportsScreen;
