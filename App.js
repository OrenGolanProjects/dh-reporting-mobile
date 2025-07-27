import { appStyleConstants } from '@orenuki/dh-reporting-shared';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DH-Reporting!</Text>
      <Text style={styles.colorText}>
        Primary Color: {appStyleConstants.COLOR_LIGHT_PURPLE}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyleConstants.COLOR_BORDER_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    padding: appStyleConstants.SIZE_16,
  },
  title: {
    ...appStyleConstants.STYLE_TITLE,
    marginBottom: appStyleConstants.SIZE_16,
  },
  colorText: {
    ...appStyleConstants.STYLE_BODY,
    color: appStyleConstants.COLOR_LIGHT_PURPLE
  }
});