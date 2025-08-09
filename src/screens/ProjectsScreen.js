
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import HiveButton from '../components/buttons/HiveButton';


const LOCATIONS = ['Home', 'Office', 'Work'];
const PROJECTS = [
  { id: 1, name: 'Project A', client: 'Client A' },
  { id: 2, name: 'Project A', client: 'Client A' },
  { id: 3, name: 'Project A', client: 'Client A' },
  { id: 4, name: 'Project B', client: 'Client B' },
  { id: 5, name: 'Project B', client: 'Client B' }, 
  { id: 6, name: 'Project B', client: 'Client B' },
];

const ProjectsScreen = ({ navigation }) => {
  // Memoize navigation callback
  const goToSplash = useCallback(() => {
    navigation.navigate('Splash');
  }, [navigation]);

  // Memoize event handlers to prevent unnecessary re-renders of child components
  const handleStart = useCallback(({ projectId, location, startAt }) => {
    console.log('START', projectId, location, startAt.toISOString());
  }, []);

  const handleEnd = useCallback(({ projectId, location, startAt, endAt }) => {
    console.log('END', projectId, location, {
      start: startAt.toISOString(),
      end: endAt.toISOString(),
    });
  }, []);

  return (
    <ScreenWrapper
      headerTitle="DH-Reporting"
      headerSubtitle="Projects"
      scroll
      footer={<PrimaryButton title="Back to Splash" onPress={goToSplash} />}
    >
      <View style={styles.table}>
        {PROJECTS.map((project) => (
          <View key={project.id} style={styles.row}>
            {LOCATIONS.map((location) => (
              <HiveButton
                key={`${project.id}-${location}`}
                projectId={project.id}
                projectName={project.name}
                location={location}
                onStart={handleStart}
                onEnd={handleEnd}
              />
            ))}
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  table: {
    padding: appStyleConstants.SIZE_12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: appStyleConstants.SIZE_8,
    gap: appStyleConstants.SIZE_4,
  },
});
export default ProjectsScreen;
