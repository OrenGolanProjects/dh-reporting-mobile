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
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('🔄 Setting up database...');

        // Step 1: Initialize database connection
        await initDatabase();
        console.log('✅ Database connection established');

        // Step 2: RUN MIGRATIONS - THIS IS THE MISSING PIECE!
        console.log('🔄 Running migrations...');
        await runMigrations();
        console.log('✅ Migrations completed');

        // Step 3: Debug info (only in development)
        if (__DEV__) {
          console.log('🛠️ DEVELOPMENT MODE - Showing debug info');
          console.log(`📱 Device: ${Platform.OS} ${Platform.Version}`);
          console.log(`📐 Screen: ${SCREEN_WIDTH}x${SCREEN_HEIGHT}`);

          const version = await getLatestMigrationVersion();
          const applied = await getAppliedMigrations();
          console.log("Version:", version, "Applied:", applied.length);

          const db = await getDb();
          const tables = await db.getAllAsync(
            "SELECT name FROM sqlite_master WHERE type='table'"
          );
          console.log('Tables:', tables.map(t => t.name));

          // Check specifically for session table
          const sessionTableExists = tables.some(t => t.name === 'session');
          if (sessionTableExists) {
            console.log('✅ Session table exists!');
          } else {
            console.log('❌ Session table is missing!');

            // Emergency fix if migrations didn't create session table
            console.log('🚨 Attempting emergency fix...');
            await db.execAsync(`
              CREATE TABLE IF NOT EXISTS session (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                user_id INTEGER NOT NULL,
                signed_in_at INTEGER NOT NULL,
                last_activity INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
              );
            `);
            console.log('✅ Emergency fix applied - session table created');
          }
        }

        console.log('✅ Database setup complete!');
        setIsDbReady(true);
      } catch (error) {
        console.error('❌ Database setup failed:', error);
        console.error('Full error details:', error.stack);
        setDbError(error.message);

        setIsDbReady(true);
      }
    };

    setupDatabase();
  }, []);

  return { isDbReady, dbError };
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