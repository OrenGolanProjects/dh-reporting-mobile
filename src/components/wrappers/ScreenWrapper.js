import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import CardWrapper from './CardWrapper';
import { isIOS } from '../../utils/deviceHelpers';

const ScreenWrapper = ({
  children,           // The actual screen body you render inside the wrapper.
  headerTitle,        // Optional header title text
  headerSubtitle,     // Optional header subtitle text
  scroll = false,     // Wrap content in a ScrollView (good for long lists/forms).
  keyboard = false,   // Wrap in KeyboardAvoidingView so inputs aren't covered by the keyboard.
  center = false,     // Vertically center the main content area (great for short/auth screens or empty states).
  card = false,       // Place children inside a styled "surface" card (rounded, padded, elevated) on the dark background.
  footer = null,      // Optional element rendered BELOW children (e.g., primary button, helper text).
  edges = ['top', 'bottom'], // Control which edges to apply safe area
}) => {
  // Wrap children in card if requested
  const contentBody = card ? (
    <CardWrapper>{children}</CardWrapper>
  ) : (
    children
  );

  const content = (
    <>
      {(headerTitle || headerSubtitle) && (
        <View style={styles.header}>
          {headerTitle && <Text style={styles.headerTitle}>{headerTitle}</Text>}
          {headerSubtitle && <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>}
        </View>
      )}
      
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            center && styles.centerContent,
            card && styles.cardPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {contentBody}
        </ScrollView>
      ) : (
        <View style={[
          styles.content, 
          center && styles.centerContent,
          card && styles.cardPadding,
        ]}>
          {contentBody}
        </View>
      )}
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  // Apply KeyboardAvoidingView if requested and on iOS
  if (keyboard && isIOS) {
    return (
      <SafeAreaView style={styles.container} edges={edges}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={edges}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARK, // Dark theme background
  },
  header: {
    paddingHorizontal: appStyleConstants.SIZE_24,
    paddingVertical: appStyleConstants.SIZE_16,
    borderBottomWidth: 1,
    borderBottomColor: appStyleConstants.COLOR_BORDER,
  },
  headerTitle: {
    fontSize: appStyleConstants.FONT_SIZE_24,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT, // Light text on dark
    marginBottom: appStyleConstants.SIZE_4,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  headerSubtitle: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    color: appStyleConstants.COLOR_TEXT_MUTED, // Muted text on dark
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
  },
  content: {
    flex: 1,
    paddingHorizontal: appStyleConstants.SIZE_24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: appStyleConstants.SIZE_24,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPadding: {
    padding: appStyleConstants.SIZE_16,
  },
  footer: {
    paddingHorizontal: appStyleConstants.SIZE_24,
    paddingVertical: appStyleConstants.SIZE_16,
    borderTopWidth: 1,
    borderTopColor: appStyleConstants.COLOR_BORDER,
  },
});

export default ScreenWrapper;