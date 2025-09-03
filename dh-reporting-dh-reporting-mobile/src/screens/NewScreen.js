// src/screens/NewScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import CardWrapper from '../components/wrappers/CardWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import InputField from '../components/InputField';
import EmailField from '../components/fields/EmailField';
import StatusBadge from '../components/StatusBadge';
import SideDrawer from '../components/drawers/SideDrawer';

const NewScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId, projectId } = route.params || {};

  const [textInput, setTextInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);

  const sampleProject = {
    id: 1,
    name: 'Mobile App Redesign',
    client: 'Tech Startup Inc.',
    hours: 42.5,
    status: 'In Progress'
  };

  return (
    <ScreenWrapper
      headerTitle="Component Showcase"
      headerSubtitle="All reusable components in your design system"
      headerVariant="compact"
      scroll
      footer={
        <View style={styles.footer}>
          <SecondaryButton title="Back" onPress={() => navigation.goBack()} />
          <PrimaryButton title="Close Drawer" onPress={() => setShowDrawer(false)} />
        </View>
      }
    >
      {(userId || projectId) && (
        <ComponentSection title="📱 Screen Parameters">
          <ComponentDemo name="Navigation Parameters" type="layout">
            <View style={styles.paramContainer}>
              {userId && <Text style={styles.paramText}>User ID: {userId}</Text>}
              {projectId && <Text style={styles.paramText}>Project ID: {projectId}</Text>}
            </View>
          </ComponentDemo>
        </ComponentSection>
      )}

      <ComponentSection title="🔘 Action Buttons">
        <ComponentDemo name="Primary Action Button" type="button">
          <PrimaryButton
            title="Start Work Session"
            onPress={() => Alert.alert('Primary Button', 'This would start a work session')}
          />
        </ComponentDemo>

        <ComponentDemo name="Secondary Action Button" type="button">
          <SecondaryButton
            title="View Reports"
            onPress={() => Alert.alert('Secondary Button', 'This would show reports')}
          />
        </ComponentDemo>

        <ComponentDemo name="Button States" type="button">
          <View style={styles.buttonGroup}>
            <PrimaryButton title="Disabled Button" disabled style={styles.buttonSpacing} />
            <SecondaryButton 
              title="Normal Button" 
              onPress={() => Alert.alert('Button', 'Normal state')}
              style={styles.buttonSpacing} 
            />
          </View>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection title="📝 Form Input Fields">
        <ComponentDemo name="Text Input Field" type="input">
          <InputField
            placeholder="Enter project name..."
            value={textInput}
            onChangeText={setTextInput}
          />
          {textInput && <Text style={styles.inputPreview}>You typed: "{textInput}"</Text>}
        </ComponentDemo>

        <ComponentDemo name="Email Input Field" type="input">
          <EmailField
            placeholder="Enter your email..."
            value={emailInput}
            onChangeText={setEmailInput}
          />
          {emailInput && <Text style={styles.inputPreview}>Email: "{emailInput}"</Text>}
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection title="🏷️ Status Indicators">
        <ComponentDemo name="Status Badge Variations" type="status">
          <View style={styles.statusContainer}>
            <StatusBadge status="Complete" style={styles.statusSpacing} />
            <StatusBadge status="In Progress" style={styles.statusSpacing} />
            <StatusBadge status="Pending" style={styles.statusSpacing} />
            <StatusBadge status="Failed" style={styles.statusSpacing} />
          </View>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection title="🃏 Card Containers">
        <ComponentDemo name="Basic Content Card" type="card">
          <CardWrapper
            headerLeft={
              <View>
                <Text style={styles.cardTitle}>Project Details</Text>
                <Text style={styles.cardSubtitle}>Client: {sampleProject.client}</Text>
              </View>
            }
            headerRight={<StatusBadge status={sampleProject.status} />}
          >
            <View style={styles.cardContent}>
              <Text style={styles.hoursText}>{sampleProject.hours} hours logged</Text>
              <Text style={styles.cardDescription}>
                This card shows how to structure project information with header and content areas.
              </Text>
            </View>
          </CardWrapper>
        </ComponentDemo>

        <ComponentDemo name="Interactive Card with Footer" type="card">
          <CardWrapper
            headerLeft={
              <View>
                <Text style={styles.cardTitle}>Time Tracking</Text>
                <Text style={styles.cardSubtitle}>Current Session</Text>
              </View>
            }
            footer={
              <View style={styles.cardFooter}>
                <SecondaryButton
                  title="Pause"
                  onPress={() => Alert.alert('Card Action', 'Pause session')}
                  style={styles.footerButton}
                />
                <PrimaryButton
                  title="End Session"
                  onPress={() => Alert.alert('Card Action', 'End current session')}
                  style={styles.footerButton}
                />
              </View>
            }
          >
            <Text style={styles.sessionTime}>02:34:18</Text>
            <Text style={styles.cardDescription}>Active session timer</Text>
          </CardWrapper>
        </ComponentDemo>

        <ComponentDemo name="Clickable Navigation Card" type="card">
          <CardWrapper
            onPress={() => Alert.alert('Navigation', 'Navigate to project details')}
            headerLeft={
              <View>
                <Text style={styles.cardTitle}>📊 Reports</Text>
                <Text style={styles.cardSubtitle}>Weekly Summary</Text>
              </View>
            }
          >
            <Text style={styles.cardDescription}>
              Tap anywhere on this card to navigate to detailed reports.
            </Text>
          </CardWrapper>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection title="🧭 Navigation Components">
        <ComponentDemo name="Side Drawer Menu" type="navigation">
          <PrimaryButton title="Open Side Drawer" onPress={() => setShowDrawer(true)} />
        </ComponentDemo>

        <ComponentDemo name="Navigation Actions" type="navigation">
          <View style={styles.buttonGroup}>
            <SecondaryButton
              title="Go Back"
              onPress={() => navigation.goBack()}
              style={styles.buttonSpacing}
            />
            <PrimaryButton
              title="Navigate with Params"
              onPress={() => navigation.navigate('NewScreen', { userId: 123, projectId: 456 })}
              style={styles.buttonSpacing}
            />
          </View>
        </ComponentDemo>
      </ComponentSection>

      <ComponentSection title="📐 Layout Wrappers">
        <ComponentDemo name="Screen Wrapper Features" type="layout">
          <View style={styles.wrapperDemo}>
            <Text style={styles.wrapperText}>✓ Safe area handling</Text>
            <Text style={styles.wrapperText}>✓ Consistent padding</Text>
            <Text style={styles.wrapperText}>✓ Header with title/subtitle</Text>
            <Text style={styles.wrapperText}>✓ Scrollable content</Text>
            <Text style={styles.wrapperText}>✓ Footer with actions</Text>
            <Text style={styles.wrapperText}>✓ Keyboard avoidance (when enabled)</Text>
          </View>
        </ComponentDemo>
      </ComponentSection>

      <SideDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        side="left"
        width={300}
      >
        <View style={styles.drawerContent}>
          <Text style={styles.drawerTitle}>📱 Side Drawer Demo</Text>
          <Text style={styles.drawerDescription}>
            This drawer slides in from the left side and provides additional navigation options.
          </Text>
          
          <View style={styles.drawerMenu}>
            <DrawerMenuItem title="📊 Analytics" />
            <DrawerMenuItem title="⚙️ Settings" />
            <DrawerMenuItem title="👤 Profile" />
            <DrawerMenuItem title="📋 Projects" />
            <DrawerMenuItem title="🕒 Time Logs" />
            <DrawerMenuItem title="📤 Export Data" />
          </View>

          <PrimaryButton
            title="Close Drawer"
            onPress={() => setShowDrawer(false)}
            style={styles.closeButton}
          />
        </View>
      </SideDrawer>
    </ScreenWrapper>
  );
};

const ComponentSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ComponentDemo = ({ name, children, type = 'default' }) => {
  const getTypeStyle = () => {
    const typeStyles = {
      button: styles.buttonDemo,
      input: styles.inputDemo,
      status: styles.statusDemo,
      card: styles.cardDemo,
      navigation: styles.navigationDemo,
      layout: styles.layoutDemo,
    };
    return typeStyles[type] || {};
  };

  return (
    <View style={[styles.demo, getTypeStyle()]}>
      <Text style={styles.demoName}>{name}</Text>
      <View style={styles.demoContent}>{children}</View>
    </View>
  );
};

const DrawerMenuItem = ({ title }) => (
  <View style={styles.drawerMenuItem}>
    <Text style={styles.drawerMenuText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: appStyleConstants.SIZE_12,
    justifyContent: 'space-between',
  },
  paramContainer: {
    padding: appStyleConstants.SIZE_12,
    backgroundColor: appStyleConstants.COLOR_DARKER,
    borderRadius: appStyleConstants.SIZE_8,
  },
  paramText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_PRIMARY,
    fontWeight: appStyleConstants.FONT_WEIGHT_MEDIUM,
    marginBottom: appStyleConstants.SIZE_4,
  },
  section: {
    marginBottom: appStyleConstants.SIZE_32,
  },
  sectionTitle: {
    ...appStyleConstants.STYLE_HEADER_2,
    color: appStyleConstants.COLOR_PRIMARY,
    marginBottom: appStyleConstants.SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
  demo: {
    marginBottom: appStyleConstants.SIZE_24,
    padding: appStyleConstants.SIZE_16,
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_12,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
  },
  buttonDemo: { borderLeftWidth: 4, borderLeftColor: appStyleConstants.COLOR_PRIMARY },
  inputDemo: { borderLeftWidth: 4, borderLeftColor: appStyleConstants.COLOR_SECONDARY },
  statusDemo: { borderLeftWidth: 4, borderLeftColor: '#FF6B6B' },
  cardDemo: { borderLeftWidth: 4, borderLeftColor: '#4ECDC4' },
  navigationDemo: { borderLeftWidth: 4, borderLeftColor: '#45B7D1' },
  layoutDemo: { borderLeftWidth: 4, borderLeftColor: '#96CEB4' },
  demoName: {
    ...appStyleConstants.STYLE_HEADER_3,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_8,
  },
  demoContent: {
    alignItems: 'flex-start',
  },
  inputPreview: {
    ...appStyleConstants.STYLE_CAPTION,
    color: appStyleConstants.COLOR_PRIMARY,
    marginTop: appStyleConstants.SIZE_8,
    fontStyle: 'italic',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: appStyleConstants.SIZE_12,
    flexWrap: 'wrap',
  },
  buttonSpacing: {
    flex: 1,
    minWidth: 120,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appStyleConstants.SIZE_8,
  },
  statusSpacing: {
    marginRight: appStyleConstants.SIZE_8,
    marginBottom: appStyleConstants.SIZE_8,
  },
  cardTitle: {
    ...appStyleConstants.STYLE_HEADER_3,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_4,
  },
  cardSubtitle: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
  },
  cardContent: {
    paddingTop: appStyleConstants.SIZE_8,
  },
  cardDescription: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    lineHeight: 20,
    marginTop: appStyleConstants.SIZE_8,
  },
  hoursText: {
    ...appStyleConstants.STYLE_HEADER_3,
    color: appStyleConstants.COLOR_PRIMARY_LIGHT,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
  sessionTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: appStyleConstants.COLOR_PRIMARY,
    textAlign: 'center',
    marginBottom: appStyleConstants.SIZE_8,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: appStyleConstants.SIZE_12,
  },
  footerButton: {
    flex: 1,
  },
  wrapperDemo: {
    padding: appStyleConstants.SIZE_16,
    backgroundColor: appStyleConstants.COLOR_DARKER,
    borderRadius: appStyleConstants.SIZE_8,
  },
  wrapperText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_4,
  },
  drawerContent: {
    flex: 1,
    padding: appStyleConstants.SIZE_24,
    backgroundColor: appStyleConstants.COLOR_SURFACE,
  },
  drawerTitle: {
    ...appStyleConstants.STYLE_HEADER_2,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_12,
  },
  drawerDescription: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginBottom: appStyleConstants.SIZE_24,
    lineHeight: 20,
  },
  drawerMenu: {
    flex: 1,
    marginBottom: appStyleConstants.SIZE_24,
  },
  drawerMenuItem: {
    paddingVertical: appStyleConstants.SIZE_12,
    paddingHorizontal: appStyleConstants.SIZE_16,
    borderBottomWidth: 1,
    borderBottomColor: appStyleConstants.COLOR_BORDER,
  },
  drawerMenuText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    fontSize: appStyleConstants.FONT_SIZE_16,
  },
  closeButton: {
    marginTop: 'auto',
  },
});

export default NewScreen;