import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import EmailField from '../components/fields/EmailField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { validateEmail } from '../utils/validation';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const trimmed = email.trim();
  const isValid = validateEmail(trimmed);

  const goToSplash = () => navigation.replace('Splash');
  const goToSignUp = () => navigation.navigate('Signup');

  const handleSendCode = () => {
    if (!isValid) return console.warn('Invalid email');
    console.log('Send code to:', trimmed);
    // TODO: start OTP flow
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Sign-In"
      card
      center
      keyboard
      footer={<SecondaryButton title="Back to Splash" onPress={goToSplash} />}
    >
      <EmailField
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        returnKeyType="done"
        onSubmitEditing={handleSendCode}
        autoFocus
        accessibilityLabel="Email"
      />

      <PrimaryButton
        title="Send Code"
        onPress={handleSendCode}
        disabled={!isValid}
        style={{ marginTop: appStyleConstants.SIZE_12 }}
      />

      <Text style={styles.helpText}>
        You'll receive an email with a login code
      </Text>

      <SecondaryButton
        title="Create New Account"
        onPress={goToSignUp}
        style={{ marginTop: appStyleConstants.SIZE_12 }}
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