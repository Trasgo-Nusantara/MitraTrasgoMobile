import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion"
import { ButtonComponent, ButtonSecondaryComponent } from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import RadioButtonGroup from './RadioButtonComponent';
import Sound from 'react-native-sound';

const { width, height } = Dimensions.get('window');

const options = [
  { label: 'WhatsApp', value: 'wa', ico: "logo-whatsapp" },
  { label: 'SMS', value: 'sms', ico: "chatbox-ellipses-outline" }
];

///ordermasuk.mp3


const ModalNotifikasi = ({ title, desc, isVisible, setModalVisible, actions }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);

  
  // Trigger the animation 0.5 seconds after the modal becomes visible
  useEffect(() => {
    let openTimer, closeTimer;
    
    if (isVisible) {
      const sound = new Sound('notifin.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Error loading sound:', error);
          return;
        }
        // Play sound
        sound.play((success) => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Sound playback failed');
          }
        });
      });

      openTimer = setTimeout(() => {
        setAnimateModal(true);
      }, 100); // Modal opens after 100ms delay
      closeTimer = setTimeout(() => {
        cancelButton()
        sound.stop((success) => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Sound playback failed');
          }
        });
      }, 3200);
    }
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [isVisible]);

  const cancelButton = () => {
    setAnimateModal(false);
    const timer = setTimeout(() => {
      setModalVisible(false)
    }, 200); // 0.5 seconds delay
    return () => clearTimeout(timer);
  }



  return (
      <Motion.View
        initial={{ y: -900 }} // Mulai dari atas (di luar layar)
        animate={{ y: animateModal ? height/1.18 * -1 : -900 }} // Turun ke posisi normal saat dibuka, naik ke atas saat ditutup
        whileHover={{ scale: 1.2 }}
        whileTap={{ y: 20 }}
        transition={{ type: 'spring' }}
        style={styles.modalAnimate}
      >
        <View style={styles.modalComponent} >
          <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{title}</Text>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{desc}</Text>
        </View>
      </Motion.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position:'absolute'
  },
  modalAnimate: {
    position: 'absolute',
    bottom: 0, // Position it at the bottom
    left: 0,
    right: 0,
    elevation: 100
  },
  modalComponent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: COLORS.primary
  }
});

export default ModalNotifikasi;
