import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import HiveButton from '../components/buttons/HiveButton';
import {
  getCurrentUser,
  clearCurrentUser,
  getAllProjects,
  createProject,
  startWorkSession,
  endWorkSession,
  getActiveWorkSession
} from '../database';
import { LOCATION, LOCATION_NAMES } from '../utils/constants';
import SecondaryButton from '../components/buttons/SecondaryButton';

// Convert location numbers to names for display
const LOCATIONS = [
  { id: LOCATION.HOME, name: LOCATION_NAMES[LOCATION.HOME] },
  { id: LOCATION.WORK, name: LOCATION_NAMES[LOCATION.WORK] },
  { id: LOCATION.OFFICE, name: LOCATION_NAMES[LOCATION.OFFICE] }
];

const ProjectsScreen = ({ navigation, route }) => {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Timer for updating elapsed time display
  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  /**
   * Calculate elapsed time for active session
   */
  const getElapsedTime = () => {
    if (!activeSession) {
      return null;
    }

    const startTimeValue = activeSession.start_work_time || activeSession.start_time;

    if (!startTimeValue) {
      return null;
    }

    const startTime = new Date(startTimeValue).getTime();
    const elapsed = currentTime - startTime;

    // Ensure positive elapsed time
    if (elapsed < 0) {
      return "00:00:00";
    }

    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const userFromSplash = route.params?.user;

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Use passed user or fetch if not available
      let user = userFromSplash;
      if (!user) {
        user = await getCurrentUser();
        if (!user) {
          navigation.replace('Signin');
          return;
        }
      }
      setCurrentUser(user);

      // Load projects
      await loadProjects();

      // Check for active work session
      const active = await getActiveWorkSession(user.id);
      setActiveSession(active);

    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load projects from database
   */
  const loadProjects = async () => {
    try {
      const projectList = await getAllProjects();

      if (!projectList || projectList.length === 0) {
        Alert.alert(
          'No Projects Found',
          'No projects are available. Please add projects through the admin panel or database.',
          [{ text: 'OK' }]
        );
        setProjects([]);
        return;
      }

      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
      Alert.alert('Error', 'Failed to load projects. Please try again.');
      setProjects([]);
    }
  };

  /**
   * Handle starting work on a project
   */
  const handleStart = useCallback(async ({ projectId, location, startAt }) => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to track time');
      return;
    }

    try {
      // Check if user already has an active session
      const existing = await getActiveWorkSession(currentUser.id);
      if (existing) {
        Alert.alert(
          'Active Session Found',
          `You're already working on "${existing.project_name}". End that session first?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'End Previous & Start New',
              onPress: async () => {
                try {
                  await endWorkSession(existing.id, Date.now());
                  await startNewSession(projectId, location, startAt);
                } catch (error) {
                  console.error('Error switching sessions:', error);
                  Alert.alert('Error', 'Failed to switch sessions. Please try again.');
                }
              }
            }
          ]
        );
        return;
      }

      await startNewSession(projectId, location, startAt);

    } catch (error) {
      console.error('Error starting work session:', error);
      Alert.alert('Error', 'Failed to start work session. Please try again.');
    }
  }, [currentUser]);

  /**
   * Start a new work session
   */
  const startNewSession = async (projectId, location, startAt) => {
    try {
      const session = await startWorkSession({
        projectId,
        userId: currentUser.id,
        startTime: startAt.getTime(),
        notes: `Started via mobile app - ${location}`
      });

      // Get fresh session data with project info
      const sessionWithProject = await getActiveWorkSession(currentUser.id);

      // Store the specific location that was pressed
      const sessionWithLocation = {
        ...sessionWithProject,
        active_location: location
      };

      setActiveSession(sessionWithLocation);
      setCurrentTime(Date.now());

      console.log('Work session started:', session.id);
      Alert.alert('Work Started', `Time tracking has begun for ${location}!`);
    } catch (error) {
      console.error('Error in startNewSession:', error);
      throw error;
    }
  };

  /**
   * Handle ending work on a project
   */
  const handleEnd = useCallback(async ({ projectId, location, endAt }) => {
    if (!currentUser || !activeSession) {
      Alert.alert('Error', 'No active work session found');
      return;
    }

    try {
      // Get the actual start time from the active session
      const sessionStartTime = activeSession.start_work_time || activeSession.start_time;

      if (!sessionStartTime) {
        console.error('No session start time found');
        Alert.alert('Error', 'Could not determine session start time');
        return;
      }

      const updatedSession = await endWorkSession(
        activeSession.id,
        endAt.getTime(),
        0, // break time - could be calculated or input by user
        'Ended via mobile app'
      );

      // Calculate work duration using the session's actual start time from database
      const endTimeMs = endAt.getTime();
      const startTimeMs = Number(sessionStartTime);
      const durationMs = endTimeMs - startTimeMs;
      const durationMinutes = durationMs / (1000 * 60);
      const durationHours = durationMs / (1000 * 60 * 60);

      // Format for display - show minutes if less than 1 hour
      const displayDuration = durationHours >= 1
        ? `${durationHours.toFixed(2)} hours`
        : `${durationMinutes.toFixed(1)} minutes`;

      // Clear the active session
      setActiveSession(null);
      setCurrentTime(Date.now());

      console.log('Work session ended:', updatedSession.id);
      Alert.alert(
        'Work Completed',
        `You worked for ${displayDuration} on "${activeSession.project_name}" at ${location}`
      );

    } catch (error) {
      console.error('Error ending work session:', error);
      Alert.alert('Error', 'Failed to end work session. Please try again.');
    }
  }, [currentUser, activeSession]);

  /**
   * Handle logout
   */
  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // End any active session first
              if (activeSession) {
                await endWorkSession(activeSession.id, Date.now());
              }

              await clearCurrentUser();
              navigation.replace('Signin');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  }, [navigation, activeSession]);

  // Navigate back to splash (for testing)
  const goToSplash = useCallback(() => {
    navigation.navigate('Splash');
  }, [navigation]);

  if (isLoading) {
    return (
      <ScreenWrapper
        headerTitle="DH-Reporting"
        headerSubtitle="Loading..."
        center
      >
        <View style={styles.loading}>
          {/* You can add a loading spinner here */}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      headerTitle={`Welcome ${currentUser?.first_name || 'User'}`}
      headerSubtitle={activeSession ? `Working on: ${activeSession.project_name}` : "Projects"}
      scroll
      footer={
        <View style={styles.footerButtons}>
          <PrimaryButton title="Logout" onPress={handleLogout} />
          <SecondaryButton title="Back to Splash" onPress={goToSplash} />
        </View>
      }
    >
      <View style={styles.projectsContainer}>
        {projects.map((project) => (
          <View key={project.id} style={styles.projectSection}>
            {/* Location Buttons Row */}
            <View style={styles.buttonsRow}>
              {LOCATIONS.map((location) => {
                // Check if this SPECIFIC button is active (project + location match)
                const isActiveForThisButton = !!(activeSession &&
                  activeSession.project_id === project.id &&
                  activeSession.active_location === location.name);

                // Check if ANY session is active (for disabling other buttons)
                const hasActiveSession = activeSession !== null;

                // Only show elapsed time for the active button
                const elapsedTime = isActiveForThisButton ? getElapsedTime() : null;

                // Disable button if there's an active session and it's not this specific button
                const isDisabled = hasActiveSession && !isActiveForThisButton;

                return (
                  <View key={`${project.id}-${location.id}`} style={styles.buttonContainer}>
                    <HiveButton
                      projectId={project.id}
                      projectName={project.name}
                      location={location.name}
                      onStart={handleStart}
                      onEnd={handleEnd}
                      isActive={isActiveForThisButton}
                      isDisabled={isDisabled}
                      elapsedTime={elapsedTime}
                      width="100%"
                      height={80}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {projects.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No projects available</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  projectsContainer: {
    flex: 1,
  },
  projectSection: {
    marginBottom: appStyleConstants.SIZE_16,
    paddingHorizontal: appStyleConstants.SIZE_4,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: appStyleConstants.SIZE_8,
  },
  buttonContainer: {
    flex: 1,
    maxWidth: 95,
    height: 95,
  },
  loading: {
    padding: appStyleConstants.SIZE_32,
  },
  footerButtons: {
    gap: appStyleConstants.SIZE_8,
  },
  emptyState: {
    padding: appStyleConstants.SIZE_32,
    alignItems: 'center',
  },
  emptyText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED || '#CCCCCC',
    textAlign: 'center',
  }
});

export default ProjectsScreen;