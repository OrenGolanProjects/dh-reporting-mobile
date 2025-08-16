// components/drawers/SideDrawer.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const { width: screenWidth } = Dimensions.get('window');

const SideDrawer = ({ 
  isOpen, 
  onClose, 
  children, 
  width = 300, 
  side = 'left',
  overlayOpacity = 0.5,
  animationDuration = 300 
}) => {
  const [slideAnim] = useState(new Animated.Value(side === 'left' ? -width : width));

  useEffect(() => {
    if (isOpen) {
      // Animate in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate out
      Animated.timing(slideAnim, {
        toValue: side === 'left' ? -width : width,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim, width, side, animationDuration]);

  if (!isOpen) return null;

  const drawerStyle = {
    width,
    transform: [{ translateX: slideAnim }],
    [side]: 0,
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={[
            styles.overlayBackground, 
            { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }
          ]} 
          onPress={onClose} 
          activeOpacity={1}
        />
        <Animated.View style={[styles.drawerContainer, drawerStyle]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayBackground: {
    flex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SideDrawer;