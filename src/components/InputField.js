import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const InputField = ({ value, onChangeText, placeholder, ...rest }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor={appStyleConstants.COLOR_TEXT_MUTED}
    value={value}
    onChangeText={onChangeText}
    {...rest}
  />
);

const styles = StyleSheet.create({
  input: appStyleConstants.STYLE_INPUT,
});

export default InputField;