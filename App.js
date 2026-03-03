// App.js
import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, Dimensions, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, getDb, getLatestMigrationVersion, getAppliedMigrations, runMigrations } from './src/database';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const useDatabaseSetup = () => {
  const [status, setStatus] = useState({ ready: false, error: null });

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        await runMigrations();
        setStatus({ ready: true, error: null });
      } catch (error) {
        console.error('Database setup failed:', error);
        setStatus({ ready: true, error: error.message });
      }
    };
    setup();
  }, []);

  return status;
};

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.appTitle}>DH-Reporting</Text>
    <ActivityIndicator 
      size="large" 
      color={appStyleConstants.COLOR_PRIMARY} 
      style={styles.spinner}
    />
    <Text style={styles.loadingText}>Initializing database...</Text>
  </View>
);

const ErrorScreen = ({ error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorEmoji}>⚠️</Text>
    <Text style={styles.errorTitle}>Database Error</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    <Text style={styles.errorHint}>Please restart the app</Text>
  </View>
);

const App = () => {
  const { isDbReady, dbError } = useDatabaseSetup();

  if (!isDbReady) {
    return (
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Platform.OS === 'android' ? appStyleConstants.COLOR_DARKER : 'transparent'}
          translucent={Platform.OS === 'android'}
        />
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  if (dbError) {
    return (
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Platform.OS === 'android' ? appStyleConstants.COLOR_DARKER : 'transparent'}
          translucent={Platform.OS === 'android'}
        />
        <ErrorScreen error={dbError} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === 'android' ? appStyleConstants.COLOR_DARKER : 'transparent'}
        translucent={Platform.OS === 'android'}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appStyleConstants.COLOR_DARKER,
    padding: appStyleConstants.SIZE_24,
  },
  appTitle: {
    fontSize: appStyleConstants.SIZE_32,
    fontWeight: 'bold',
    color: appStyleConstants.COLOR_PRIMARY,
    marginBottom: appStyleConstants.SIZE_48,
    textAlign: 'center',
  },
  spinner: {
    marginBottom: appStyleConstants.SIZE_16,
  },
  loadingText: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: appStyleConstants.SIZE_24,
    backgroundColor: appStyleConstants.COLOR_DARK,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: appStyleConstants.SIZE_24,
  },
  errorTitle: {
    fontSize: appStyleConstants.FONT_SIZE_24,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    marginBottom: appStyleConstants.SIZE_16,
    color: appStyleConstants.COLOR_ERROR,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    textAlign: 'center',
    marginBottom: appStyleConstants.SIZE_24,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    lineHeight: 24,
  },
  errorHint: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    fontStyle: 'italic',
    color: appStyleConstants.COLOR_TEXT_MUTED,
    textAlign: 'center',
  },
});

export default App;