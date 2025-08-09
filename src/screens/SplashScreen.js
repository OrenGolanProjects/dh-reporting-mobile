import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import PrimaryButton from '../components/buttons/PrimaryButton';
// Import our database functions
import { getCurrentUser, setCurrentUser, clearCurrentUser, getUserByEmail, createUser } from '../database';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  /**
   * Check if user is logged in using our database session system
   */
  const checkUserSession = async () => {
    try {
      console.log('🔍 Checking user session...');
      
      // Check if someone is logged in
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        console.log('✅ User is logged in:', currentUser.email);
        // User is logged in, go to projects
        setTimeout(() => {
          navigation.replace('Projects');
        }, 1500); // Show splash for 1.5 seconds
      } else {
        console.log('ℹ️ No user logged in');
        // No user logged in, go to sign in after showing splash
        setTimeout(() => {
          navigation.replace('Signin');
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error checking session:', error);
      // If error, go to sign in
      setTimeout(() => {
        navigation.replace('Signin');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a test user and log them in (for development/testing)
   */
  const simulateConnected = async () => {
    try {
      setIsLoading(true);
      console.log('🧪 Creating test user...');
      
      // Check if test user already exists
      let user = await getUserByEmail('test@dhreporting.com');
      
      if (!user) {
        // Create test user
        user = await createUser({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@dhreporting.com',
          phoneNumber: '1234567890'
        });
        console.log('✅ Test user created');
      } else {
        console.log('✅ Test user already exists');
      }
      
      // Log them in
      await setCurrentUser(user.id);
      console.log('✅ Test user logged in');
      
      navigation.replace('Projects');
    } catch (error) {
      console.error('❌ Error simulating connected user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out current user
   */
  const simulateDisconnected = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Logging out user...');
      
      await clearCurrentUser();
      console.log('✅ User logged out');
      
      navigation.replace('Signin');
    } catch (error) {
      console.error('❌ Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={appStyleConstants.STYLE_TITLE}>DH-Reporting</Text>
      
      {isLoading ? (
        <ActivityIndicator 
          size="large" 
          color={appStyleConstants.COLOR_PRIMARY} 
          style={styles.spinner} 
        />
      ) : (
        <Text style={styles.statusText}>Ready to continue</Text>
      )}

      {/* Development buttons - remove these in production */}
      <View style={styles.devButtons}>
        <PrimaryButton 
          style={styles.simulateConnected} 
          title="Create Test User & Login" 
          onPress={simulateConnected}
          disabled={isLoading}
        />
        <PrimaryButton 
          title="Logout Current User" 
          onPress={simulateDisconnected}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARKER,
    justifyContent: 'center',
    alignItems: 'center',
    padding: appStyleConstants.SIZE_16,
  },
  spinner: {
    marginVertical: appStyleConstants.SIZE_16,
  },
  statusText: {
    ...appStyleConstants.STYLE_CAPTION,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginVertical: appStyleConstants.SIZE_16,
  },
  devButtons: {
    marginTop: appStyleConstants.SIZE_32,
    width: '100%',
  },
  simulateConnected: {
    marginBottom: appStyleConstants.SIZE_16,
  }
});
