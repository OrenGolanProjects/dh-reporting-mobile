import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const CardWrapper = ({
    headerLeft,                             // Left side of the header area (e.g., title/subtitle block).
    headerRight,                            // Right side of the header (e.g., <StatusBadge /> or small meta).
    footer = null,                          // Optional footer rendered BELOW the body (e.g., actions/meta).
    children,                               // Main body content of the card.
    onPress,                                // If provided, makes the whole card tappable (uses Pressable).
    style,                                  // Styles for the OUTER card container (margin, border, bg).
    contentStyle,                           // Styles for the INNER content/body area only.
    elevated = true,                        // Adds shadow/elevation when true; flat when false.
    radius = appStyleConstants.SIZE_32,     // Card corner radius.
    padding = appStyleConstants.SIZE_24,    // Inner padding for the card’s content.
  }) => {
  
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      android_ripple={onPress ? { color: appStyleConstants.COLOR_BORDER } : undefined}
      style={[
        styles.card,
        elevated && appStyleConstants.SHADOW_BOX_2,
        { borderRadius: radius, padding },
        style,
      ]}
    >
      {(headerLeft || headerRight) && (
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>{headerLeft}</View>
          {headerRight}
        </View>
      )}

      <View style={[styles.content, contentStyle]}>{children}</View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
    marginBottom: appStyleConstants.SIZE_16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: appStyleConstants.SIZE_16,
  },
  content: {},
  footer: {
    borderTopWidth: 1,
    borderTopColor: appStyleConstants.COLOR_BORDER,
    paddingTop: appStyleConstants.SIZE_16,
    marginTop: appStyleConstants.SIZE_16,
  },
});

export default CardWrapper;
