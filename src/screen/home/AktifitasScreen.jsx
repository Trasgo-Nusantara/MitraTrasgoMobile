import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES, SHADOW_CARD } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getData } from '../../api/service';


const { width } = Dimensions.get('window');

const AktifitasScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [data, setdata] = useState([])

  const transaksi = [
    {
      image: require("../../assets/trasride.png"),
      category: "Trasride",
      booking: "12 Juni 2023, 10.00",
      price: 12000,
      payment: "Tunai",
      status: "Selesai",
      namaOrigin: "Harbor Bay",
      namaDestinasi: "Tembesi"
    }
  ]

  const getProfileUser = async () => {
    try {
      const response = await getData('order/GetOrder');
      const filtered = response.data.filter((a)=> a.status <= 3)
      const sortedData = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setdata(sortedData)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileUser();
    const intervalId = setInterval(() => {
      getProfileUser();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (data.length === 0) {
    return (
      <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={{ backgroundColor: 'white', height: 50 }}>
          <Text style={[COMPONENT_STYLES.textLarge, { position: 'absolute', bottom: 0, marginLeft: 15 }]}>
            {t('menuAktifitas.title')}
          </Text>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <Text style={[COMPONENT_STYLES.textLarge]}>Belum ada Transaksi</Text>
        </View>
      </View>
    )
  }
  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{ backgroundColor: 'white', height: 50 }}>
        <Text style={[COMPONENT_STYLES.textLarge, { position: 'absolute', bottom: 0, marginLeft: 15 }]}>
          {t('menuAktifitas.title')}
        </Text>
      </View>
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
        {data.map((data, index) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate("DetailOrder", { idInvoice: data.id })} key={index} style={styles.container}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {data.service == "TrasRide" &&
                  <Image source={require("../../assets/trasride/motor.png")} style={{ width: 50, height: 50 }} />
                }
                {data.service == "TrasRideXL" &&
                  <Image source={require("../../assets/trasride/motorxl.png")} style={{ width: 50, height: 50 }} />
                }
                {data.service == "TrasCar" &&
                  <Image source={require("../../assets/trasride/mobil.png")} style={{ width: 50, height: 50 }} />
                }
                {data.service == "TrasCar XL" &&
                  <Image source={require("../../assets/trasride/mobilxl.png")} style={{ width: 50, height: 50 }} />
                }
                {data.service == "TrasTaxi" &&
                  <Image source={require("../../assets/trasride/mobilxl.png")} style={{ width: 50, height: 50 }} />
                }
                <View style={COMPONENT_STYLES.spacer} />
                <View>
                  <Text style={COMPONENT_STYLES.textMedium}>{data.type}</Text>
                  <Text style={COMPONENT_STYLES.textSmall}>{data.service}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={{ alignItems: 'flex-end' }}>
                  {data.status === 0 &&
                    <Text style={COMPONENT_STYLES.textMedium}>Mencari Driver</Text>
                  }
                  {data.status === 1 &&
                    <Text style={COMPONENT_STYLES.textMedium}>Driver Menuju Lokasi</Text>
                  }
                  {data.status === 2 &&
                    <Text style={COMPONENT_STYLES.textMedium}>Dalam Perjalanan</Text>
                  }
                  {data.status === 3 &&
                    <Text style={COMPONENT_STYLES.textMedium}>Selesai</Text>
                  }
                  {data.status === 4 &&
                    <Text style={COMPONENT_STYLES.textMedium}>Batal</Text>
                  }
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={COMPONENT_STYLES.textSmall}>Rp {data.hargaLayanan.toLocaleString('id')}</Text>
                    <Ionicons name={"ellipse"} size={10} color={COLORS.primary} style={{ margin: 2 }} />
                    <Text style={COMPONENT_STYLES.textSmall}>{data.payment}</Text>
                  </View>
                </View>
              </View>
              <View style={COMPONENT_STYLES.spacer} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={"caret-up-circle-outline"} size={24} color={COLORS.text} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <Text style={[COMPONENT_STYLES.textSmall,{width: width - 180}]} numberOfLines={2} ellipsizeMode="tail">{data.pickupLocation.address}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={"location-outline"} size={24} color={COLORS.text} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <Text style={[COMPONENT_STYLES.textSmall,{width: width - 180}]} numberOfLines={2} ellipsizeMode="tail">{data.destinationLocation.address}</Text>
                  </View>
                </View>
                <View>
                  <View style={{ flexDirection: 'row-reverse' }}>
                    {data.idDriver != "" &&
                      <TouchableOpacity onPress={() => navigation.navigate("Chat",{
                        idDriver: data.idDriver,
                        idOrder : data.id,
                        idUser: data.idUser
                      })} style={{ padding: 10, borderRadius: 100, backgroundColor: 'white', elevation: 1 }}>
                        <Ionicons name={"chatbubble"} size={24} color={COLORS.text} />
                      </TouchableOpacity>
                    }
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: COLORS.primary,
    elevation: SHADOW_CARD.medium,
    marginTop: 20
  },
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

export default AktifitasScreen;
