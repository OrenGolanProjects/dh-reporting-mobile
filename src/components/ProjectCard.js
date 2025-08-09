import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import CardWrapper from './wrappers/CardWrapper';
import StatusBadge from './StatusBadge';
import HiveButton from './buttons/HiveButton';

const ProjectCard = ({ project, locations = [], onStart, onEnd }) => {
  return (
    <CardWrapper
      headerLeft={
        <View>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.clientName}>{project.client}</Text>
        </View>
      }
      headerRight={<StatusBadge status={project.status} />}
      footer={
        <View style={styles.hiveRow}>
          {locations.map((loc) => (
            <HiveButton
              key={`${project.id}-${loc}`}
              projectId={project.id}
              projectName={project.name}
              location={loc}
              onStart={onStart}
              onEnd={onEnd}
            />
          ))}
        </View>
      }
    >
      <View style={styles.detailsRow}>
        <View style={styles.hoursContainer}>
          <Text style={styles.hoursNumber}>{project.hours}</Text>
          <Text style={styles.hoursLabel}>HOURS</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  projectName: {
    ...appStyleConstants.STYLE_HEADER_2,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    marginBottom: appStyleConstants.SIZE_4,
  },
  clientName: {
    ...appStyleConstants.STYLE_HEADER_3,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: appStyleConstants.SIZE_16,
    borderTopWidth: 1,
    borderTopColor: appStyleConstants.COLOR_BORDER,
  },
  hoursContainer: { flexDirection: 'row', alignItems: 'center' },
  hoursNumber: {
    ...appStyleConstants.STYLE_HEADER_1,
    color: appStyleConstants.COLOR_PRIMARY_LIGHT,
    marginRight: appStyleConstants.SIZE_8,
  },
  hoursLabel: { ...appStyleConstants.STYLE_CAPTION, letterSpacing: 0.5 },
  arrow: { ...appStyleConstants.STYLE_HEADER_2, color: appStyleConstants.COLOR_TEXT_MUTED },
  hiveRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appStyleConstants.SIZE_8,
    marginTop: appStyleConstants.SIZE_12,
  },
});

export default ProjectCard;
