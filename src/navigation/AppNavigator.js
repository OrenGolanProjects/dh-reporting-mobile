// src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import NewScreen from '../screens/NewScreen';
import { ProfileScreen, SettingsScreen, HomeScreen } from '../examples/NavigationExamples';
import { getCurrentUser } from '../database';
import { Session, WorkSession } from '../orm/models';

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LogoutScreen = ({ route }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const checkAuth = route.params?.checkAuth;

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
              await Session.clear();
              console.log('✅ User logged out successfully');
              if (checkAuth) {
                checkAuth();
              }
            } catch (error) {
              console.error('❌ Logout error:', error);
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


const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="Signin"
    screenOptions={{ headerShown: false }}
  >
    <AuthStack.Screen name="Signin" component={SignInScreen} />
    <AuthStack.Screen name="Signup" component={SignUpScreen} />
  </AuthStack.Navigator>
);

const ProjectsStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="ProjectsList"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen name="ProjectsList" component={ProjectsScreen} />
    <MainStack.Screen name="NewScreen" component={NewScreen} />
    <MainStack.Screen name="ProjectDetails" component={NewScreen} />
    <MainStack.Screen name="Reports" component={NewScreen} />
  </MainStack.Navigator>
);

const ProfileStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="ProfileMain"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen name="ProfileMain" component={ProfileScreen} />
    <MainStack.Screen name="Settings" component={SettingsScreen} />
    <MainStack.Screen name="Home" component={HomeScreen} />
  </MainStack.Navigator>
);

const ReportsStackNavigator = () => (
  <MainStack.Navigator
    initialRouteName="ReportsList"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen name="ReportsList" component={NewScreen} />
    <MainStack.Screen name="ReportDetails" component={NewScreen} />
  </MainStack.Navigator>
);

const LogoutStackNavigator = ({ route }) => (
  <MainStack.Navigator
    initialRouteName="LogoutScreen"
    screenOptions={{ headerShown: false }}
  >
    <MainStack.Screen
      name="LogoutScreen"
      component={LogoutScreen}
      initialParams={{ checkAuth: route.params?.checkAuth }}
    />
  </MainStack.Navigator>
);


const MainTabNavigator = ({ checkAuth }) => (
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
      initialParams={{ checkAuth }}
    />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const [authState, setAuthState] = useState('checking');

  useEffect(() => {
    checkAuth();
  }, []);

  // Set up different intervals based on auth state
  useEffect(() => {
    let interval;

    if (authState === 'authenticated') {
      interval = setInterval(checkAuth, 30000);
      console.log('⏰ Auth validation set to every 30 seconds');
    } else if (authState === 'unauthenticated') {
      interval = setInterval(checkAuth, 5000);
      console.log('⏰ Auth validation set to every 5 seconds');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [authState]);

  const checkAuth = async () => {
    try {
      // Only show splash on initial load
      if (authState === 'checking') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const user = await getCurrentUser();
      const newState = user ? 'authenticated' : 'unauthenticated';

      if (authState !== newState) {
        console.log('🔄 Auth changed:', newState);
        setAuthState(newState);
      }

    } catch (error) {
      console.error('❌ Auth error:', error);
      if (authState !== 'unauthenticated') {
        setAuthState('unauthenticated');
      }
    }
  };

  if (authState === 'checking') {
    return <SplashScreen />;
  }

  return authState === 'authenticated' ?
    <MainTabNavigator checkAuth={checkAuth} /> :
    <AuthNavigator />;
}