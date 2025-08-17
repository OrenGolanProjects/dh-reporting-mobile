// components/ProjectGalleryView.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

const LOCATION_ICONS = {
  'Home': '🏠',
  'Office': '🏢',
  'Client': '👥'
};

// Get screen width for proper tile sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_PADDING = styles.SIZE_16 * 2;
const TILE_GAP = 75;
const TILE_WIDTH = (SCREEN_WIDTH - CONTAINER_PADDING - TILE_GAP) / 2;

export const ProjectGalleryView = ({ projects, activeSession, onProjectPress }) => {
  if (projects.length === 0) {
    return (
      <View style={galleryStyles.empty}>
        <View style={galleryStyles.emptyIcon}>
          <Text style={galleryStyles.emptyEmoji}>📁</Text>
        </View>
        <Text style={galleryStyles.emptyText}>No projects yet</Text>
        <Text style={galleryStyles.emptySubtext}>
          Add your first project to start tracking
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={galleryStyles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      bounces={true}
      scrollEventThrottle={16}
      style={galleryStyles.scrollView}
    >
      <View style={galleryStyles.grid}>
        {projects.map((project) => {
          const isActive = activeSession?.project_id === project.id;
          const isDisabled = !!activeSession && !isActive;
          const activeLocation = isActive ? activeSession.active_location : null;
          const locationIcon = activeLocation ? LOCATION_ICONS[activeLocation] : null;

          return (
            <View key={project.id} style={galleryStyles.tileWrapper}>
              <TouchableOpacity
                style={[
                  galleryStyles.tile,
                  isActive && galleryStyles.tileActive,
                  isDisabled && galleryStyles.tileDisabled,
                ]}
                onPress={() => onProjectPress(project)}
                disabled={isDisabled}
                activeOpacity={0.8}
                delayPressIn={50}
              >
                <View style={[
                  galleryStyles.tileContent,
                  isActive && galleryStyles.tileContentActive,
                ]}>
                  <Text
                    style={[
                      galleryStyles.tileText,
                      isActive && galleryStyles.tileTextActive,
                      isDisabled && galleryStyles.tileTextDisabled,
                    ]}
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {project.name}
                  </Text>

                  {isActive && (
                    <>
                      <View style={galleryStyles.activeDotContainer}>
                        <View style={galleryStyles.activeDot} />
                      </View>
                      {locationIcon && (
                        <View style={galleryStyles.locationBadgeContainer}>
                          <View style={galleryStyles.locationBadge}>
                            <Text style={galleryStyles.locationIcon}>{locationIcon}</Text>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const galleryStyles = StyleSheet.create({
  // ScrollView container
  scrollView: {
    flex: 1,
  },
  container: {
    paddingBottom: styles.SIZE_24,
    flexGrow: 1,
  },

  // Grid layout
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: styles.SIZE_4,
  },

  // Tile wrapper for proper sizing
  tileWrapper: {
    width: TILE_WIDTH,
    marginBottom: styles.SIZE_12,
  },

  // Tile styles
  tile: {
    width: '100%',
    borderRadius: styles.RADIUS_MEDIUM,
    overflow: 'hidden',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tileActive: {
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  tileDisabled: {
    opacity: 0.4,
  },

  // Tile content
  tileContent: {
    backgroundColor: styles.COLOR_SURFACE,
    borderRadius: styles.RADIUS_MEDIUM,
    padding: styles.SIZE_16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: styles.COLOR_BORDER,
    position: 'relative',
  },
  tileContentActive: {
    borderColor: styles.COLOR_PRIMARY,
    borderWidth: 2,
    backgroundColor: styles.COLOR_SURFACE,
  },

  // Text styles
  tileText: {
    fontSize: styles.FONT_SIZE_15,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    textAlign: 'center',
    lineHeight: styles.FONT_SIZE_15 * 1.3,
  },
  tileTextActive: {
    color: styles.COLOR_PRIMARY,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
  },
  tileTextDisabled: {
    color: styles.COLOR_TEXT_MUTED,
  },

  // Active state indicators
  activeInfo: {
    position: 'absolute',
    top: styles.SIZE_8,
    right: styles.SIZE_8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: styles.SIZE_4,
  },
  activeDotContainer: {
    position: 'absolute',
    top: styles.SIZE_8,
    left: styles.SIZE_8,
  },
  locationBadgeContainer: {
    position: 'absolute',
    top: styles.SIZE_8,
    right: styles.SIZE_8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: styles.COLOR_PRIMARY,
  },
  locationBadge: {
    backgroundColor: styles.COLOR_PRIMARY,
    borderRadius: styles.RADIUS_SMALL,
    paddingHorizontal: styles.SIZE_4,
    paddingVertical: styles.SIZE_2,
    minWidth: 20,
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: styles.SIZE_64,
    paddingHorizontal: styles.SIZE_24,
  },
  emptyIcon: {
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
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: styles.FONT_SIZE_18,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    marginBottom: styles.SIZE_8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: styles.FONT_SIZE_14,
    color: styles.COLOR_TEXT_MUTED,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    textAlign: 'center',
    lineHeight: styles.FONT_SIZE_14 * 1.4,
  },
});

export default ProjectGalleryView;