// src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ErpCredentialsScreen from '../screens/ErpCredentialsScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import { getCurrentUser } from '../database';
import { Session } from '../orm/models';
import { onAuthStateChange, signOut as firebaseSignOut } from '../services/firebase';
import logger from '../utils/logger';

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LogoutScreen = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await firebaseSignOut();
              await Session.clear();
              logger.log('✅ User logged out successfully');
              // Firebase onAuthStateChange listener handles navigation
            } catch (error) {
              logger.error('❌ Logout error:', error);
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appStyleConstants.COLOR_DARK,
    }}>
      <Text style={{
        color: appStyleConstants.COLOR_TEXT_LIGHT,
        fontSize: appStyleConstants.FONT_SIZE_18,
        marginBottom: appStyleConstants.SIZE_16,
      }}>
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </Text>
    </View>
  );
};


const AuthNavigator = ({ onErpSetupComplete }) => (
  <AuthStack.Navigator
    initialRouteName="Signin"
    screenOptions={{ headerShown: false }}
  >
    <AuthStack.Screen name="Signin" component={SignInScreen} />
    <AuthStack.Screen name="Signup" component={SignUpScreen} />
    <AuthStack.Screen
      name="ErpCredentials"
      component={ErpCredentialsScreen}
      initialParams={{ onComplete: onErpSetupComplete }}
    />
  </AuthStack.Navigator>
);

const ProjectsStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="ProjectsList"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen name="ProjectsList" component={ProjectsScreen} />
  </MainStack.Navigator>
);

const ProfileStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="ProfileMain"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen name="ProfileMain" component={ProfileScreen} />
    <MainStack.Screen name="Settings" component={SettingsScreen} />
  </MainStack.Navigator>
);

const ReportsStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="ReportsList"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen name="ReportsList" component={ReportsScreen} />
  </MainStack.Navigator>
);

const LogoutStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="LogoutScreen"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen
      name="LogoutScreen"
      component={LogoutScreen}
    />
  </MainStack.Navigator>
);


const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Projects"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: appStyleConstants.COLOR_PRIMARY,
      tabBarInactiveTintColor: appStyleConstants.COLOR_TEXT_MUTED,
      tabBarStyle: {
        backgroundColor: appStyleConstants.COLOR_SURFACE,
        borderTopColor: appStyleConstants.COLOR_BORDER,
        paddingTop: 8,
        paddingBottom: 8,
        height: 70,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
      },
      tabBarIcon: ({ focused, color, size }) => {
        const iconMap = {
          Projects: focused ? '📋' : '📄',
          Profile: focused ? '👤' : '👥',
          Reports: focused ? '📊' : '📈',
          Logout: '🚪',
        };
        return (
          <Text style={{ fontSize: size, color }}>
            {iconMap[route.name] || '📱'}
          </Text>
        );
      },
    })}
  >
    <Tab.Screen
      name="Projects"
      component={ProjectsStackNavigator}
      options={{ tabBarLabel: 'Projects' }}
    />
    <Tab.Screen
      name="Reports"
      component={ReportsStackNavigator}
      options={{ tabBarLabel: 'Reports' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStackNavigator}
      options={{ tabBarLabel: 'Profile' }}
    />
    <Tab.Screen
      name="Logout"
      component={LogoutStackNavigator}
      options={{ tabBarLabel: 'Logout' }}
    />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const [authState, setAuthState] = useState('checking');

  useEffect(() => {
    checkAuth();
  }, []);

  // Listen to Firebase auth state changes (event-driven, no polling needed)
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      logger.log('🔥 Firebase auth state changed:', user ? user.email : 'signed out');
      checkAuth();
    });

    return () => unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      // Run auth check and minimum splash display in parallel
      const minSplash = authState === 'checking'
        ? new Promise(resolve => setTimeout(resolve, 800))
        : Promise.resolve();

      const [, user] = await Promise.all([minSplash, getCurrentUser()]);
      const newState = user ? 'authenticated' : 'unauthenticated';

      if (authState !== newState) {
        logger.log('🔄 Auth changed:', newState);
        setAuthState(newState);
      }

    } catch (error) {
      logger.error('❌ Auth error:', error);
      if (authState !== 'unauthenticated') {
        setAuthState('unauthenticated');
      }
    }
  };

  const handleErpSetupComplete = () => {
    checkAuth();
  };

  if (authState === 'checking') {
    return <SplashScreen />;
  }

  return authState === 'authenticated' ?
    <MainTabNavigator /> :
    <AuthNavigator onErpSetupComplete={handleErpSetupComplete} />;
}
