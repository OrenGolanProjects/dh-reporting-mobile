// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import SecondaryButton from '../components/buttons/SecondaryButton';

const SettingsScreen = ({ navigation }) => {
  return (
    <ScreenWrapper
      headerTitle="Settings"
      headerSubtitle="App preferences"
      headerVariant="compact"
      footer={
        <SecondaryButton
          title="Back"
          onPress={() => navigation.goBack()}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <SettingRow label="Version" value="1.0.0" />
          <SettingRow label="SDK" value="Expo 54" />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const SettingRow = ({ label, value }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Text style={styles.settingValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: appStyleConstants.SIZE_16,
  },
  card: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.RADIUS_LARGE,
    padding: appStyleConstants.SIZE_20,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
  },
  sectionTitle: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    marginBottom: appStyleConstants.SIZE_16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: appStyleConstants.SIZE_12,
    borderBottomWidth: 1,
    borderBottomColor: appStyleConstants.COLOR_BORDER,
  },
  settingLabel: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  settingValue: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
});

export default SettingsScreen;
