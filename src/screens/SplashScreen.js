// src/screens/SplashScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>DH-Reporting</Text>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={appStyleConstants.COLOR_PRIMARY} 
          style={styles.spinner} 
        />
        <Text style={styles.loadingText}>
          {isLoading ? 'Loading...' : 'Ready'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARKER,
    justifyContent: 'center',
    alignItems: 'center',
    padding: appStyleConstants.SIZE_16,
  },
  appTitle: {
    ...appStyleConstants.STYLE_TITLE,
    color: appStyleConstants.COLOR_PRIMARY,
    fontSize: appStyleConstants.SIZE_32,
    fontWeight: 'bold',
    marginBottom: appStyleConstants.SIZE_48,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginTop: appStyleConstants.SIZE_24,
    marginBottom: appStyleConstants.SIZE_16,
  },
  loadingText: {
    ...appStyleConstants.STYLE_CAPTION,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    fontSize: appStyleConstants.SIZE_16,
    textAlign: 'center',
  },
});

export default SplashScreen;