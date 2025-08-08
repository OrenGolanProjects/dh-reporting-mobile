import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import StatusBadge from '../components/StatusBadge';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import { CommonActions, useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';

const ProjectsScreen = ({ navigation }) => {
  const projects = [
    {
      id: 3,
      name: 'Brand Design',
      client: 'Creative Studio',
      hours: 89.5,
      status: 'Complete',
    },
    {
      id: 2,
      name: 'Mobile App',
      client: 'TechStart Inc',
      hours: 156.0,
      status: 'Pending',
    },
    {
      id: 1,
      name: 'Website Redesign',
      client: 'Acme Corp',
      hours: 24.5,
      status: 'In Progress',
    },
    {
      id: 4,
      name: 'Internal Dashboard',
      client: 'LogiSoft Ltd',
      hours: 42.75,
      status: 'Failed',
    },
  ];

  const renderProjectCard = (project) => (
    <View key={project.id} style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.clientName}>{project.client}</Text>
        </View>
        <StatusBadge status={project.status} />
      </View>

      <View style={styles.projectDetails}>
        <View style={styles.hoursContainer}>
          <Text style={styles.hoursNumber}>{project.hours}</Text>
          <Text style={styles.hoursLabel}>HOURS</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </View>
  );

  const goToSplash = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Projects</Text>
        <Text style={styles.headerSubtitle}>Track your active and completed projects</Text>
      </View>

      <ScrollView style={styles.projectsList} showsVerticalScrollIndicator={false}>
        {projects.map(renderProjectCard)}
      </ScrollView>
      <PrimaryButton title="Back to Splash" onPress={goToSplash} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_DARK,
  },
  header: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    paddingTop: 60,
    paddingBottom: appStyleConstants.SIZE_32,
    paddingHorizontal: appStyleConstants.SIZE_24,
    alignItems: 'center',
  },
  headerTitle: {
    ...appStyleConstants.STYLE_TITLE,
    marginBottom: appStyleConstants.SIZE_8,
    marginTop: appStyleConstants.SIZE_12,
  },
  headerSubtitle: {
    ...appStyleConstants.STYLE_HEADER_2,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  projectsList: {
    flex: 1,
    padding: appStyleConstants.SIZE_24,
  },
  projectCard: {
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_32,
    padding: appStyleConstants.SIZE_24,
    marginBottom: appStyleConstants.SIZE_16,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: appStyleConstants.SIZE_16,
  },
  projectName: {
    ...appStyleConstants.STYLE_HEADER_2,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    marginBottom: appStyleConstants.SIZE_4,
  },
  clientName: {
    ...appStyleConstants.STYLE_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: appStyleConstants.SIZE_16,
    borderTopWidth: 1,
    borderTopColor: appStyleConstants.COLOR_BORDER,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursNumber: {
    ...appStyleConstants.STYLE_HEADER_1,
    color: appStyleConstants.COLOR_PRIMARY_LIGHT,
    marginRight: appStyleConstants.SIZE_8,
  },
  hoursLabel: {
    ...appStyleConstants.STYLE_CAPTION,
    letterSpacing: 0.5,
  },
  arrow: {
    ...appStyleConstants.STYLE_HEADER_2,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
});

export default ProjectsScreen;
