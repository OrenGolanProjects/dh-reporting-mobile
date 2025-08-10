// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, getDb, getLatestMigrationVersion, getAppliedMigrations } from './src/database';

const App = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('🔄 Setting up database...');
        await initDatabase();
        
        // Check if running in development mode
        const isDev = __DEV__;  // ← React Native built-in variable
        
        if (isDev) {
          console.log('🛠️ DEVELOPMENT MODE - Showing debug info');
          
          // Only show migration status in development
          const version = await getLatestMigrationVersion();
          const applied = await getAppliedMigrations();
          console.log("Version:", version, "Applied:", applied.length);
          
          // Only show tables in development
          const db = await getDb();
          const tables = await db.getAllAsync(
            "SELECT name FROM sqlite_master WHERE type='table'"
          );
          console.log('Tables:', tables.map(t => t.name));
        } else {
          console.log('🚀 PRODUCTION MODE - Debug info hidden');
        }
        
        console.log('✅ Database setup complete!');
      } catch (error) {
        console.error('❌ Database setup failed:', error);
      }
    };

    setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;