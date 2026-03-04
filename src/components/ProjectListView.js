// components/ProjectListView.js
import React, { useCallback, memo } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants as styles } from '@orenuki/dh-reporting-shared';
import { LOCATIONS } from '../utils/constants';
import EmptyState from './EmptyState';
import LocationItem from './LocationItem';

const ProjectListItem = memo(function ProjectListItem({ project, activeSession, onLocationPress, onProjectPress }) {
  const isProjectActive = activeSession?.project_id === project.id;
  const hasActiveSession = activeSession !== null;
  const isProjectDisabled = hasActiveSession && !isProjectActive;

  const handleLocationPress = (location) => {
    const isActive = isProjectActive && activeSession.active_location === location.name;

    if (hasActiveSession && activeSession.project_id !== project.id) return;

    if (isActive) {
      onLocationPress(project, location, true);
    } else {
      onLocationPress(project, location, false);
    }
  };

  return (
    <View style={[
      listStyles.projectCard,
      isProjectActive && listStyles.projectCardActive,
      isProjectDisabled && listStyles.projectCardDisabled
    ]}>
      <TouchableOpacity
        style={listStyles.projectHeader}
        onPress={() => onProjectPress && onProjectPress(project)}
        disabled={isProjectDisabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={project.name}
        accessibilityState={{ disabled: isProjectDisabled }}
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

      <View style={listStyles.locationRow}>
        {LOCATIONS.map((location) => {
          const isLocationActive = !!(activeSession &&
            activeSession.project_id === project.id &&
            activeSession.active_location === location.name);

          return (
            <LocationItem
              key={`${project.id}-${location.id}`}
              location={location}
              variant="button"
              isActive={isLocationActive}
              isDisabled={isProjectDisabled}
              onPress={handleLocationPress}
            />
          );
        })}
      </View>
    </View>
  );
});

const EmptyList = () => (
  <EmptyState
    icon="📁"
    title="No projects yet"
    subtitle="Add your first project to start tracking"
  />
);

export const ProjectListView = ({
  projects,
  activeSession,
  onLocationPress,
  onProjectPress,
  ListHeaderComponent,
}) => {
  const keyExtractor = useCallback((item) => String(item.id), []);

  const renderItem = useCallback(({ item }) => (
    <ProjectListItem
      project={item}
      activeSession={activeSession}
      onLocationPress={onLocationPress}
      onProjectPress={onProjectPress}
    />
  ), [activeSession, onLocationPress, onProjectPress]);

  const renderSeparator = useCallback(() => (
    <View style={listStyles.separator} />
  ), []);

  // Item height estimate: card padding (20*2) + header (~34) + location row (~48) + margins (8*2) + separator (25)
  const ITEM_HEIGHT = 163;
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <FlatList
      data={projects}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={EmptyList}
      contentContainerStyle={listStyles.container}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      windowSize={5}
    />
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
  separator: {
    height: 1,
    backgroundColor: styles.COLOR_BORDER,
    marginVertical: styles.SIZE_12,
    opacity: 0.3,
  },
});

export default ProjectListView;