// components/ProjectGalleryView.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';

const LOCATION_ICONS = {
  'Home': '🏠',
  'Office': '🏢', 
  'Client': '👥'
};

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
      contentContainerStyle={galleryStyles.grid}
      showsVerticalScrollIndicator={false}
    >
      {projects.map((project) => {
        const isActive = activeSession?.project_id === project.id;
        const isDisabled = !!activeSession && !isActive;
        const activeLocation = isActive ? activeSession.active_location : null;
        const locationIcon = activeLocation ? LOCATION_ICONS[activeLocation] : null;
        
        return (
          <TouchableOpacity
            key={project.id}
            style={[
              galleryStyles.tile,
              isActive && galleryStyles.tileActive,
              isDisabled && galleryStyles.tileDisabled,
            ]}
            onPress={() => onProjectPress(project)}
            disabled={isDisabled}
            activeOpacity={0.7}
          >
            <View style={galleryStyles.tileContent}>
              <Text
                style={[
                  galleryStyles.tileText,
                  isActive && galleryStyles.tileTextActive,
                  isDisabled && galleryStyles.tileTextDisabled,
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {project.name}
              </Text>
              
              {isActive && (
                <View style={galleryStyles.activeInfo}>
                  <View style={galleryStyles.dot} />
                  {locationIcon && (
                    <View style={galleryStyles.locationBadge}>
                      <Text style={galleryStyles.locationIcon}>{locationIcon}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const galleryStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -styles.SIZE_6,
    paddingBottom: styles.SIZE_24,
  },
  tile: {
    width: '50%',
    padding: styles.SIZE_6,
  },
  tileContent: {
    backgroundColor: styles.COLOR_SURFACE,
    borderRadius: styles.RADIUS_MEDIUM,
    padding: styles.SIZE_20,
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: styles.COLOR_BORDER,
    position: 'relative',
  },
  tileActive: {
    // Active tile gets special treatment via tileContent
  },
  tileDisabled: {
    opacity: 0.3,
  },
  tileText: {
    fontSize: styles.FONT_SIZE_16,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    textAlign: 'center',
  },
  tileTextActive: {
    color: styles.COLOR_PRIMARY,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
  },
  tileTextDisabled: {
    color: styles.COLOR_TEXT_SUBTLE,
  },
  activeInfo: {
    position: 'absolute',
    top: styles.SIZE_10,
    right: styles.SIZE_10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: styles.COLOR_PRIMARY,
  },
  locationBadge: {
    marginLeft: styles.SIZE_6,
    backgroundColor: styles.COLOR_PRIMARY,
    borderRadius: styles.RADIUS_SMALL,
    paddingHorizontal: styles.SIZE_6,
    paddingVertical: styles.SIZE_2,
  },
  locationIcon: {
    fontSize: 14,
  },
  // Empty state
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: styles.SIZE_64,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: styles.RADIUS_LARGE,
    backgroundColor: styles.COLOR_SURFACE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: styles.SIZE_20,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: styles.FONT_SIZE_18,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_TEXT || styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    marginBottom: styles.SIZE_8,
  },
  emptySubtext: {
    fontSize: styles.FONT_SIZE_14,
    color: styles.COLOR_TEXT_MUTED,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    textAlign: 'center',
    paddingHorizontal: styles.SIZE_40,
  },
});

export default ProjectGalleryView;
