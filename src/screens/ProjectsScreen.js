import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import { useWorkSession } from '../hooks/useWorkSession';
import { ActiveSessionCard } from '../components/ActiveSessionCard';
import { ViewToggle } from '../components/ViewToggle';
import { LocationModal } from '../components/LocationModal';
import { ProjectGalleryView } from '../components/ProjectGalleryView';
import { ProjectListView } from '../components/ProjectListView';
import { Session, WorkSession } from '../orm/models';

const ProjectsScreen = ({ navigation, route }) => {
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

  const handleLogout = useCallback(async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            if (activeSession) {
              const session = await WorkSession.find(activeSession.id);
              await session.update({
                end_work_time: Date.now(),
                notes: session.notes + ' | Ended due to logout'
              });
            }
            await Session.clear();
            navigation.replace('Signin');
          } catch (error) {
            console.error('Error during logout:', error);
            navigation.replace('Signin');
          }
        },
      },
    ]);
  }, [navigation, activeSession]);

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
      scroll
      footer={
        <View style={styles.footer}>
          <SecondaryButton title="Back to Splash" onPress={() => navigation.navigate('Splash')} />
          <PrimaryButton title="Logout" onPress={handleLogout} />
        </View>
      }
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: appStyleConstants.SIZE_16,
  },
  sectionTitle: {
    fontSize: appStyleConstants.FONT_SIZE_18,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
  footer: {
    flexDirection: 'row',
    gap: appStyleConstants.SIZE_12,
  },
});

export default ProjectsScreen;