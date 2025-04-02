import { Motion } from "@legendapp/motion"
import { COMPONENT_STYLES } from "../../../../lib/constants"
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal, PanResponder } from 'react-native';
import DropdownSearchComponent from "../../../../component/DropdownSearchComponent";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RadioButtonChoiceGroup from '../../../../component/RadioButtonChoiceComponent';
import { ButtonComponent } from "../../../../component/ButtonComponent";


const ModalRideComponent = ({
    modalRideShow,
    setmodalRideShow,

    options,
    selectedValue,
    setSelectedValue
 }) => {

    const { t } = useTranslation();

    useEffect(() => {
        console.log(options)
        if (modalRideShow) {
            const timer = setTimeout(() => {
                setmodalRideShow(true);
            }, 100); // 0.5 seconds delay
            return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
        } else {
            setmodalRideShow(false); // Reset animation when modal is closed
        }
    }, [modalRideShow]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => false, // Do not respond to touch events initially
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            // Only respond to vertical movements that exceed a certain threshold
            const { dy } = gestureState;
            return Math.abs(dy) > 10;
        },
        onPanResponderMove: (evt, gestureState) => {
            // Gesture state contains the movement of the touch (in px)
            const { dy } = gestureState;  // dy is the vertical movement of the touch
            if (dy > 50) {
                setmodalRideShow(false);
            } else if (dy < -50) {
                setmodalRideShow(true);
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            const { dy } = gestureState;
            if (dy > 50) {
                setmodalRideShow(false);
            } else if (dy < -50) {
                setmodalRideShow(true);
            }
        },
    });

    const handleSelect = (option) => {
        setSelectedValue(option);
        setmodalRideShow(false)
      };

    return (
        <Motion.View
            {...panResponder.panHandlers}
            initial={{ y: 0 }}
            animate={{ x: 0, y: modalRideShow ? -1.3 * 100 : 2 * 100 }} // Use the animateModal state for triggering animation
            whileHover={{ scale: 1.2 }}
            whileTap={{ y: 20 }}
            transition={{ type: 'spring' }}
            style={styles.modalAnimate}
        >
            <View style={styles.modalComponent} >
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <View style={{ width: 50, height: 3, backgroundColor: '#00000050' }} />
                </View>
                <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600', textAlign: 'center' }]}>{t('modalChoice.PilihKendaraan')}</Text>
                <View style={COMPONENT_STYLES.spacer} />
                <RadioButtonChoiceGroup
                    options={options}
                    selectedValue={selectedValue}
                    onSelect={handleSelect}
                />
            </View>
        </Motion.View>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    modalAnimate: {
        position: 'absolute',
        bottom: 0, // Position it at the bottom
        left: 0,
        right: 0,
    },
    modalComponent: {
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20
    },
});

export {
    ModalRideComponent
}