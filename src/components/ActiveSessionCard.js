// components/ActiveSessionCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

export const ActiveSessionCard = ({ activeSession }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [activeSession]);

  const getElapsedTime = () => {
    if (!activeSession) return null;
    const start = activeSession.start_work_time;
    if (!start) return null;
    const elapsed = currentTime - start;
    const h = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
    const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!activeSession) return null;

  return (
    <View style={styles.container}>
      <View style={styles.activeCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.activeTitle}>Currently Working</Text>
          <Text style={styles.activeProject}>{activeSession.project_name}</Text>
          <Text style={styles.activeLocation}>
            📍 {activeSession.active_location || '—'}
          </Text>
        </View>
        <Text style={styles.activeTime}>{getElapsedTime() || ''}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: appStyleConstants.SIZE_16, // Added top padding here
  },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
    borderRadius: appStyleConstants.SIZE_16,
    padding: appStyleConstants.SIZE_16,
    marginBottom: appStyleConstants.SIZE_32,
    ...appStyleConstants.SHADOW_BOX_2,
  },
  activeTitle: {
    fontSize: appStyleConstants.FONT_SIZE_12,
    color: appStyleConstants.COLOR_WHITE,
    opacity: 0.85,
    marginBottom: appStyleConstants.SIZE_4,
    textTransform: 'uppercase',
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
  },
  activeProject: {
    fontSize: appStyleConstants.FONT_SIZE_20,
    color: appStyleConstants.COLOR_WHITE,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  activeLocation: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    color: appStyleConstants.COLOR_WHITE,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  activeTime: {
    fontSize: appStyleConstants.FONT_SIZE_24,
    color: appStyleConstants.COLOR_WHITE,
    paddingLeft: appStyleConstants.SIZE_12,
    fontFamily: 'monospace',
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
});

export default ActiveSessionCard;
