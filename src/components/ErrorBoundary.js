// src/components/ErrorBoundary.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset
        });
      }

      return (
        <View style={boundaryStyles.container}>
          <Text style={boundaryStyles.emoji}>Something went wrong</Text>
          <Text style={boundaryStyles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={boundaryStyles.button}
            onPress={this.handleReset}
          >
            <Text style={boundaryStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const boundaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: appStyleConstants.COLOR_DARK,
  },
  emoji: {
    fontSize: appStyleConstants.FONT_SIZE_20,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    color: appStyleConstants.COLOR_TEXT_LIGHT,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: appStyleConstants.FONT_SIZE_14,
    color: appStyleConstants.COLOR_TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: appStyleConstants.COLOR_PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: appStyleConstants.RADIUS_MEDIUM,
  },
  buttonText: {
    color: appStyleConstants.COLOR_WHITE,
    fontSize: appStyleConstants.FONT_SIZE_16,
    fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
  },
});

export default ErrorBoundary;
