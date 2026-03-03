// src/screens/ErpCredentialsScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import InputField from '../components/InputField';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { saveUserCredentials } from '../services/api';

const ErpCredentialsScreen = ({ route }) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeePass, setEmployeePass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const codeRef = useRef(null);
  const passRef = useRef(null);

  const trimmedCode = employeeCode.trim();
  const trimmedPass = employeePass.trim();

  const canSubmit = !!trimmedCode && !!trimmedPass && !isLoading;

  const handleSaveCredentials = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      console.log('🔐 Saving ERP credentials...');

      const result = await saveUserCredentials(trimmedCode, trimmedPass);

      if (result.success) {
        console.log('✅ ERP credentials saved successfully');
        Alert.alert(
          'Setup Complete',
          'Your ERP credentials have been saved. You can now access the app.',
          [
            {
              text: 'Continue',
              onPress: () => {
                if (route.params?.onComplete) {
                  route.params.onComplete();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Save Failed',
          result.message || 'Failed to save credentials. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Save credentials error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while saving your credentials. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="ERP Setup"
      headerVariant="compact"
      card
      center
      keyboard
    >
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Connect Your ERP Account</Text>
        <Text style={styles.infoText}>
          Enter your ERP credentials to sync your projects and time entries with the company system.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Employee Code</Text>
        <InputField
          ref={codeRef}
          placeholder="Enter your employee code"
          value={employeeCode}
          onChangeText={setEmployeeCode}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passRef.current?.focus()}
          autoFocus
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Employee Password</Text>
        <InputField
          ref={passRef}
          placeholder="Enter your ERP password"
          value={employeePass}
          onChangeText={setEmployeePass}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSaveCredentials}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title={isLoading ? 'Saving...' : 'Save Credentials'}
          onPress={handleSaveCredentials}
          disabled={!canSubmit}
        />

        <Text style={styles.helpText}>
          {isLoading
            ? 'Saving your credentials securely...'
            : 'These credentials are stored securely and used only for ERP integration.'
          }
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: appStyleConstants.SIZE_32,
    alignItems: 'center',
  },
  infoTitle: {
    ...appStyleConstants.STYLE_HEADER_2,
    color: appStyleConstants.COLOR_TEXT_PRIMARY,
    marginBottom: appStyleConstants.SIZE_8,
    textAlign: 'center',
  },
  infoText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: appStyleConstants.SIZE_24,
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

export default ErpCredentialsScreen;
