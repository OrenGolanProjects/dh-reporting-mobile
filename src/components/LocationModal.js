
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { appStyleConstants } from '@orenuki/dh-reporting-shared';

const LOCATIONS = [
    { id: 'HOME', name: 'Home', icon: '🏠' },
    { id: 'OFFICE', name: 'Office', icon: '🏢' },
    { id: 'CLIENT', name: 'Client', icon: '👥' }
];

export const LocationModal = ({ visible, project, onSelectLocation, onClose }) => {
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.locationMenu}>
                    <Text style={styles.locationTitle}>Choose Location</Text>
                    <Text style={styles.locationProject}>{project?.name || ''}</Text>
                    <View style={styles.locationRow}>
                        {LOCATIONS.map((loc, index) => (
                            <TouchableOpacity
                                key={loc.id || `location-${index}`}
                                style={styles.locationChip}
                                onPress={() => onSelectLocation(loc.name)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.locationChipText}>{loc.icon} {loc.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.closeX} onPress={onClose}>
                        <Text style={styles.closeXText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    locationMenu: {
        backgroundColor: appStyleConstants.COLOR_SURFACE,
        borderTopLeftRadius: appStyleConstants.SIZE_24,
        borderTopRightRadius: appStyleConstants.SIZE_24,
        padding: appStyleConstants.SIZE_24,
        ...appStyleConstants.SHADOW_BOX_2,
    },
    locationTitle: {
        fontSize: appStyleConstants.FONT_SIZE_14,
        color: appStyleConstants.COLOR_TEXT_MUTED
    },
    locationProject: {
        fontSize: appStyleConstants.FONT_SIZE_20,
        color: appStyleConstants.COLOR_TEXT_LIGHT,
        fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD,
        marginTop: appStyleConstants.SIZE_4,
        marginBottom: appStyleConstants.SIZE_16,
        textAlign: 'center',
    },
    locationRow: {
        flexDirection: 'row',
        gap: appStyleConstants.SIZE_8,
        justifyContent: 'space-between',
        marginBottom: appStyleConstants.SIZE_32,
    },
    locationChip: {
        flex: 1,
        paddingVertical: appStyleConstants.SIZE_12,
        paddingHorizontal: appStyleConstants.SIZE_12,
        borderRadius: appStyleConstants.SIZE_12,
        backgroundColor: appStyleConstants.COLOR_PRIMARY,
        alignItems: 'center',
        ...appStyleConstants.SHADOW_BOX_1,
    },
    locationChipText: {
        color: appStyleConstants.COLOR_WHITE,
        fontWeight: appStyleConstants.FONT_WEIGHT_SEMIBOLD
    },
    closeX: {
        position: 'absolute',
        right: appStyleConstants.SIZE_16,
        top: appStyleConstants.SIZE_16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: appStyleConstants.COLOR_DARK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeXText: {
        color: appStyleConstants.COLOR_TEXT_LIGHT,
        fontSize: appStyleConstants.FONT_SIZE_18
    },
});

export default LocationModal;
