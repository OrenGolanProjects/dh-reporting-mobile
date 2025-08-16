import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
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
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyText}>No projects available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.listContainer}>
      {projects.map((project) => {
        const isProjectActive = activeSession?.project_id === project.id;
        const hasActiveSession = activeSession !== null;
        const isProjectDisabled = hasActiveSession && !isProjectActive;

        return (
          <View key={project.id} style={[
            styles.projectStrip,
            isProjectActive && styles.activeProjectStrip,
            isProjectDisabled && styles.disabledProjectStrip
          ]}>
            <TouchableOpacity 
              style={styles.projectInfo}
              onPress={() => onProjectPress && onProjectPress(project)}
              disabled={isProjectDisabled}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.projectName,
                isProjectActive && styles.activeProjectName,
                isProjectDisabled && styles.disabledProjectName
              ]}>
                {project.name}
              </Text>
              {isProjectActive && (
                <View style={styles.workingBadge}>
                  <Text style={styles.workingBadgeText}>● WORKING</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.locationIcons}>
              {LOCATIONS.map((location) => {
                const isActiveForLocation = !!(activeSession &&
                  activeSession.project_id === project.id &&
                  activeSession.active_location === location.name);

                return (
                  <TouchableOpacity
                    key={`${project.id}-${location.id}`}
                    style={[
                      styles.locationIcon,
                      isActiveForLocation && styles.activeLocationIcon,
                      isProjectDisabled && styles.disabledLocationIcon
                    ]}
                    onPress={() => handleLocationPress(project, location)}
                    disabled={isProjectDisabled}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.locationIconEmoji,
                      isActiveForLocation && styles.activeLocationIconEmoji,
                      isProjectDisabled && styles.disabledLocationIconEmoji
                    ]}>
                      {location.icon}
                    </Text>
                    {isActiveForLocation && (
                      <View style={styles.locationActiveIndicator} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: appStyleConstants.SIZE_16,
    paddingBottom: appStyleConstants.SIZE_24,
  },
  projectStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_12,
    padding: appStyleConstants.SIZE_16,
    borderWidth: 2,
    borderColor: appStyleConstants.COLOR_BORDER,
    ...appStyleConstants.SHADOW_BOX_2,
  },
  activeProjectStrip: {
    backgroundColor: appStyleConstants.COLOR_TIMER_ACTIVE,
    borderColor: appStyleConstants.COLOR_SECONDARY_LIGHT,
    transform: [{ scale: 1.01 }],
  },
  disabledProjectStrip: {
    opacity: 0.4,
    backgroundColor: appStyleConstants.COLOR_DARKER,
  },
  projectInfo: {
    flex: 1,
    paddingRight: appStyleConstants.SIZE_16,
  },
  projectName: {
    fontSize: appStyleConstants.FONT_SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_4,
  },
  activeProjectName: {
    color: appStyleConstants.COLOR_WHITE,
  },
  disabledProjectName: {
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  workingBadge: {
    alignSelf: 'flex-start',
  },
  workingBadgeText: {
    fontSize: appStyleConstants.FONT_SIZE_10,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_WHITE,
    letterSpacing: 0.5,
  },
  locationIcons: {
    flexDirection: 'row',
    gap: appStyleConstants.SIZE_8,
  },
  locationIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appStyleConstants.COLOR_DARK,
    borderRadius: appStyleConstants.SIZE_12,
    borderWidth: 2,
    borderColor: appStyleConstants.COLOR_BORDER,
    position: 'relative',
  },
  activeLocationIcon: {
    backgroundColor: appStyleConstants.COLOR_WHITE,
    borderColor: appStyleConstants.COLOR_WHITE,
    transform: [{ scale: 1.1 }],
  },
  disabledLocationIcon: {
    backgroundColor: appStyleConstants.COLOR_DARKER,
    borderColor: appStyleConstants.COLOR_MUTED,
    opacity: 0.3,
  },
  locationIconEmoji: {
    fontSize: appStyleConstants.FONT_SIZE_24,
  },
  activeLocationIconEmoji: {
    fontSize: appStyleConstants.FONT_SIZE_20,
  },
  disabledLocationIconEmoji: {
    opacity: 0.5,
  },
  locationActiveIndicator: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    backgroundColor: appStyleConstants.COLOR_SECONDARY,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: appStyleConstants.COLOR_WHITE,
  },
  empty: {
    alignItems: 'center',
    padding: appStyleConstants.SIZE_32,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: appStyleConstants.SIZE_8,
  },
  emptyText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
});

export default ProjectListView;