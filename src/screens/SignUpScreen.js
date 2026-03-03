// src/screens/SignUpScreen.js
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
import { signUpWithEmail } from '../services/firebase';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const firstRef = useRef(null);
  const lastRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password;

  const isEmailValid = validateEmail(trimmedEmail);
  const isPasswordValid = trimmedPassword.length >= 6;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = !!trimmedFirst && !!trimmedLast && isEmailValid && isPasswordValid && passwordsMatch && !isLoading;

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleSignUp = async () => {
    if (!canSubmit) return;

    if (!passwordsMatch) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 Starting Firebase signup process...');

      // Create Firebase account
      const userCredential = await signUpWithEmail(trimmedEmail, trimmedPassword);
      console.log('✅ Firebase account created:', userCredential.user.uid);

      // Create local user record for offline support
      const existingUser = await User.findBy('email', trimmedEmail);

      let localUser;
      if (existingUser) {
        localUser = existingUser;
      } else {
        localUser = await User.create({
          first_name: trimmedFirst,
          last_name: trimmedLast,
          email: trimmedEmail,
          phone_number: null,
          hms_user: null
        });
      }

      // Set local session
      await Session.setCurrent(localUser.id);

      // Navigate to ERP credentials screen
      navigation.navigate('ErpCredentials');

    } catch (error) {
      console.error('❌ Signup error:', error.code, error.message);

      const errorMessage = getFirebaseErrorMessage(error.code);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          'Account Exists',
          errorMessage,
          [
            { text: 'OK' },
            { text: 'Go to Sign In', onPress: () => navigation.navigate('Signin') }
          ]
        );
      } else {
        Alert.alert('Signup Failed', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Sign-Up"
      headerVariant="compact"
      card
      center
      keyboard
      footer={
        <SecondaryButton
          title="Back to Sign-In"
          onPress={() => navigation.navigate('Signin')}
          disabled={isLoading}
        />
      }
    >
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <InputField
          ref={firstRef}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => lastRef.current?.focus()}
          autoFocus
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <InputField
          ref={lastRef}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => emailRef.current?.focus()}
          editable={!isLoading}
        />
      </View>

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
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <InputField
          ref={passwordRef}
          placeholder="Enter password (min 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <InputField
          ref={confirmPasswordRef}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
          editable={!isLoading}
        />
        {confirmPassword.length > 0 && !passwordsMatch && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleSignUp}
          disabled={!canSubmit}
        />

        <Text style={styles.helpText}>
          {isLoading
            ? "Please wait while we create your account..."
            : "After signup, you'll set up your ERP credentials."
          }
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: appStyleConstants.SIZE_24
  },
  label: {
    ...appStyleConstants.STYLE_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginBottom: appStyleConstants.SIZE_8,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
  },
  buttonContainer: {
    marginTop: appStyleConstants.SIZE_24,
    alignItems: 'center',
    width: '100%',
  },
  helpText: {
    ...appStyleConstants.STYLE_CAPTION,
    textAlign: 'center',
    marginTop: appStyleConstants.SIZE_56,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  errorText: {
    ...appStyleConstants.STYLE_CAPTION,
    color: appStyleConstants.COLOR_ERROR || '#E53935',
    marginTop: appStyleConstants.SIZE_4,
  },
});

export default SignUpScreen;
