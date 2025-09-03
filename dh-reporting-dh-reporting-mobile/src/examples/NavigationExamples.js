// src/examples/NavigationExamples.js
// Navigation Components Usage Examples - Best Practices
// This file demonstrates proper usage patterns for React Navigation components

import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';


// =============================================================================
// 4. SCREEN WRAPPER EXAMPLES - Best Practices
// =============================================================================

/**
 * ✅ BEST PRACTICE: Simple Content Screen
 * Basic screen with header and body content
 */
const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper
      headerTitle="Welcome Home"
      headerSubtitle="Your project dashboard"
    >
      <View style={styles.homeContent}>
        <Text style={styles.welcomeText}>Welcome to DH Reporting!</Text>
        
        <PrimaryButton
          title="View Projects"
          onPress={() => navigation.navigate('Projects')}
          style={styles.actionButton}
        />
        
        <SecondaryButton
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
          style={styles.actionButton}
        />
      </View>
    </ScreenWrapper>
  );
};

/**
 * ✅ BEST PRACTICE: Scrollable Content Screen
 * Long content that requires scrolling
 */
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Project Manager',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper
        headerTitle="Profile"
        footer={
          <SecondaryButton
            title="Back"
            onPress={() => navigation.goBack()}
          />
        }
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appStyleConstants.COLOR_PRIMARY} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      headerTitle="Profile"
      headerSubtitle="Manage your account"
      scroll // ✅ Enable scrolling for long content
      footer={
        <View style={styles.footerActions}>
          <SecondaryButton
            title="Back"
            onPress={() => navigation.goBack()}
          />
          <PrimaryButton
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
        </View>
      }
    >
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Text style={styles.fieldLabel}>Name</Text>
        <Text style={styles.fieldValue}>{user?.name}</Text>
        
        <Text style={styles.fieldLabel}>Email</Text>
        <Text style={styles.fieldValue}>{user?.email}</Text>
        
        <Text style={styles.fieldLabel}>Role</Text>
        <Text style={styles.fieldValue}>{user?.role}</Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {/* More content that requires scrolling */}
        {Array.from({ length: 10 }, (_, i) => (
          <View key={i} style={styles.preferenceItem}>
            <Text style={styles.fieldLabel}>Setting {i + 1}</Text>
            <Text style={styles.fieldValue}>Value {i + 1}</Text>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};


/**
 * ✅ BEST PRACTICE: Card-based Content Screen
 * Using the card prop for elevated content
 */
const SettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
  });

  return (
    <ScreenWrapper
      headerTitle="Settings"
      headerSubtitle="Customize your experience"
      card // ✅ Content in an elevated card
      footer={
        <SecondaryButton
          title="Back"
          onPress={() => navigation.goBack()}
        />
      }
    >
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>App Preferences</Text>
        
        {Object.entries(settings).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <TouchableOpacity
              style={[styles.toggle, value && styles.toggleActive]}
              onPress={() => setSettings(prev => ({ ...prev, [key]: !value }))}
            >
              <Text style={styles.toggleText}>{value ? 'ON' : 'OFF'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  // Home Screen
  homeContent: {
    flex: 1,
    padding: appStyleConstants.SIZE_24,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: appStyleConstants.FONT_SIZE_24,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: appStyleConstants.SIZE_32,
    fontWeight: '600',
  },
  actionButton: {
    marginVertical: appStyleConstants.SIZE_8,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: appStyleConstants.SIZE_24,
  },
  loadingText: {
    marginTop: appStyleConstants.SIZE_16,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    fontSize: appStyleConstants.FONT_SIZE_16,
  },

  // Profile Screen
  profileSection: {
    marginBottom: appStyleConstants.SIZE_32,
  },
  sectionTitle: {
    fontSize: appStyleConstants.FONT_SIZE_20,
    fontWeight: '600',
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_16,
  },
  fieldLabel: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginBottom: appStyleConstants.SIZE_4,
    marginTop: appStyleConstants.SIZE_12,
  },
  fieldValue: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontWeight: '500',
  },
  preferenceItem: {
    marginBottom: appStyleConstants.SIZE_12,
  },

  // Footer Actions
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: appStyleConstants.SIZE_12,
  },

  // Settings Screen
  settingsContainer: {
    padding: appStyleConstants.SIZE_4,
  },
  settingsTitle: {
    fontSize: appStyleConstants.FONT_SIZE_18,
    fontWeight: '600',
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: appStyleConstants.SIZE_16,
    borderBottomWidth: 1,
    borderBottomColor: appStyleConstants.COLOR_BORDER,
  },
  settingLabel: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
  },
  toggle: {
    backgroundColor: appStyleConstants.COLOR_BORDER,
    borderRadius: appStyleConstants.SIZE_12,
    paddingHorizontal: appStyleConstants.SIZE_12,
    paddingVertical: appStyleConstants.SIZE_6,
  },
  toggleActive: {
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
  },
  toggleText: {
    color: appStyleConstants.COLOR_WHITE,
    fontSize: appStyleConstants.FONT_SIZE_12,
    fontWeight: '600',
  },
});

// Export all examples for reference
export {
  ProfileScreen, SettingsScreen, HomeScreen
};
