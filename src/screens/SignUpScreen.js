import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import InputField from '../components/InputField';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';
// Import our database functions
import { createUser, setCurrentUser, getUserByEmail } from '../database';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const firstRef = useRef(null);
  const lastRef  = useRef(null);
  const emailRef = useRef(null);

  const trimmedFirst = firstName.trim();
  const trimmedLast  = lastName.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const isEmailValid = validateEmail(trimmedEmail);
  const canSubmit = !!trimmedFirst && !!trimmedLast && isEmailValid && !isLoading;

  const goToSignIn = () => navigation.navigate('Signin');

  /**
   * Handle user signup with database integration
   */
  const handleSignUp = async () => {
    if (!canSubmit) {
      return console.warn('Please fill all fields correctly');
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Creating user account...');
      
      // Check if user already exists
      const existingUser = await getUserByEmail(trimmedEmail);
      if (existingUser) {
        Alert.alert(
          'Account Exists', 
          'An account with this email already exists. Please sign in instead.',
          [
            { text: 'OK' },
            { text: 'Go to Sign In', onPress: goToSignIn }
          ]
        );
        return;
      }

      // Create new user in database
      const newUser = await createUser({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail
      });

      console.log('✅ User created successfully:', newUser.email);

      // Automatically log them in
      await setCurrentUser(newUser.id);
      console.log('✅ User logged in automatically');

      // Show success message
      Alert.alert(
        'Account Created!', 
        `Welcome ${trimmedFirst}! Your account has been created successfully.`,
        [
          { 
            text: 'Continue', 
            onPress: () => navigation.replace('Projects')
          }
        ]
      );

    } catch (error) {
      console.error('❌ Signup error:', error);
      
      Alert.alert(
        'Signup Failed',
        'Something went wrong while creating your account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Sign-Up"
      card
      center
      keyboard
      footer={<SecondaryButton title="Back to Sign-In" onPress={goToSignIn} disabled={isLoading} />}
    >
      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <InputField
          ref={firstRef}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoComplete="name-given"
          textContentType="givenName"
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
          autoComplete="name-family"
          textContentType="familyName"
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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  inputGroup: { marginBottom: appStyleConstants.SIZE_24 },
  label: {
    ...appStyleConstants.STYLE_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginBottom: appStyleConstants.SIZE_8,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
  },
  helpText: {
    ...appStyleConstants.STYLE_CAPTION,
    textAlign: 'center',
    marginTop: appStyleConstants.SIZE_16,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
});

export default SignUpScreen;
