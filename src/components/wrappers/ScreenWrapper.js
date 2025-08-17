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
  headerRight,        // Optional component to render on the right side of header
  scroll = false,     // Wrap content in a ScrollView (good for long lists/forms).
  keyboard = false,   // Wrap in KeyboardAvoidingView so inputs aren't covered by the keyboard.
  center = false,     // Vertically center the main content area (great for short/auth screens or empty states).
  card = false,       // Place children inside a styled "surface" card (rounded, padded, elevated) on the dark background.
  footer = null,      // Optional element rendered BELOW children (e.g., primary button, helper text).
  edges = ['top', 'bottom'], // Control which edges to apply safe area
  headerVariant = 'default', // 'default', 'compact', 'minimal' - Controls header size
  footerVariant = 'default', // 'default', 'compact', 'minimal' - Controls footer size
}) => {
  // Wrap children in card if requested
  const contentBody = card ? (
    <CardWrapper>{children}</CardWrapper>
  ) : (
    children
  );

  // Get header styles based on variant
  const getHeaderStyles = () => {
    switch (headerVariant) {
      case 'minimal':
        return [styles.header, styles.headerMinimal];
      case 'compact':
        return [styles.header, styles.headerCompact];
      default:
        return styles.header;
    }
  };

  // Get footer styles based on variant
  const getFooterStyles = () => {
    switch (footerVariant) {
      case 'minimal':
        return [styles.footer, styles.footerMinimal];
      case 'compact':
        return [styles.footer, styles.footerCompact];
      default:
        return styles.footer;
    }
  };

  const content = (
    <>
      {(headerTitle || headerSubtitle || headerRight) && (
        <View style={getHeaderStyles()}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              {headerTitle && (
                <Text style={[
                  styles.headerTitle,
                  headerVariant === 'minimal' && styles.headerTitleMinimal,
                  headerVariant === 'compact' && styles.headerTitleCompact,
                ]}>
                  {headerTitle}
                </Text>
              )}
              {headerSubtitle && (
                <Text style={[
                  styles.headerSubtitle,
                  headerVariant === 'minimal' && styles.headerSubtitleMinimal,
                  headerVariant === 'compact' && styles.headerSubtitleCompact,
                ]}>
                  {headerSubtitle}
                </Text>
              )}
            </View>
            {headerRight && (
              <View style={styles.headerRight}>
                {headerRight}
              </View>
            )}
          </View>
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
      
      {footer && (
        <View style={getFooterStyles()}>
          {footer}
        </View>
      )}
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

  // ============================================================================
  // HEADER STYLES - Default (Thinner than original)
  // ============================================================================
  header: {
    paddingHorizontal: appStyleConstants.SIZE_24,
    paddingVertical: appStyleConstants.SIZE_12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: appStyleConstants.COLOR_BORDER,
    marginBottom: appStyleConstants.SIZE_12,
  },

  // Header layout
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appStyleConstants.SIZE_8,
  },

  // Header Compact Variant - Even thinner
  headerCompact: {
    paddingVertical: appStyleConstants.SIZE_8, // ✅ More compact
    marginBottom: appStyleConstants.SIZE_8,
  },

  // Header Minimal Variant - Ultra thin
  headerMinimal: {
    paddingVertical: appStyleConstants.SIZE_6, // ✅ Minimal padding
    marginBottom: appStyleConstants.SIZE_6,
    borderBottomWidth: 0, // ✅ No border for minimal
  },

  // ============================================================================
  // HEADER TEXT STYLES
  // ============================================================================
  headerTitle: {
    fontSize: appStyleConstants.FONT_SIZE_22, // ✅ SLIGHTLY SMALLER from 24
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_2, // ✅ REDUCED from SIZE_4
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    lineHeight: 28, // ✅ TIGHTER line height
  },

  headerTitleCompact: {
    fontSize: appStyleConstants.FONT_SIZE_20, // ✅ Smaller for compact
    lineHeight: 24,
    marginBottom: appStyleConstants.SIZE_1,
  },

  headerTitleMinimal: {
    fontSize: appStyleConstants.FONT_SIZE_18, // ✅ Smallest for minimal
    lineHeight: 22,
    marginBottom: 0,
  },

  headerSubtitle: {
    fontSize: appStyleConstants.FONT_SIZE_13, // ✅ SLIGHTLY SMALLER from 14
    color: appStyleConstants.COLOR_TEXT_MUTED,
    fontFamily: appStyleConstants.FONT_FAMILY_MONTSERRAT,
    lineHeight: 18, // ✅ TIGHTER line height
  },

  headerSubtitleCompact: {
    fontSize: appStyleConstants.FONT_SIZE_12, // ✅ Smaller for compact
    lineHeight: 16,
  },

  headerSubtitleMinimal: {
    fontSize: appStyleConstants.FONT_SIZE_11, // ✅ Smallest for minimal
    lineHeight: 14,
  },

  // ============================================================================
  // CONTENT STYLES
  // ============================================================================
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

  // ============================================================================
  // FOOTER STYLES - Default (Thinner than original)
  // ============================================================================
  footer: {
    paddingHorizontal: appStyleConstants.SIZE_24,
    paddingVertical: appStyleConstants.SIZE_12, // ✅ REDUCED from SIZE_16
    borderTopWidth: StyleSheet.hairlineWidth, // ✅ THINNER border
    borderTopColor: appStyleConstants.COLOR_BORDER,
    backgroundColor: appStyleConstants.COLOR_DARK, // ✅ Ensure consistent background
  },

  // Footer Compact Variant - Even thinner
  footerCompact: {
    paddingVertical: appStyleConstants.SIZE_8, // ✅ More compact
  },

  // Footer Minimal Variant - Ultra thin
  footerMinimal: {
    paddingVertical: appStyleConstants.SIZE_6, // ✅ Minimal padding
    borderTopWidth: 0, // ✅ No border for minimal
  },
});

export default ScreenWrapper;