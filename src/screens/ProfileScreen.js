// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { useUser } from '../hooks/useUser';

const ProfileScreen = ({ navigation }) => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <ScreenWrapper headerTitle="Profile" center>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      headerTitle="Profile"
      headerSubtitle="Your account details"
      headerVariant="compact"
    >
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.first_name?.[0]?.toUpperCase() || '?'}
              {currentUser?.last_name?.[0]?.toUpperCase() || ''}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Name" value={`${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`} />
          <InfoRow label="Email" value={currentUser?.email || 'Not set'} />
        </View>

        <View style={styles.actions}>
          <SecondaryButton
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: appStyleConstants.SIZE_16,
  },
  loadingText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: appStyleConstants.SIZE_32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: appStyleConstants.FONT_SIZE_24,
    fontWeight: appStyleConstants.FONT_WEIGHT_BOLD,
    color: appStyleConstants.COLOR_WHITE,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  infoCard: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.RADIUS_LARGE,
    padding: appStyleConstants.SIZE_20,
    marginBottom: appStyleConstants.SIZE_24,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
  },
  infoRow: {
    paddingVertical: appStyleConstants.SIZE_12,
    borderBottomWidth: 1,
    borderBottomColor: appStyleConstants.COLOR_BORDER,
  },
  infoLabel: {
    fontSize: appStyleConstants.FONT_SIZE_12,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    marginBottom: appStyleConstants.SIZE_4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
  },
  actions: {
    marginTop: appStyleConstants.SIZE_16,
  },
});

export default ProfileScreen;
