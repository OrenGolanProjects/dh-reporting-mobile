import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

const EmptyState = ({ icon = '📁', title = 'Nothing here yet', subtitle = '' }) => (
  <View style={emptyStyles.container}>
    <View style={emptyStyles.iconContainer}>
      <Text style={emptyStyles.emoji}>{icon}</Text>
    </View>
    <Text style={emptyStyles.title}>{title}</Text>
    {subtitle ? (
      <Text style={emptyStyles.subtitle}>{subtitle}</Text>
    ) : null}
  </View>
);

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: styles.SIZE_64,
    paddingHorizontal: styles.SIZE_24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: styles.RADIUS_LARGE,
    backgroundColor: styles.COLOR_SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: styles.SIZE_20,
    borderWidth: 1,
    borderColor: styles.COLOR_BORDER,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: styles.FONT_SIZE_18,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    marginBottom: styles.SIZE_8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: styles.FONT_SIZE_14,
    color: styles.COLOR_TEXT_MUTED,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    textAlign: 'center',
    paddingHorizontal: styles.SIZE_16,
    lineHeight: styles.FONT_SIZE_14 * 1.4,
  },
});

export default EmptyState;
