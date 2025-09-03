import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

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
    <View style={cardStyles.container}>
      <View style={cardStyles.card}>
        <View style={cardStyles.leftSection}>
          <View style={cardStyles.indicator} />
          <View style={cardStyles.textContent}>
            <Text style={cardStyles.label}>Currently Working</Text>
            <Text style={cardStyles.projectName}>{activeSession.project_name}</Text>
            <Text style={cardStyles.location}>
              {activeSession.active_location || 'Remote'}
            </Text>
          </View>
        </View>
        
        <View style={cardStyles.timerSection}>
          <Text style={cardStyles.timer}>{getElapsedTime()}</Text>
        </View>
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    paddingTop: styles.SIZE_16,
    paddingHorizontal: styles.SIZE_4,
  },
  card: {
    backgroundColor: styles.COLOR_PRIMARY,
    borderRadius: styles.RADIUS_LARGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: styles.SIZE_20,
    marginBottom: styles.SIZE_24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    width: 3,
    height: 40,
    backgroundColor: styles.COLOR_WHITE,
    borderRadius: 2,
    marginRight: styles.SIZE_16,
    opacity: 0.8,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontSize: styles.FONT_SIZE_10,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_WHITE,
    opacity: 0.8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    marginBottom: styles.SIZE_4,
  },
  projectName: {
    fontSize: styles.FONT_SIZE_18,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_WHITE,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    marginBottom: styles.SIZE_2,
  },
  location: {
    fontSize: styles.FONT_SIZE_14,
    color: styles.COLOR_WHITE,
    opacity: 0.9,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
  },
  timerSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: styles.RADIUS_MEDIUM,
    paddingHorizontal: styles.SIZE_16,
    paddingVertical: styles.SIZE_10,
  },
  timer: {
    fontSize: styles.FONT_SIZE_20,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_WHITE,
    fontFamily: 'monospace',
  },
});