// src/screens/ProjectsScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import { useWorkSession } from '../hooks/useWorkSession';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { ViewToggle } from '../components/ViewToggle';
import { LocationModal } from '../components/LocationModal';
import { ProjectGalleryView } from '../components/ProjectGalleryView';
import { ProjectListView } from '../components/ProjectListView';

const ProjectsScreen = ({ navigation }) => {
  const {
    projects,
    currentUser,
    activeSession,
    isLoading,
    startNewSession,
    endSession,
    handleSessionSwitch
  } = useWorkSession(navigation);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const handleSettings = () => navigation.navigate('Profile', { screen: 'Settings' });

  const handleNavigateToComponents = () => {
    navigation.navigate('NewScreen', {
      userId: currentUser?.id,
      projectId: selectedProject?.id
    });
  };

  const handleProjectPress = (project) => {
    setSelectedProject(project);
    setShowLocationMenu(true);
  };

  const handleLocationSelect = async (locationName) => {
    const now = new Date();

    if (activeSession) {
      const sameProject = activeSession.project_id === selectedProject.id;
      const sameLocation = sameProject && activeSession.active_location === locationName;

      if (sameProject && sameLocation) {
        await endSession(now);
        setShowLocationMenu(false);
        setSelectedProject(null);
        return;
      }

      const targetLabel = sameProject
        ? `${selectedProject.name} at ${locationName}`
        : `${selectedProject.name} (${locationName})`;

      Alert.alert(
        'Active Session',
        `You're already working on "${activeSession.project_name}" at ${activeSession.active_location}. End it and start "${targetLabel}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'End & Start New',
            onPress: async () => {
              try {
                await handleSessionSwitch(selectedProject.id, locationName, now);
                setShowLocationMenu(false);
                setSelectedProject(null);
              } catch (error) {
                console.error('Failed to switch sessions:', error);
              }
            },
          },
        ],
      );
      return;
    }

    await startNewSession(selectedProject.id, locationName, now);
    setShowLocationMenu(false);
    setSelectedProject(null);
  };

  const handleLocationPressFromList = async (project, location, isEnding) => {
    if (isEnding) {
      await endSession(new Date());
    } else {
      setSelectedProject(project);
      await handleLocationSelect(location.name);
    }
  };

  // Header Right Component with Settings and Components buttons
  const HeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleSettings}
      >
        <Text style={styles.headerButtonText}>⚙️</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleNavigateToComponents}
      >
        <Text style={styles.headerButtonText}>🎨</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenWrapper headerTitle="DH-Reporting" headerSubtitle="Loading..." center>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading projects…</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      headerTitle={`Welcome, ${currentUser?.first_name || 'User'}`}
      headerSubtitle="Track your hour reports"
      headerRight={<HeaderRight />}
      headerVariant="compact"
      scroll
    >
      <View style={styles.container}>
        <ActiveSessionCard activeSession={activeSession} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Projects</Text>
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </View>

        {viewMode === 'gallery' ? (
          <ProjectGalleryView
            projects={projects}
            activeSession={activeSession}
            onProjectPress={handleProjectPress}
          />
        ) : (
          <ProjectListView
            projects={projects}
            activeSession={activeSession}
            onLocationPress={handleLocationPressFromList}
            onProjectPress={handleProjectPress}
          />
        )}

        <LocationModal
          visible={showLocationMenu}
          project={selectedProject}
          onSelectLocation={handleLocationSelect}
          onClose={() => {
            setShowLocationMenu(false);
            setSelectedProject(null);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: appStyleConstants.SIZE_16,
  },
  loading: {
    padding: appStyleConstants.SIZE_24,
  },
  loadingText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },

  // Header Right Actions
  headerRight: {
    flexDirection: 'row',
    gap: appStyleConstants.SIZE_8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: appStyleConstants.SIZE_16,
    marginTop: appStyleConstants.SIZE_16,
  },
  sectionTitle: {
    fontSize: appStyleConstants.FONT_SIZE_18,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
});

export default ProjectsScreen;