// src/screens/SignUpScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import InputField from '../components/InputField';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');

  const firstRef = useRef(null);
  const lastRef  = useRef(null);
  const emailRef = useRef(null);

  const trimmedFirst = firstName.trim();
  const trimmedLast  = lastName.trim();
  const trimmedEmail = email.trim();

  const isEmailValid = validateEmail(trimmedEmail);
  const canSubmit = !!trimmedFirst && !!trimmedLast && isEmailValid;

  const goToSignIn = () => navigation.navigate('Signin');

  const handleSignUp = () => {
    if (!canSubmit) return console.warn('Please fill all fields correctly');
    console.log('Register user:', {
      email: trimmedEmail,
      firstName: trimmedFirst,
      lastName: trimmedLast,
    });
    // TODO: call signup API / start OTP
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Sign-Up"
      card
      center
      keyboard
      footer={<SecondaryButton title="Back to Sign-In" onPress={goToSignIn} />}
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
        />
      </View>

      <PrimaryButton
        title="Create Account"
        onPress={handleSignUp}
        disabled={!canSubmit}
      />
      <Text style={styles.helpText}>You'll receive an email with a login code.</Text>
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
