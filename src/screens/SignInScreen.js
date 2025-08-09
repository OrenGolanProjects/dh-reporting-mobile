import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { validateEmail } from '../utils/validation';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import { CommonActions } from '@react-navigation/native';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    if (!validateEmail(email)) {
      console.warn('Invalid email');
      return;
    }
    console.log('Send code to:', email);
  };

  const goToSplash = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      })
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={appStyleConstants.STYLE_HEADER_CENTER}>DH-Reporting</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <InputField
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <PrimaryButton title="Send Code" onPress={handleSendCode} />

            <Text style={styles.helpText}>Enter your email to sign in</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton title="Back to Splash" onPress={goToSplash} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARK,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: appStyleConstants.SIZE_24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_16,
    padding: appStyleConstants.SIZE_40,
    ...appStyleConstants.SHADOW_BOX_1,
  },
  inputGroup: {
    marginBottom: appStyleConstants.SIZE_24,
  },
  label: {
    fontSize: appStyleConstants.FONT_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_SUBTLE,
    marginBottom: appStyleConstants.SIZE_8,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
  },
  helpText: {
    textAlign: 'center',
    marginTop: appStyleConstants.SIZE_24,
    fontSize: appStyleConstants.FONT_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  footer: {
    paddingBottom: appStyleConstants.SIZE_32,
    paddingTop: appStyleConstants.SIZE_16,
  },
});

export default SignInScreen;
