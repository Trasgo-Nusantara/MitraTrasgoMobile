import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid, Linking } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalInfo from '../../component/ModalInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { getData } from '../../api/service';
import ModalTopUp from '../../component/ModalTopUp';



const { width } = Dimensions.get('window');

const AkunScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTopupVisible, setModalTopupVisible] = useState(false);


  const [user, setUser] = useState({
    balance: 0,
    email: "",
    fcm: "",
    fullName: "",
    id: "",
    image: "",
    phone: "",
    point: 0
  });

  const getProfileUser = async () => {
    try {
      const response = await getData('auth/verifySessions');
      setUser(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileUser();
  }, []);

  const openWhatsApp = () => {
    // const phoneNumber = '+6281310531713';
    // const message = encodeURIComponent('Hallo admin. Saya mau isi saldo Traspay untuk driver, boleh kirimkan QRIS-nya?');
    // const url = `https://wa.me/${phoneNumber}?text=${message}`;
  
    // Linking.openURL(url).catch(err => console.error('Gagal membuka WhatsApp', err));
    setModalTopupVisible(true)
  };

  const menu = [
    // {
    //   name: t('menuAkun.profile'),
    //   iconName: "person-circle-outline",
    // },
    // {
    //   name: t('menuAkun.referal'),
    //   iconName: "people-circle-outline"
    // },
    // {
    //   name: t('menuAkun.alamat'),
    //   iconName: "map-outline"
    // },
    {
      name: t('menuAkun.term'),
      iconName: "newspaper-outline"
    },
    {
      name: t('menuAkun.supportt'),
      iconName: "mail-outline"
    },
    {
      name: t('menuAkun.keluar'),
      iconName: "log-out-outline",
      action: () => setModalVisible(true)
    }
  ]

  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{ backgroundColor: 'white', height: 50 }}>
        <Text style={[COMPONENT_STYLES.textLarge, { position: 'absolute', bottom: 0, marginLeft: 15 }]}>
          {t('menuAkun.title')}
        </Text>
      </View>
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
        <View>
          <Text style={[COMPONENT_STYLES.textMedium]}>
            {user.fullName}
          </Text>
          <Text style={[COMPONENT_STYLES.textSmall]}>
            {user.phone}
          </Text>
          <Text style={[COMPONENT_STYLES.textSmall]}>
            {user.email}
          </Text>
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <TouchableOpacity onPress={()=> openWhatsApp()} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: COLORS.primary, padding: 10, height: 100, borderRadius: 10 }}>
          <View style={{ padding: 10 }}>
            <View style={{ padding: 10, paddingHorizontal: 15, backgroundColor: 'white', flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Ionicons name="wallet-outline" size={32} color="black" />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>
              TopUp Deposit
            </Text>
            <Text style={[COMPONENT_STYLES.textMedium, { color: 'white' }]}>
              Rp {user.balance.toLocaleString('id')}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={COMPONENT_STYLES.spacer} />
        {menu.map((data, index) => {
          return (
            <TouchableOpacity onPress={data.action} key={index} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 10, borderRadius: 10 }}>
              <View>
                <View style={{ padding: 10, backgroundColor: 'white', flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <Ionicons name={data.iconName} size={24} color="black" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[COMPONENT_STYLES.textMedium, { color: 'black' }]}>
                  {data.name}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <ModalTopUp title={t('modalKeluarApp.title')} desc={t('modalKeluarApp.desc')} isVisible={modalTopupVisible} setModalVisible={setModalTopupVisible}/>
      <ModalInfo title={t('modalKeluarApp.title')} desc={t('modalKeluarApp.desc')} isVisible={modalVisible} setModalVisible={setModalVisible} actions={async () => await AsyncStorage.removeItem('accessTokens')} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageBack: { width: width, height: 350, position: 'absolute' },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  menuItem: {
    flex: 1,
    maxWidth: '45%', // Adjust this value to control the maximum width of each item
    height: 90,
    borderRadius: BORDER_RADIUS.medium,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shape: {
    width: 80,
    height: 60,
    position: 'absolute',
    backgroundColor: '#fff',
    elevation: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    top: 28
  },
  balanceBar: {
    backgroundColor: '#fff',
    marginTop: 140,
    borderRadius: BORDER_RADIUS.medium,
    height: 70,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20
  }
});

export default AkunScreen;
