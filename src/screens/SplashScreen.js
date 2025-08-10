import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import { getCurrentUser } from '../database';

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
      // Check if someone is logged in
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        // User is logged in, go to projects
        setTimeout(() => {
          navigation.replace('Projects', { user: currentUser }); 
        }, 1000); // Show splash for 1.5 seconds
      } else {
        // No user logged in, go to sign in after showing splash
        setTimeout(() => {
          navigation.replace('Signin');
        }, 1000);
      }
    } catch (error) {
      // If error, go to sign in
      setTimeout(() => {
        navigation.replace('Signin');
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

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

export default SplashScreen;

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