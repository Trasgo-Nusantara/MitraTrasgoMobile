import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion"
import { ButtonComponent, ButtonSecondaryComponent, ButtonSlideComponent } from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import RadioButtonGroup from './RadioButtonComponent';
import MultiSelectedChoice from './MultiSelectedChoice';
import { postData } from '../api/service';

const { width, height } = Dimensions.get('window');

const options = [
  { idRole : "2",label: 'TrasRide', value: 'TrasRide', ico: "logo-whatsapp", desc: "Layanan antar jemput harga standard" },
  { idRole : "2",label: 'TrasRide MAX', value: 'TrasRide MAX', ico: "logo-whatsapp", desc: "Layanan antar jemput menggunakan motor besar" },
  { idRole : "2",label: 'TrasRide Cheaps', value: 'TrasRide Cheaps', ico: "logo-whatsapp" , desc: "Layanan antar jemput harga termurah" },
  { idRole : "2",label: 'TrasRide Periority', value: 'TrasRide Periority', ico: "logo-whatsapp", desc: "Harga lebih mahal pelayanan extra" },
  { idRole : "2",label: 'TrasRide Move', value: 'TrasRide Move', ico: "logo-whatsapp", desc: "Layanan antar jemput barang" },
  { idRole : "2",label: 'TrasFood', value: 'TrasFood', ico: "logo-whatsapp", desc: "Layanan antar jemput makanan" },
  { idRole : "3",label: 'TrasCar', value: 'TrasCar', ico: "logo-whatsapp", desc: "Layanan antar jemput harga standard" },
  { idRole : "3",label: 'TrasCar MAX', value: 'TrasCar MAX', ico: "logo-whatsapp", desc: "Layanan antar jemput 6 Kursi" },
  { idRole : "3",label: 'TrasCar Cheaps', value: 'TrasCar Cheaps', ico: "logo-whatsapp", desc: "Layanan antar jemput harga termurah" },
  { idRole : "3",label: 'TrasCar Periority', value: 'TrasCar Periority', ico: "logo-whatsapp", desc: "Harga lebih mahal pelayanan extra" },
  { idRole : "3",label: 'TrasCar Move', value: 'TrasCar Move', ico: "logo-whatsapp", desc: "Layanan antar jemput barang" },
  { idRole : "4",label: 'TrasCar Taxi', value: 'TrasCar Taxi', ico: "logo-whatsapp", desc: "Layanan antar jemput mengikuti harga hitungan taxi" },
  { idRole : "3",label: 'TrasFood', value: 'TrasFood', ico: "logo-whatsapp", desc: "Layanan antar jemput makanan" },

];

const ModalLayanan = ({ isVisible, setModalVisible, navigasi, idRole }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState([]);
  // Trigger the animation 0.5 seconds after the modal becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setSelectedChoices(idRole?.status?.service);
        setAnimateModal(true);
      }, 100); // 0.5 seconds delay
      return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
    } else {
      setAnimateModal(false); // Reset animation when modal is closed
    }
  }, [isVisible,idRole]);

  const cancelButton = () => {
    setAnimateModal(false);
    const timer = setTimeout(() => {
      setModalVisible(false)
    }, 200); // 0.5 seconds delay
    return () => clearTimeout(timer);
  }

  const handleSelect = (option) => {
    setSelectedValue(option.value);
  };

  const detailOrder = async () => {
    const formData = {
      service: selectedChoices
    };
      try {
        await postData('auth/updateServiceDriver',formData);
      } catch (error) {
        console.error(error);
      }
    };

  const handleNavigasi = () => {
    cancelButton()
    const timer = setTimeout(() => {
      detailOrder()
      navigasi()
    }, 200); // 0.5 seconds delay
    return () => clearTimeout(timer);
  }

  const filterIttems = options.filter((item) => item.idRole === idRole?.data?.idRole)

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
            <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{"Layanan Trasgo"}</Text>
            <View style={COMPONENT_STYLES.spacer} />
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{"Pilih layanan yang ingin kamu terima"}</Text>
            <View style={COMPONENT_STYLES.spacer} />
            <View style={COMPONENT_STYLES.spacer} />
            <MultiSelectedChoice
              options={filterIttems}
              selected={selectedChoices}
              onSelect={setSelectedChoices}
            />
            <View style={COMPONENT_STYLES.spacer} />
            <View style={COMPONENT_STYLES.spacer} />
            <View style={COMPONENT_STYLES.spacer} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ flex: 1 }}>
                <ButtonComponent
                  title={"Simpan"}
                  onPress={handleNavigasi}
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

export default ModalLayanan;
