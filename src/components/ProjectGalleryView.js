// components/ProjectGalleryView.js
import React, { useCallback, memo } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';
import EmptyState from './EmptyState';

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

const GalleryTile = memo(function GalleryTile({ project, activeSession, onProjectPress }) {
  const isActive = activeSession?.project_id === project.id;
  const isDisabled = !!activeSession && !isActive;
  const activeLocation = isActive ? activeSession.active_location : null;
  const locationIcon = activeLocation ? LOCATION_ICONS[activeLocation] : null;

  return (
    <View style={galleryStyles.tileWrapper}>
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
});

const EmptyGallery = () => (
  <EmptyState
    icon="📁"
    title="No projects yet"
    subtitle="Add your first project to start tracking"
  />
);

export const ProjectGalleryView = ({ projects, activeSession, onProjectPress, ListHeaderComponent }) => {
  const keyExtractor = useCallback((item) => String(item.id), []);

  const renderItem = useCallback(({ item }) => (
    <GalleryTile
      project={item}
      activeSession={activeSession}
      onProjectPress={onProjectPress}
    />
  ), [activeSession, onProjectPress]);

  // Row height: tile minHeight (100) + padding (16*2) + border (2) + marginBottom (12)
  const ROW_HEIGHT = 146;
  const getItemLayout = useCallback((data, index) => ({
    length: ROW_HEIGHT,
    offset: ROW_HEIGHT * Math.floor(index / 2),
    index,
  }), []);

  return (
    <FlatList
      data={projects}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      numColumns={2}
      columnWrapperStyle={galleryStyles.columnWrapper}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={EmptyGallery}
      contentContainerStyle={galleryStyles.container}
      showsVerticalScrollIndicator={false}
      initialNumToRender={8}
      windowSize={5}
    />
  );
};

const galleryStyles = StyleSheet.create({
  container: {
    paddingBottom: styles.SIZE_24,
    flexGrow: 1,
  },

  // Column layout for FlatList numColumns=2
  columnWrapper: {
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
    ...styles.SHADOW_SMALL,
  },
  tileActive: {
    ...styles.SHADOW_MEDIUM,
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
    fontSize: 15,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    textAlign: 'center',
    lineHeight: 20,
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
});

export default ProjectGalleryView;