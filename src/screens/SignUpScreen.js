// src/screens/SignUpScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import InputField from '../components/InputField';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';
import { User, Session } from '../orm/models/';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const firstRef = useRef(null);
  const lastRef = useRef(null);
  const emailRef = useRef(null);

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const isEmailValid = validateEmail(trimmedEmail);
  const canSubmit = !!trimmedFirst && !!trimmedLast && isEmailValid && !isLoading;

  const handleSignUp = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      console.log('🔍 Starting signup process...');
      console.log('📧 Checking for existing user with email:', trimmedEmail);

      const existingUser = await User.findBy('email', trimmedEmail);
      console.log('✅ User check complete:', existingUser ? 'User exists' : 'No existing user');

      if (existingUser) {
        setIsLoading(false);

        return new Promise((resolve) => {
          Alert.alert(
            'Account Exists',
            'An account with this email already exists. Please sign in instead.',
            [
              {
                text: 'OK',
                onPress: resolve
              },
              {
                text: 'Go to Sign In',
                onPress: () => {
                  resolve();
                  navigation.navigate('Signin');
                }
              }
            ]
          );
        });
      }

      console.log('📝 Creating new user...');
      const newUser = await User.create({
        first_name: trimmedFirst,
        last_name: trimmedLast,
        email: trimmedEmail,
        phone_number: null,
        hms_user: null
      });
      console.log('✅ User created:', newUser);

      console.log('🔐 Setting session...');
      await Session.setCurrent(newUser.id);
      console.log('✅ Session set');

      Alert.alert(
        'Account Created!',
        `Welcome ${trimmedFirst}! Your account has been created successfully.`,
        [{ text: 'Continue' }]
      );

    } catch (error) {
      console.error('❌ Signup error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
      Alert.alert('Signup Failed', 'Something went wrong while creating your account. Please try again.');
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
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
          editable={!isLoading}
        />
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
            : "You'll be logged in automatically after account creation."
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
});

export default SignUpScreen;