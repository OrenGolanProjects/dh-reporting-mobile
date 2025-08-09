// src/components/HiveButton.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

export default function HiveButton({ projectId, projectName, location, onStart, onEnd }) {
  const [status, setStatus] = useState('idle'); // idle | started | ended
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const tick = useRef(null); // interval id
  const [forceUpdate, setForceUpdate] = useState(0); // re-render trigger for the timer
  const componentId = useRef(Math.random().toString(36).substr(2, 9)); // unique ID for debugging

  // start/stop ticking when status changes
  useEffect(() => {
    // Clear any existing interval first
    if (tick.current) {
      clearInterval(tick.current);
      tick.current = null;
    }

    if (status === 'started') {
      // tick every second for smooth minute rollover
      tick.current = setInterval(() => {
        setForceUpdate(n => n + 1);
      }, 1000);
    }

    return () => {
      if (tick.current) {
        clearInterval(tick.current);
        tick.current = null;
      }
    };
  }, [status]);

  const handlePress = () => {
    const now = new Date();
    console.log(`[${componentId.current}] Button pressed, current status:`, status);

    if (status === 'idle' || status === 'ended') {
      console.log(`[${componentId.current}] Starting timer`);
      setStatus('started');
      setStartedAt(now);
      setEndedAt(null);
      onStart?.({ projectId, location, startAt: now });
    } else if (status === 'started') {
      console.log(`[${componentId.current}] Ending timer`);
      setStatus('ended');
      setEndedAt(now);
      onEnd?.({ projectId, location, startAt: startedAt, endAt: now });
    }
  };

  const getButtonStyle = () => {
    switch (status) {
      case 'started':
        return styles.btnStarted; // Green
      case 'ended':
        return styles.btnEnded;   // Gold
      default:
        return styles.btnIdle;    // Teal
    }
  };

  // format ms → MM:SS or HH:MM:SS if over an hour
  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    } else {
      return `${pad(mins)}:${pad(secs)}`;
    }
  };

  // compute elapsed from start→now (if running) or start→end (if ended)
  const elapsed = useMemo(() => {
    if (!startedAt) return null;
    const end = status === 'started' ? new Date() : endedAt ?? new Date();
    const diff = end.getTime() - startedAt.getTime();
    console.log(`Timer calc [${componentId.current}] ${projectName}:`, { startedAt, end, diff, formatted: formatTime(diff), status });
    return formatTime(diff);
  }, [status === 'started' ? forceUpdate : 0, startedAt, endedAt, status, projectName, componentId]);

  return (
    <Pressable onPress={handlePress} style={[styles.btn, getButtonStyle()]}>
      <Text style={styles.txt}>{projectName}</Text>
      <Text style={styles.txtSmall}>{location}</Text>
      {startedAt && (
        <Text style={styles.timer}>
          {elapsed}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: appStyleConstants.SIZE_8,
    paddingHorizontal: appStyleConstants.SIZE_12,
    borderRadius: appStyleConstants.SIZE_8,
    borderWidth: 1,
    margin: appStyleConstants.SIZE_4,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Idle → Teal
  btnIdle: {
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
    borderColor: appStyleConstants.COLOR_PRIMARY,
  },
  // Started → Green
  btnStarted: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  // Ended → Gold
  btnEnded: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  txt: {
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    fontSize: appStyleConstants.FONT_CAPTION,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_WHITE,
    textAlign: 'center',
  },
  txtSmall: {
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    fontSize: appStyleConstants.FONT_SIZE_12 - 2, // 10px
    fontWeight: appStyleConstants.FONT_WEIGHT_REGULAR,
    color: appStyleConstants.COLOR_WHITE,
    textAlign: 'center',
  },
  timer: {
    marginTop: appStyleConstants.SIZE_4 / 2, // 2px
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    fontSize: appStyleConstants.FONT_SIZE_12 - 2, // 10px
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_WHITE,
  },
});