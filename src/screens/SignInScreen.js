// src/screens/SignInScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import InputField from '../components/InputField';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';
import { User, Session } from '../orm/models/';
import { signInWithEmail } from '../services/firebase';
import { checkUserCredentials } from '../services/api';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password;

  const isEmailValid = validateEmail(trimmedEmail);
  const isPasswordValid = trimmedPassword.length >= 6;
  const canSubmit = isEmailValid && isPasswordValid && !isLoading;

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleSignIn = async () => {
    if (!canSubmit) return;

    setIsLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmail(trimmedEmail, trimmedPassword);
      console.log('✅ Firebase signin successful:', userCredential.user.uid);

      // Check or create local user for offline support
      let localUser = await User.findBy('email', trimmedEmail);

      if (!localUser) {
        localUser = await User.create({
          first_name: '',
          last_name: '',
          email: trimmedEmail,
          phone_number: null,
          hms_user: null
        });
      }

      // Set local session
      await Session.setCurrent(localUser.id);

      // Check if user has ERP credentials
      const { hasCredentials } = await checkUserCredentials();

      if (!hasCredentials) {
        navigation.navigate('ErpCredentials');
      }
      // If hasCredentials, auth state listener will handle navigation to main app

    } catch (error) {
      console.error('❌ Sign in error:', error.code);

      const errorMessage = getFirebaseErrorMessage(error.code);

      if (error.code === 'auth/user-not-found') {
        Alert.alert(
          'Account Not Found',
          'No account found with this email address. Would you like to create one?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Create Account', onPress: () => navigation.navigate('Signup') }
          ]
        );
      } else {
        Alert.alert('Sign In Failed', errorMessage);
      }
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
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <EmailField
          ref={emailRef}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          autoFocus
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <InputField
          ref={passwordRef}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
          disabled={!canSubmit}
          style={styles.fullWidthBtn}
        />

        <Text style={styles.helpText}>
          {isLoading
            ? "Checking your credentials..."
            : "Sign in with your email and password"
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
  inputGroup: {
    marginBottom: appStyleConstants.SIZE_24,
    width: '100%',
  },
  label: {
    ...appStyleConstants.STYLE_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginBottom: appStyleConstants.SIZE_8,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
  },
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
