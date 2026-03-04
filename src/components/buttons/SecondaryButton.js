import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';


const SecondaryButton = ({ title, onPress, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: appStyleConstants.STYLE_BUTTON_SECONDARY,
    text: {
        color: appStyleConstants.COLOR_WHITE,
        fontSize: appStyleConstants.FONT_BODY,
        fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
    },
});

export default SecondaryButton;