import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

export const ProjectGalleryView = ({ projects, activeSession, onProjectPress }) => {
  if (projects.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyText}>No projects available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {projects.map((project) => {
        const isActive = activeSession?.project_id === project.id;
        const blocked = !!activeSession && !isActive;
        
        return (
          <TouchableOpacity
            key={project.id}
            style={[
              styles.tile,
              isActive && styles.tileActive,
              blocked && styles.tileDisabled,
            ]}
            onPress={() => onProjectPress(project)}
            disabled={blocked}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.tileText,
                isActive && styles.tileTextActive,
                blocked && styles.tileTextDisabled,
              ]}
              numberOfLines={2}
            >
              {project.name}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appStyleConstants.SIZE_12,
    paddingBottom: appStyleConstants.SIZE_24,
  },
  tile: {
    width: 150,
    height: 45,
    borderRadius: appStyleConstants.SIZE_8,
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderWidth: 2,
    borderColor: appStyleConstants.COLOR_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    padding: appStyleConstants.SIZE_12,
    position: 'relative',
    ...appStyleConstants.SHADOW_BOX_2,
  },
  tileActive: {
    backgroundColor: appStyleConstants.COLOR_TIMER_ACTIVE,
    borderColor: appStyleConstants.COLOR_SECONDARY_LIGHT,
    transform: [{ scale: 1.02 }],
  },
  tileDisabled: {
    backgroundColor: appStyleConstants.COLOR_DARKER,
    borderColor: appStyleConstants.COLOR_MUTED,
    opacity: 0.5,
  },
  tileText: {
    textAlign: 'center',
    fontSize: appStyleConstants.FONT_SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
  },
  tileTextActive: {
    color: appStyleConstants.COLOR_WHITE,
  },
  tileTextDisabled: {
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  activeIndicator: {
    position: 'absolute',
    top: appStyleConstants.SIZE_8,
    right: appStyleConstants.SIZE_8,
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

export default ProjectGalleryView;