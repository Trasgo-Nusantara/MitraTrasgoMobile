import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal, Image } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion"
import { ButtonComponent, ButtonSecondaryComponent } from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import RadioButtonGroup from './RadioButtonComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const options = [
  { label: 'WhatsApp', value: 'wa', ico: "logo-whatsapp" },
  { label: 'SMS', value: 'sms', ico: "chatbox-ellipses-outline" }
];

const driver =
{
  driverName: 'Arsalim',
  type: 'Toyota Avanza',
  plat: 'B 1234 ABC',
  phone: '081234567890',
  rating: 4.5,
  image: 'https://www.w3schools.com/w3images/avatar2.png',
  biaya: 100000,
  payment: 'Cash',
  invoice: 'INV/2021/01/01/001',
  date: '01 Januari 2021',
  status: 'Menuju lokasi 5 Menit'
}

const ModalDriver = ({ title, desc, isVisible, setModalVisible, actions, call, chat, selesai, data, status }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);

  // Trigger the animation 0.5 seconds after the modal becomes visible
  useEffect(() => {
    console.log(data)
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
          <View style={COMPONENT_STYLES.spacer} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column' }}>
              <Image source={{ uri: data.driver.image }} style={{ width: 40, height: 40, borderRadius: 100 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Ionicons name={"star"} size={16} color={COLORS.text} />
                <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{data.locationDriver.rating}</Text>
              </View>
            </View>
            <View style={COMPONENT_STYLES.spacer} />
            <View style={COMPONENT_STYLES.spacer} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{data.driver.fullName}</Text>
              <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{data.locationDriver.plat}</Text>
              <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{data.locationDriver.namaKendaraan}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
              <TouchableOpacity onPress={chat} style={{ padding: 20, borderRadius: 100, backgroundColor: 'white', elevation: 1 }}>
                <Ionicons name={"chatbubble"} size={24} color={COLORS.text} />
              </TouchableOpacity>
              {/* <View style={COMPONENT_STYLES.spacer} />
              <TouchableOpacity onPress={call} style={{ padding: 20, borderRadius: 100, backgroundColor: 'white', elevation: 1 }}>
                <Ionicons name={"call"} size={24} color={COLORS.text} />
              </TouchableOpacity> */}
            </View>
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Status</Text>
            {status === 1 &&
              <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Menuju Lokasi Penjemputan</Text>
            }
            {status === 2 &&
              <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Sedang mengantar kamu</Text>
            }
            {status === 3 &&
              <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Pengantaran Berhasil</Text>
            }
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Biaya</Text>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Rp {data.data.hargaLayanan.toLocaleString('id')}</Text>
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Metoda Pembayaran</Text>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{data.data.payment}</Text>
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Invoice</Text>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{data.data.id}</Text>
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <View style={COMPONENT_STYLES.spacer} />
          <View style={COMPONENT_STYLES.spacer} />
          {status === 1 &&
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ flex: 1 }}>
                <ButtonSecondaryComponent
                  title={t('button.batal')}
                  onPress={() => actions()}
                />
              </View>
            </View>
          }
        </View>
      </Motion.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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

export default ModalDriver;
