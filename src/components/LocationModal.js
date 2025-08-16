// components/LocationModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

const LOCATIONS = [
  { id: 'HOME', name: 'Home', icon: '🏠' },
  { id: 'OFFICE', name: 'Office', icon: '🏢' },
  { id: 'CLIENT', name: 'Client', icon: '👥' }
];

export const LocationModal = ({ visible, project, onSelectLocation, onClose }) => {
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <TouchableOpacity 
          style={modalStyles.backdrop} 
          onPress={onClose} 
          activeOpacity={1} 
        />
        
        <View style={modalStyles.content}>
          <View style={modalStyles.handle} />
          
          <Text style={modalStyles.title}>Select Location</Text>
          <Text style={modalStyles.projectName}>{project?.name || ''}</Text>
          
          <View style={modalStyles.locationGrid}>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={modalStyles.locationCard}
                onPress={() => onSelectLocation(loc.name)}
                activeOpacity={0.7}
              >
                <View style={modalStyles.iconContainer}>
                  <Text style={modalStyles.locationIcon}>{loc.icon}</Text>
                </View>
                <Text style={modalStyles.locationName}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    backgroundColor: styles.COLOR_SURFACE,
    borderTopLeftRadius: styles.RADIUS_XLARGE,
    borderTopRightRadius: styles.RADIUS_XLARGE,
    padding: styles.SIZE_24,
    paddingBottom: styles.SIZE_40,
    borderWidth: 1,
    borderColor: styles.COLOR_BORDER,
    ...styles.SHADOW_LARGE,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: styles.COLOR_BORDER_LIGHT || styles.COLOR_BORDER,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: styles.SIZE_24,
  },
  title: {
    fontSize: styles.FONT_SIZE_14,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_MUTED,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  projectName: {
    fontSize: styles.FONT_SIZE_24,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_TEXT || styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    marginTop: styles.SIZE_8,
    marginBottom: styles.SIZE_32,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  locationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationCard: {
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
  locationIcon: {
    fontSize: 28,
  },
  locationName: {
    fontSize: styles.FONT_SIZE_14,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
  },
});

export default LocationModal;