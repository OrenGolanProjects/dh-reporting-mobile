import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';
// Import our database functions
import { getUserByEmail, setCurrentUser } from '../database';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const trimmed = email.trim().toLowerCase();
  const isValid = validateEmail(trimmed);
  const canSubmit = isValid && !isLoading;

  const goToSplash = () => navigation.replace('Splash');
  const goToSignUp = () => navigation.navigate('Signup');

  /**
   * Handle user sign in with database integration
   * Note: In a real app, you'd verify a password or send an OTP
   * For this example, we'll just check if the user exists
   */
  const handleSendCode = async () => {
    if (!isValid) {
      return console.warn('Invalid email');
    }

    setIsLoading(true);

    try {
      console.log('🔍 Looking for user:', trimmed);
      
      // Check if user exists in database
      const user = await getUserByEmail(trimmed);
      
      if (user) {
        console.log('✅ User found:', user.email);
        
        // In a real app, you'd send an OTP here
        // For this example, we'll just log them in directly
        Alert.alert(
          'User Found!',
          `Welcome back ${user.first_name}! In a real app, we'd send you a login code. For now, we'll log you in directly.`,
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Login',
              onPress: async () => {
                try {
                  await setCurrentUser(user.id);
                  console.log('✅ User logged in successfully');
                  navigation.replace('Projects');
                } catch (error) {
                  console.error('❌ Login error:', error);
                  Alert.alert('Login Failed', 'Something went wrong. Please try again.');
                }
              }
            }
          ]
        );
        
      } else {
        console.log('❌ User not found');
        Alert.alert(
          'Account Not Found',
          'No account found with this email address. Would you like to create one?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Create Account', onPress: goToSignUp }
          ]
        );
      }
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Sign-In"
      card
      center
      keyboard
      footer={<SecondaryButton title="Back to Splash" onPress={goToSplash} disabled={isLoading} />}
    >
      <EmailField
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        returnKeyType="done"
        onSubmitEditing={handleSendCode}
        autoFocus
        accessibilityLabel="Email"
        editable={!isLoading}
      />

      <PrimaryButton
        title={isLoading ? "Checking..." : "Send Code"}
        onPress={handleSendCode}
        disabled={!canSubmit}
        style={{ marginTop: appStyleConstants.SIZE_12 }}
      />

      <Text style={styles.helpText}>
        {isLoading 
          ? "Checking if your account exists..." 
          : "We'll check if you have an account and help you sign in"
        }
      </Text>

      <SecondaryButton
        title="Create New Account"
        onPress={goToSignUp}
        style={{ marginTop: appStyleConstants.SIZE_12 }}
        disabled={isLoading}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  helpText: {
    ...appStyleConstants.STYLE_CAPTION,
    textAlign: 'center',
    marginTop: appStyleConstants.SIZE_16,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
});

export default SignInScreen;
