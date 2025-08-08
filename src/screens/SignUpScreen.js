import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { validateEmail } from '../utils/validation';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignUp = () => {
    if (!validateEmail(email)) {
      console.warn('Invalid email');
      return;
    }

    if (!firstName || !lastName) {
      console.warn('Missing name fields');
      return;
    }

    console.log('Register user:', { email, firstName, lastName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={appStyleConstants.STYLE_HEADER_CENTER}>DH-Reporting</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <InputField
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <InputField
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

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

        <PrimaryButton title="Create Account" onPress={handleSignUp} />

        <Text style={styles.helpText}>You'll receive an email with a login code</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARK,
    justifyContent: 'center',
    paddingHorizontal: appStyleConstants.SIZE_24,
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
});

export default SignUpScreen;
