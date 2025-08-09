import React from 'react';
import { SafeAreaView, View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const ScreenWrapper = ({
    headerTitle,
    headerSubtitle,
    children,                 // The actual screen body you render inside the wrapper.
    scroll = false,           // Wrap content in a ScrollView (good for long lists/forms).
    keyboard = false,         // Wrap in KeyboardAvoidingView so inputs aren’t covered by the keyboard.
    center = false,           // Vertically center the main content area (great for short/auth screens or empty states).
    card = false,             // Place children inside a styled “surface” card (rounded, padded, elevated) on the dark background.
    footer = null,            // Optional element rendered BELOW children (e.g., primary button, helper text).
    contentStyle,
    contentContainerStyle,
}) => {
    const Content = scroll ? ScrollView : View;

    const bodyContent = (
        <Content
            style={[styles.content, contentStyle]}
            {...(scroll
                ? {
                    contentContainerStyle: [
                        styles.contentContainer,
                        center && styles.centerContent,
                        contentContainerStyle,
                    ],
                    keyboardShouldPersistTaps: 'handled',
                    showsVerticalScrollIndicator: false,
                }
                : {})}
        >
            {card ? <View style={styles.card}>{children}</View> : children}
        </Content>
    );

    const body = keyboard ? (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {bodyContent}
        </KeyboardAvoidingView>
    ) : (
        bodyContent
    );

    return (
        <SafeAreaView style={styles.safe}>
            {(headerTitle || headerSubtitle) && (
                <View style={styles.header}>
                    {headerTitle ? (
                        <Text style={styles.headerTitle}>{headerTitle}</Text>
                    ) : null}
                    {headerSubtitle ? (
                        <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
                    ) : null}
                </View>
            )}

            {/* Main body scrolls */}
            <View style={styles.body}>{body}</View>

            {/* Footer is fixed */}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    safe: {
        flex: 1,
        backgroundColor: appStyleConstants.COLOR_DARK,
    },
    header: {
        backgroundColor: appStyleConstants.COLOR_SURFACE,
        alignItems: 'center',
        paddingBottom: appStyleConstants.SIZE_24,
        paddingTop: appStyleConstants.SIZE_12,
    },
    headerTitle: {
        ...appStyleConstants.STYLE_TITLE,
        marginBottom: appStyleConstants.SIZE_8,
        marginTop: appStyleConstants.SIZE_16,
        textAlign: 'center',
    },
    headerSubtitle: {
        ...appStyleConstants.STYLE_HEADER_2,
        color: appStyleConstants.COLOR_TEXT_MUTED,
        textAlign: 'center',
    },
    body: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: appStyleConstants.SIZE_24,
        backgroundColor: appStyleConstants.COLOR_DARK,
    },
    contentContainer: {
        paddingVertical: appStyleConstants.SIZE_24,
    },
    centerContent: {
        justifyContent: 'center',
        minHeight: '100%',
    },
    card: {
        backgroundColor: appStyleConstants.COLOR_SURFACE,
        borderRadius: appStyleConstants.SIZE_16,
        padding: appStyleConstants.SIZE_40,
        marginTop: appStyleConstants.SIZE_12,
        marginBottom: appStyleConstants.SIZE_12,
        ...appStyleConstants.SHADOW_BOX_1,
    },
    footer: {
        backgroundColor: appStyleConstants.COLOR_DARK,
        padding: appStyleConstants.SIZE_16,
        borderTopWidth: 1,
        borderTopColor: appStyleConstants.COLOR_BORDER,
    },
});

export default ScreenWrapper;
