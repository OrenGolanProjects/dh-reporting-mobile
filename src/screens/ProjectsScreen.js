// src/screens/ProjectsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import { useWorkSession } from '../hooks/useWorkSession';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { ViewToggle } from '../components/ViewToggle';
import { LocationModal } from '../components/LocationModal';
import { ProjectGalleryView } from '../components/ProjectGalleryView';
import { ProjectListView } from '../components/ProjectListView';
import logger from '../utils/logger';

const ProjectsScreen = ({ navigation }) => {
  const {
    projects,
    currentUser,
    activeSession,
    isLoading,
    error,
    startNewSession,
    endSession,
    handleSessionSwitch,
    loadData,
  } = useWorkSession(navigation);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const handleSettings = () => navigation.navigate('Profile', { screen: 'Settings' });

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
                logger.error('Failed to switch sessions:', error);
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

  const HeaderRight = () => (
    <View style={styles.headerRight}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleSettings}
      >
        <Text style={styles.headerButtonText}>⚙️</Text>
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

  if (error) {
    return (
      <ScreenWrapper headerTitle="DH-Reporting" headerSubtitle="Error" center>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>Failed to load your data. Please try again.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadData}
            accessibilityRole="button"
            accessibilityLabel="Retry loading data"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
    >
      <View style={styles.container}>
        {viewMode === 'gallery' ? (
          <ProjectGalleryView
            projects={projects}
            activeSession={activeSession}
            onProjectPress={handleProjectPress}
            ListHeaderComponent={
              <>
                <ActiveSessionCard activeSession={activeSession} />
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your Projects</Text>
                  <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </View>
              </>
            }
          />
        ) : (
          <ProjectListView
            projects={projects}
            activeSession={activeSession}
            onLocationPress={handleLocationPressFromList}
            onProjectPress={handleProjectPress}
            ListHeaderComponent={
              <>
                <ActiveSessionCard activeSession={activeSession} />
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your Projects</Text>
                  <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </View>
              </>
            }
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
  errorContainer: {
    padding: appStyleConstants.SIZE_24,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: appStyleConstants.FONT_SIZE_18,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_8,
  },
  errorText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    textAlign: 'center',
    marginBottom: appStyleConstants.SIZE_24,
  },
  retryButton: {
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
    paddingVertical: appStyleConstants.SIZE_12,
    paddingHorizontal: appStyleConstants.SIZE_24,
    borderRadius: appStyleConstants.RADIUS_MEDIUM,
  },
  retryButtonText: {
    color: appStyleConstants.COLOR_WHITE,
    fontSize: appStyleConstants.FONT_SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
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