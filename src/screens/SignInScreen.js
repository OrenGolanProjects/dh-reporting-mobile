// src/screens/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';
import { getUserByEmail, setCurrentUser } from '../database';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trimmed = email.trim().toLowerCase();
  const isValid = validateEmail(trimmed);
  const canSubmit = isValid && !isLoading;

  const handleSendCode = async () => {
    if (!isValid) return;

    setIsLoading(true);

    try {
      const user = await getUserByEmail(trimmed);

      if (user) {
        Alert.alert(
          'User Found!',
          `Welcome back ${user.first_name}! In a real app, we'd send you a login code. For now, we'll log you in directly.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Login',
              onPress: async () => {
                try {
                  await setCurrentUser(user.id);
                  console.log('✅ User logged in successfully');
                } catch (error) {
                  console.error('❌ Login error:', error);
                  Alert.alert('Login Failed', 'Something went wrong. Please try again.');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Account Not Found',
          'No account found with this email address. Would you like to create one?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Create Account', onPress: () => navigation.navigate('Signup') }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      Alert.alert('Sign In Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Sign-In"
      headerVariant="compact"
      card
      center
      keyboard
      footer={
        <SecondaryButton 
          title="Back to Splash" 
          onPress={() => navigation.navigate('Splash')} 
          disabled={isLoading} 
        />
      }
    >
      <EmailField
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        returnKeyType="done"
        onSubmitEditing={handleSendCode}
        autoFocus
        editable={!isLoading}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isLoading ? "Checking..." : "Send Code"}
          onPress={handleSendCode}
          disabled={!canSubmit}
          style={styles.fullWidthBtn}
        />

        <Text style={styles.helpText}>
          {isLoading
            ? "Checking if your account exists..."
            : "We'll check if you have an account and help you sign in"
          }
        </Text>

        <SecondaryButton
          title="Create New Account"
          onPress={() => navigation.navigate('Signup')}
          disabled={isLoading}
          style={[styles.fullWidthBtn, styles.secondaryBtn]}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: appStyleConstants.SIZE_24,
    width: '100%',
  },
  fullWidthBtn: {
    width: '100%',
    marginVertical: appStyleConstants.SIZE_8,
  },
  helpText: {
    ...appStyleConstants.STYLE_CAPTION,
    textAlign: 'center',
    marginTop: appStyleConstants.SIZE_56,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  secondaryBtn: {
    marginTop: appStyleConstants.SIZE_4,
  },
});

export default SignInScreen;