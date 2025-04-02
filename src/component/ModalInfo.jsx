import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion"
import { ButtonComponent, ButtonSecondaryComponent } from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import RadioButtonGroup from './RadioButtonComponent';

const { width, height } = Dimensions.get('window');

const options = [
  { label: 'WhatsApp', value: 'wa', ico: "logo-whatsapp" },
  { label: 'SMS', value: 'sms', ico: "chatbox-ellipses-outline" }
];

const ModalInfo = ({ title,desc, isVisible, setModalVisible, actions }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);

  // Trigger the animation 0.5 seconds after the modal becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimateModal(true);
      }, 100); // 0.5 seconds delay
      return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
    } else {
      setAnimateModal(false); // Reset animation when modal is closed
    }
  }, [isVisible]);

  const cancelButton = () => {
    setAnimateModal(false);
    const timer = setTimeout(() => {
      setModalVisible(false)
    }, 200); // 0.5 seconds delay
    return () => clearTimeout(timer);
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Motion.View
          initial={{ y: 0 }}
          animate={{ x: 0, y: animateModal ? 0 * 100 : 4 * 100 }} // Use the animateModal state for triggering animation
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
          transition={{ type: 'spring' }}
          style={styles.modalAnimate}
        >
          <View style={styles.modalComponent} >
            <View style={{ alignItems: 'center', margin: 15 }}>
              <View style={{ width: 50, height: 3, backgroundColor: '#00000050' }} />
            </View>
            <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{title}</Text>
            <View style={COMPONENT_STYLES.spacer} />
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{desc}</Text>
            <View style={COMPONENT_STYLES.spacer} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ flex: 1 }}>
                <ButtonSecondaryComponent
                  title={t('button.batal')}
                  onPress={cancelButton}
                />
              </View>
              <View style={COMPONENT_STYLES.spacer} />
              <View style={{ flex: 1 }}>
                <ButtonComponent
                  title={t('button.keluar')}
                  onPress={actions}
                />
              </View>
            </View>
          </View>
        </Motion.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 50,
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
  }
});

export default ModalInfo;
