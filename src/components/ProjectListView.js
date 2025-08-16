// components/ProjectListView.js
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';
import { LOCATION } from '../utils/constants';

const LOCATIONS = [
  { id: LOCATION.HOME, name: 'Home', icon: '🏠' },
  { id: LOCATION.OFFICE, name: 'Office', icon: '🏢' },
  { id: LOCATION.CLIENT, name: 'Client', icon: '👥' }
];

export const ProjectListView = ({ 
  projects, 
  activeSession, 
  onLocationPress,
  onProjectPress 
}) => {
  const handleLocationPress = (project, location) => {
    const isActive = activeSession?.project_id === project.id &&
      activeSession.active_location === location.name;
    const hasActive = !!activeSession;

    // If there's an active session for a different project, do nothing
    if (hasActive && activeSession.project_id !== project.id) return;

    if (isActive) {
      // End the current session
      onLocationPress(project, location, true);
    } else {
      // Start a new session or switch location
      onLocationPress(project, location, false);
    }
  };

  if (projects.length === 0) {
    return (
      <View style={listStyles.empty}>
        <View style={listStyles.emptyIcon}>
          <Text style={listStyles.emptyEmoji}>📁</Text>
        </View>
        <Text style={listStyles.emptyText}>No projects yet</Text>
        <Text style={listStyles.emptySubtext}>
          Add your first project to start tracking
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={listStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {projects.map((project, index) => {
        const isProjectActive = activeSession?.project_id === project.id;
        const hasActiveSession = activeSession !== null;
        const isProjectDisabled = hasActiveSession && !isProjectActive;

        return (
          <View key={project.id}>
            <View style={[
              listStyles.projectCard,
              isProjectActive && listStyles.projectCardActive,
              isProjectDisabled && listStyles.projectCardDisabled
            ]}>
              {/* Project Header */}
              <TouchableOpacity 
                style={listStyles.projectHeader}
                onPress={() => onProjectPress && onProjectPress(project)}
                disabled={isProjectDisabled}
                activeOpacity={0.7}
              >
                <View style={listStyles.projectTitleRow}>
                  {isProjectActive && (
                    <View style={listStyles.activeIndicator} />
                  )}
                  <Text style={[
                    listStyles.projectName,
                    isProjectActive && listStyles.projectNameActive,
                    isProjectDisabled && listStyles.projectNameDisabled
                  ]}>
                    {project.name}
                  </Text>
                </View>
                
                {isProjectActive && (
                  <Text style={listStyles.statusText}>ACTIVE</Text>
                )}
              </TouchableOpacity>

              {/* Location Buttons */}
              <View style={listStyles.locationRow}>
                {LOCATIONS.map((location) => {
                  const isLocationActive = !!(activeSession &&
                    activeSession.project_id === project.id &&
                    activeSession.active_location === location.name);

                  return (
                    <TouchableOpacity
                      key={`${project.id}-${location.id}`}
                      style={[
                        listStyles.locationButton,
                        isLocationActive && listStyles.locationButtonActive,
                        isProjectDisabled && listStyles.locationButtonDisabled
                      ]}
                      onPress={() => handleLocationPress(project, location)}
                      disabled={isProjectDisabled}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        listStyles.locationIcon,
                        isLocationActive && listStyles.locationIconActive,
                      ]}>
                        {location.icon}
                      </Text>
                      <Text style={[
                        listStyles.locationText,
                        isLocationActive && listStyles.locationTextActive,
                        isProjectDisabled && listStyles.locationTextDisabled
                      ]}>
                        {location.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            {/* Separator - except for last item */}
            {index < projects.length - 1 && <View style={listStyles.separator} />}
          </View>
        );
      })}
    </ScrollView>
  );
};

const listStyles = StyleSheet.create({
  container: {
    paddingBottom: styles.SIZE_24,
  },
  projectCard: {
    backgroundColor: styles.COLOR_SURFACE,
    borderRadius: styles.RADIUS_LARGE,
    padding: styles.SIZE_20,
    marginVertical: styles.SIZE_8,
  },
  projectCardActive: {
    backgroundColor: styles.COLOR_SURFACE_LIGHT || styles.COLOR_SURFACE,
    borderWidth: 1,
    borderColor: styles.COLOR_PRIMARY,
    padding: styles.SIZE_20 - 1, // Compensate for border
  },
  projectCardDisabled: {
    opacity: 0.3,
  },
  projectHeader: {
    marginBottom: styles.SIZE_16,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIndicator: {
    width: 3,
    height: 18,
    backgroundColor: styles.COLOR_PRIMARY,
    borderRadius: 2,
    marginRight: styles.SIZE_12,
  },
  projectName: {
    fontSize: styles.FONT_SIZE_18,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_TEXT || styles.COLOR_TEXT_LIGHT,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
    letterSpacing: -0.3,
    flex: 1,
  },
  projectNameActive: {
    color: styles.COLOR_TEXT || styles.COLOR_TEXT_LIGHT,
  },
  projectNameDisabled: {
    color: styles.COLOR_TEXT_SUBTLE,
  },
  statusText: {
    fontSize: styles.FONT_SIZE_10,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
    color: styles.COLOR_PRIMARY,
    letterSpacing: 0.8,
    marginTop: styles.SIZE_4,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
  },
  locationRow: {
    flexDirection: 'row',
    marginHorizontal: -styles.SIZE_4,
  },
  locationButton: {
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
  locationButtonActive: {
    backgroundColor: styles.COLOR_PRIMARY,
    borderColor: styles.COLOR_PRIMARY,
  },
  locationButtonDisabled: {
    backgroundColor: styles.COLOR_DARK,
    opacity: 0.5,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: styles.SIZE_6,
  },
  locationIconActive: {
    // Icon stays same when active
  },
  locationText: {
    fontSize: styles.FONT_SIZE_14,
    fontWeight: styles.FONT_WEIGHT_MEDIUM,
    color: styles.COLOR_TEXT_MUTED,
    fontFamily: styles.FONT_FAMILY_MONTSERRAT,
  },
  locationTextActive: {
    color: styles.COLOR_WHITE,
    fontWeight: styles.FONT_WEIGHT_SEMIBOLD,
  },
  locationTextDisabled: {
    color: styles.COLOR_TEXT_SUBTLE,
  },
  separator: {
    height: 1,
    backgroundColor: styles.COLOR_BORDER,
    marginVertical: styles.SIZE_12,
    opacity: 0.3,
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

export default ProjectListView;