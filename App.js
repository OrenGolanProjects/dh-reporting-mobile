// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase, runMigrations } from './src/database';
// Remove this line: import { testMigrations } from './src/testDatabase';

const App = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('🔄 Setting up database...');

        // Step 1: Open database connection
        await initDatabase();

        // Step 2: Run any new migrations
        await runMigrations();

        // Remove this line: await testMigrations();

        console.log('✅ Database setup complete!');
      } catch (error) {
        console.error('❌ Database setup failed:', error);
      }
    };

    // Run setup when app starts
    setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;