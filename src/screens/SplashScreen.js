import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import PrimaryButton from '../components/buttons/PrimaryButton'; // adjust path if needed

const SplashScreen = () => {
  const navigation = useNavigation();

  const simulateConnected = async () => {
    await AsyncStorage.setItem('userToken', 'mock_token');
    navigation.replace('Projects');
  };

  const simulateDisconnected = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Signin');
  };

  return (
    <View style={styles.container}>
      <Text style={appStyleConstants.STYLE_TITLE}>DH-Reporting</Text>
      <ActivityIndicator size="large" color={appStyleConstants.COLOR_PRIMARY} style={styles.spinner} />

      <PrimaryButton style={styles.simulateConnected} title="User Connected Simulate" onPress={simulateConnected} />
      <PrimaryButton title="User Disconnected Simulate" onPress={simulateDisconnected} />
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
  simulateConnected: {
    marginBottom:  appStyleConstants.SIZE_16,
  }
});
