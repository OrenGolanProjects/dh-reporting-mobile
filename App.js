import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, getDb, getLatestMigrationVersion, getAppliedMigrations } from './src/database';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Database initialization hook
const useDatabaseSetup = () => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('🔄 Setting up database...');
        await initDatabase();
        
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
        } else {
          console.log('🚀 PRODUCTION MODE');
        }
        
        console.log('✅ Database setup complete!');
        setIsDbReady(true);
      } catch (error) {
        console.error('❌ Database setup failed:', error);
        setDbError(error.message);
        setIsDbReady(true); // Still set to true to show error screen
      }
    };

    setupDatabase();
  }, []);

  return { isDbReady, dbError };
};

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator 
      size="large" 
      color={appStyleConstants.COLOR_PRIMARY} 
    />
    <Text style={styles.loadingText}>Initializing...</Text>
  </View>
);

// Error screen component
const ErrorScreen = ({ error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorEmoji}>⚠️</Text>
    <Text style={styles.errorTitle}>Database Error</Text>
    <Text style={styles.errorMessage}>{error}</Text>
    <Text style={styles.errorHint}>Please restart the app</Text>
  </View>
);

// Main App Content wrapped with SafeArea
const AppContent = ({ dbError }) => {
  const insets = useSafeAreaInsets();
  
  if (dbError) {
    return <ErrorScreen error={dbError} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
};

// Main App Component
const App = () => {
  const { isDbReady, dbError } = useDatabaseSetup();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"  // Always light-content for dark theme
        backgroundColor={Platform.OS === 'android' ? appStyleConstants.COLOR_DARKER : 'transparent'}
        translucent={Platform.OS === 'android'}
      />
      {!isDbReady ? (
        <SafeAreaView style={styles.container}>
          <LoadingScreen />
        </SafeAreaView>
      ) : (
        <AppContent dbError={dbError} />
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARK, // Main app dark background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appStyleConstants.COLOR_DARK, // Dark background
  },
  loadingText: {
    marginTop: appStyleConstants.SIZE_16,
    fontSize: appStyleConstants.FONT_SIZE_16,
    color: appStyleConstants.COLOR_TEXT_MUTED, // Muted text on dark
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: appStyleConstants.SIZE_24,
    backgroundColor: appStyleConstants.COLOR_DARK, // Dark background
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: appStyleConstants.SIZE_24,
  },
  errorTitle: {
    fontSize: appStyleConstants.FONT_SIZE_24,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    marginBottom: appStyleConstants.SIZE_10,
    color: appStyleConstants.COLOR_ERROR, // Error red
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  errorMessage: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    textAlign: 'center',
    marginBottom: appStyleConstants.SIZE_24,
    color: appStyleConstants.COLOR_TEXT_LIGHT, // Light text on dark
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  errorHint: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    fontStyle: 'italic',
    color: appStyleConstants.COLOR_TEXT_MUTED, // Muted text
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
});

export default App;