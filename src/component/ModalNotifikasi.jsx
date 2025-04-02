import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion";
import { ButtonComponent, ButtonSecondaryComponent } from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import Sound from 'react-native-sound';

const { height } = Dimensions.get('window');

// Load sound hanya sekali
const sound = new Sound('ordermasuk.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Error loading sound:', error);
  }
});

const ModalNotifikasi = ({ title, desc, isVisible, setModalVisible, actions, payment }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);

  useEffect(() => {
    let openTimer, closeTimer;

    if (isVisible) {
      // Play sound saat modal muncul
      sound.play((success) => {
        if (!success) console.log('Sound playback failed');
      });

      // Animasi masuk setelah 100ms
      openTimer = setTimeout(() => {
        setAnimateModal(true);
      }, 100);

      // Tutup otomatis setelah 30 detik
      closeTimer = setTimeout(() => {
        cancelButton();
      }, 30000);
    }

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [isVisible]);

  const cancelButton = () => {
    setAnimateModal(false);
    setTimeout(() => {
      setModalVisible(false);
      sound.stop();
    }, 200); // Delay sedikit agar animasi selesai
  };

  return (
    <Motion.View
      initial={{ y: -900 }}
      animate={{ y: animateModal ? -height / 2.3 : -900 }}
      transition={{ type: 'spring', damping: 15 }}
      style={styles.modalAnimate}
    >
      <View style={styles.modalComponent}>
        <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{title}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{desc}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{payment}</Text>
        <View style={COMPONENT_STYLES.spacer} />


        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ flex: 1 }}>
            <ButtonSecondaryComponent title={t('button.batal')} onPress={cancelButton} />
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <View style={{ flex: 1 }}>
            <ButtonComponent title="Terima" onPress={actions} />
          </View>
        </View>
      </View>
    </Motion.View>
  );
};

const styles = StyleSheet.create({
  modalAnimate: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 100,
  },
  modalComponent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
});

export default ModalNotifikasi;
