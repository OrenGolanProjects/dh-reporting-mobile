// ComponentShowcaseScreen.js
// A comprehensive showcase of all reusable components in your app
// Perfect for design system documentation and component testing

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

// Import all your existing components
import ScreenWrapper from '../components/wrappers/ScreenWrapper';
import CardWrapper from '../components/wrappers/CardWrapper';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import InputField from '../components/InputField';
import EmailField from '../components/fields/EmailField';
import StatusBadge from '../components/StatusBadge';
import SideDrawer from '../components/drawers/SideDrawer';

const ComponentShowcaseScreen = ({ navigation }) => {
  // State for interactive demos
  const [textInput, setTextInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);

  // Sample data for demos
  const sampleProject = {
    id: 1,
    name: 'Mobile App Redesign',
    client: 'Tech Startup Inc.',
    hours: 42.5,
    status: 'In Progress'
  };

  const locations = ['Home', 'Office', 'Client'];

  return (
    <ScreenWrapper
      headerTitle="Component Showcase"
      headerSubtitle="All reusable components in your design system"
      scroll={true}
      style={styles.container}
    >
      {/* Buttons Section */}
      <ComponentSection title="🔘 Action Buttons">
        <ComponentDemo
          name="Primary Action Button"
          description="Main call-to-action button for important actions"
          type="button"
        >
          <PrimaryButton
            title="Start Work Session"
            onPress={() => Alert.alert('Primary Button', 'This would start a work session')}
          />
        </ComponentDemo>

        <ComponentDemo
          name="Secondary Action Button"
          description="Secondary actions, less prominent than primary"
          type="button"
        >
          <SecondaryButton
            title="View Reports"
            onPress={() => Alert.alert('Secondary Button', 'This would show reports')}
          />
        </ComponentDemo>
      </ComponentSection>

      {/* Input Fields Section */}
      <ComponentSection title="📝 Form Input Fields">
        <ComponentDemo
          name="Text Input Field"
          description="General purpose text input with consistent styling"
          type="input"
        >
          <InputField
            placeholder="Enter project name..."
            value={textInput}
            onChangeText={setTextInput}
          />
        </ComponentDemo>

        <ComponentDemo
          name="Email Input Field"
          description="Specialized email input with validation styling"
          type="input"
        >
          <EmailField
            placeholder="Enter your email..."
            value={emailInput}
            onChangeText={setEmailInput}
          />
        </ComponentDemo>
      </ComponentSection>

      {/* Status Indicators Section */}
      <ComponentSection title="🏷️ Status Indicators">
        <ComponentDemo
          name="Status Badge - Completed"
          description="Indicates completed project status"
          type="status"
        >
          <StatusBadge status="Complete" />
        </ComponentDemo>

        <ComponentDemo
          name="Status Badge - In Progress"
          description="Shows active/ongoing project status"
          type="status"
        >
          <StatusBadge status="In Progress" />
        </ComponentDemo>

        <ComponentDemo
          name="Status Badge - Pending"
          description="Displays pending/waiting project status"
          type="status"
        >
          <StatusBadge status="Pending" />
        </ComponentDemo>

        <ComponentDemo
          name="Status Badge - Failed"
          description="Shows failed/error project status"
          type="status"
        >
          <StatusBadge status="Failed" />
        </ComponentDemo>
      </ComponentSection>

      {/* Card Components Section */}
      <ComponentSection title="🃏 Card Containers">
        <ComponentDemo
          name="Basic Content Card"
          description="Flexible card container for structured content"
          type="card"
        >
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

        <ComponentDemo
          name="Interactive Card with Footer"
          description="Card with clickable actions in footer area"
          type="card"
        >
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

        <ComponentDemo
          name="Clickable Navigation Card"
          description="Full card becomes clickable for navigation"
          type="card"
        >
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

      {/* Navigation Components Section */}
      <ComponentSection title="🧭 Navigation Components">
        <ComponentDemo
          name="Side Drawer Menu"
          description="Slide-out navigation drawer for additional options"
          type="navigation"
        >
          <PrimaryButton
            title="Open Side Drawer"
            onPress={() => setShowDrawer(true)}
          />
        </ComponentDemo>
      </ComponentSection>

      {/* Layout Wrappers Section */}
      <ComponentSection title="📐 Layout Wrappers">
        <ComponentDemo
          name="Screen Wrapper"
          description="This entire screen uses ScreenWrapper with scroll and header"
          type="layout"
        >
          <View style={styles.wrapperDemo}>
            <Text style={styles.wrapperText}>✓ Safe area handling</Text>
            <Text style={styles.wrapperText}>✓ Consistent padding</Text>
            <Text style={styles.wrapperText}>✓ Header with title/subtitle</Text>
            <Text style={styles.wrapperText}>✓ Scrollable content</Text>
            <Text style={styles.wrapperText}>✓ Keyboard avoidance (when enabled)</Text>
          </View>
        </ComponentDemo>
      </ComponentSection>

      {/* Side Drawer Implementation */}
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

// Helper component for organizing sections
const ComponentSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// Helper component for individual component demonstrations
const ComponentDemo = ({ name, description, children, type = 'default' }) => {
  // Get the appropriate style based on component type
  const getTypeStyle = () => {
    switch (type) {
      case 'button': return styles.buttonDemo;
      case 'input': return styles.inputDemo;
      case 'status': return styles.statusDemo;
      case 'card': return styles.cardDemo;
      case 'navigation': return styles.navigationDemo;
      case 'layout': return styles.layoutDemo;
      default: return {};
    }
  };

  return (
    <View style={[styles.demo, getTypeStyle()]}>
      <Text style={styles.demoName}>{name}</Text>
      <Text style={styles.demoDescription}>{description}</Text>
      <View style={styles.demoContent}>
        {children}
      </View>
    </View>
  );
};

// Helper component for drawer menu items
const DrawerMenuItem = ({ title }) => (
  <View style={styles.drawerMenuItem}>
    <Text style={styles.drawerMenuText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Section styles
  section: {
    marginBottom: appStyleConstants.SIZE_32,
  },
  sectionTitle: {
    ...appStyleConstants.STYLE_HEADER_2,
    color: appStyleConstants.COLOR_PRIMARY,
    marginBottom: appStyleConstants.SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
  
  // Demo container styles
  demo: {
    marginBottom: appStyleConstants.SIZE_24,
    padding: appStyleConstants.SIZE_16,
    backgroundColor: appStyleConstants.COLOR_SURFACE,
    borderRadius: appStyleConstants.SIZE_12,
    borderWidth: 1,
    borderColor: appStyleConstants.COLOR_BORDER,
  },
  
  // Specific demo type styles for visual differentiation
  buttonDemo: {
    borderLeftWidth: 4,
    borderLeftColor: appStyleConstants.COLOR_PRIMARY,
  },
  inputDemo: {
    borderLeftWidth: 4,
    borderLeftColor: appStyleConstants.COLOR_SECONDARY,
  },
  statusDemo: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B', // Red for status indicators
  },
  cardDemo: {
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4', // Teal for card components
  },
  navigationDemo: {
    borderLeftWidth: 4,
    borderLeftColor: '#45B7D1', // Blue for navigation
  },
  layoutDemo: {
    borderLeftWidth: 4,
    borderLeftColor: '#96CEB4', // Green for layout components
  },
  demoName: {
    ...appStyleConstants.STYLE_HEADER_3,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: appStyleConstants.SIZE_4,
  },
  demoDescription: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    marginBottom: appStyleConstants.SIZE_12,
    lineHeight: 20,
  },
  demoContent: {
    alignItems: 'flex-start',
  },
  
  // Card demo styles
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
  
  // Wrapper demo styles
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
  
  // Drawer styles
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

export default ComponentShowcaseScreen;
