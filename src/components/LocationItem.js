// src/components/LocationItem.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

/**
 * Reusable location item with two visual variants:
 * - 'button': compact row button (used in ProjectListView)
 * - 'card': larger card with icon container (used in LocationModal)
 */
const LocationItem = ({
  location,
  variant = 'button',
  isActive = false,
  isDisabled = false,
  onPress,
}) => {
  if (variant === 'card') {
    return (
      <TouchableOpacity
        style={itemStyles.card}
        onPress={() => onPress?.(location)}
        activeOpacity={0.7}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={location.name}
      >
        <View style={itemStyles.iconContainer}>
          <Text style={itemStyles.cardIcon}>{location.icon}</Text>
        </View>
        <Text style={itemStyles.cardName}>{location.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        itemStyles.button,
        isActive && itemStyles.buttonActive,
        isDisabled && itemStyles.buttonDisabled,
      ]}
      onPress={() => onPress?.(location)}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={location.name}
      accessibilityState={{ disabled: isDisabled, selected: isActive }}
    >
      <Text style={[
        itemStyles.buttonIcon,
        isActive && itemStyles.buttonIconActive,
      ]}>
        {location.icon}
      </Text>
      <Text style={[
        itemStyles.buttonText,
        isActive && itemStyles.buttonTextActive,
        isDisabled && itemStyles.buttonTextDisabled,
      ]}>
        {location.name}
      </Text>
    </TouchableOpacity>
  );
};

const itemStyles = StyleSheet.create({
  // Button variant (ProjectListView)
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: styles.COLOR_DARK,
    borderRadius: styles.RADIUS_MEDIUM,
    paddingVertical: styles.SIZE_12,
    paddingHorizontal: styles.SIZE_8,
    marginHorizontal: styles.SIZE_4,
    borderWidth: 1,
    borderColor: styles.COLOR_BORDER,
  },
  buttonActive: {
    backgroundColor: styles.COLOR_PRIMARY,
    borderColor: styles.COLOR_PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: styles.COLOR_DARK,
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: styles.SIZE_6,
  },
  buttonIconActive: {},
  buttonText: {
    fontSize: styles.FONT_SIZE_14,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_MUTED,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
  },
  buttonTextActive: {
    color: styles.COLOR_WHITE,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
  },
  buttonTextDisabled: {
    color: styles.COLOR_TEXT_SUBTLE,
  },

  // Card variant (LocationModal)
  card: {
    flex: 1,
    alignItems: 'center',
    padding: styles.SIZE_16,
    marginHorizontal: styles.SIZE_6,
    borderRadius: styles.RADIUS_LARGE,
    backgroundColor: styles.COLOR_SURFACE_LIGHT || styles.COLOR_SURFACE,
    borderWidth: 1,
    borderColor: styles.COLOR_BORDER,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: styles.RADIUS_LARGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: styles.SIZE_12,
    backgroundColor: styles.COLOR_PRIMARY_ALPHA || 'rgba(16, 185, 129, 0.1)',
  },
  cardIcon: {
    fontSize: 28,
  },
  cardName: {
    fontSize: styles.FONT_SIZE_14,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
  },
});

export default LocationItem;
