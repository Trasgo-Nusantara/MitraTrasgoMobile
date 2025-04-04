import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid, FlatList, Linking } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../lib/constants';
import Geolocation from '@react-native-community/geolocation';
import { useTranslation } from 'react-i18next';
import { request, PERMISSIONS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import { getData, postData } from '../../api/service';
import ModalInfo from '../../component/ModalInfo';
import ModalWarning from '../../component/ModalWaring';
import ModalNotifikasi from '../../component/ModalNotifikasi';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ModalSearchView } from '../feature/trasride/component/SearchComponent';
import ModalUser from '../../component/ModaUser';
import { ToggleButtonComponent } from '../../component/ButtonComponent';


const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [fcm, setfcm] = useState("");
  const [pickupLocation, setpickupLocation] = useState(
    {
      latitude: 0,
      longitude: 0
    }
  )
  const [destinationLocation, setdestinationLocation] = useState(
    {
      latitude: 0,
      longitude: 0
    }
  )
  const [coordinate, setcoordinate] = useState([])

  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

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

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        // Request permission for Geolocation
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        // Request permission for Camera
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );

        // Request permission for Notifications (Android 13+)
        const notificationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (
          locationGranted === PermissionsAndroid.RESULTS.GRANTED &&
          cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
          notificationGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to grant permissions for location, camera, and notifications.'
          );
          return false;
        }
      } else if (Platform.OS === 'ios') {
        // iOS: Request permissions using `react-native-permissions`
        const locationPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
        const notificationPermission = await request(PERMISSIONS.IOS.NOTIFICATIONS);

        // Check if all permissions are granted
        if (
          locationPermission === 'granted' &&
          cameraPermission === 'granted' &&
          notificationPermission === 'granted'
        ) {
          return true;
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to grant permissions for location, camera, and notifications.'
          );
          return false;
        }
      }
      return false; // default for unsupported platforms
    } catch (error) {
      console.error('Permission request failed', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
      },
      (error) => {
        console.error(error);
        // Alert.alert('Location Error', 'Failed to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const getProfileUser = async () => {
    try {
      const response = await getData('auth/updateStatusDriver');
      setUser(response)
    } catch (error) {
      console.error(error);
    }
  };

  const getFCM = async () => {
    const fcmToken = await messaging().getToken();
    const form = {
      fcm: fcmToken,
    };
    setfcm(fcmToken)
    await postData('auth/updateFCMUser', form);
  }


  useEffect(() => {
    getFCM();
    getCurrentLocation();
  }, []);

  const handleUserLocationChange = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDriverLocation({ latitude: latitude, longitude: longitude });
    const formData = {
      latitude: latitude,
      longitude: longitude,
      "service": {
        "trasRideCar": true,
        "trasRideCarXL": true,
        "trasRide": true,
        "trasRideXL": true,
        "trasRideTaxi": true,
        "trasMove": true,
        "trasFood": true
      },
      "isActive": true,
      "isStandby": true,
      "onCall": true,
      "fcm": fcm,
      "lastActive": new Date().toISOString()
    }
    await postData('auth/updateLocationDriver', formData);
  };

  const [modalInfo, setmodalInfo] = useState(false);
  const [titleInfo, settitleInfo] = useState(false);
  const [bodyInfo, setbodyInfo] = useState(false);
  const [isorder, setisorder] = useState(false);
  const [idOrder, setidOrder] = useState("");
  const [orderList, setorderList] = useState("");


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.idOrder !== undefined) {
        setidOrder(remoteMessage.data.idOrder)
        setmodalInfo(true)
        setisorder(true)
        settitleInfo(remoteMessage.notification.title)
        setbodyInfo(remoteMessage.notification.body)
        getProfileUser();
      } else {
        setidOrder("")
        setisorder(false)
        setmodalInfo(true)
        settitleInfo(remoteMessage.notification.title)
        setbodyInfo(remoteMessage.notification.body)
        getProfileUser();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // 2️⃣ Notifikasi masuk saat aplikasi di background (tidak terbuka di layar)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage.data.idOrder !== undefined) {
        setidOrder(remoteMessage.data.idOrder)
        setmodalInfo(true)
        settitleInfo(remoteMessage.notification.title)
        setisorder(true)
        setbodyInfo(remoteMessage.notification.body)
        getProfileUser();
      } else {
        setidOrder("")
        setisorder(false)
        setmodalInfo(true)
        settitleInfo(remoteMessage.notification.title)
        setbodyInfo(remoteMessage.notification.body)
        getProfileUser();
      }
    }, []);

    // 3️⃣ Notifikasi diklik dari state terminated
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          if (remoteMessage.data.idOrder !== undefined) {
            setidOrder(remoteMessage.data.idOrder)
            setmodalInfo(true)
            settitleInfo(remoteMessage.notification.title)
            setisorder(true)
            setbodyInfo(remoteMessage.notification.body)
            getProfileUser();
          } else {
            setidOrder("")
            setisorder(false)
            setmodalInfo(true)
            settitleInfo(remoteMessage.notification.title)
            setbodyInfo(remoteMessage.notification.body)
            getProfileUser();
          }
        }
      });
  }, []);

  const detailOrder = async () => {
    try {
      var response = await getData('order/driverlistOrder');
      setpickupLocation(response?.data?.pickupLocation)
      setdestinationLocation(response?.data?.destinationLocation)
      setcoordinate(response?.data?.coordinates)
      setorderList(response)
    } catch (error) {
      console.error(error);
    }
  };

  const ambilOrder = async () => {
    if (idOrder == "") {
      console.log("cancel")
    } else {
      try {
        await getData('order/terimaOrder/' + idOrder);
        detailOrder()
        setmodalInfo(false)
      } catch (error) {
        console.error(error);
      }
    }
  };


  useEffect(() => {
    detailOrder();
    getProfileUser();
    const intervalId = setInterval(() => {
      detailOrder();
      getProfileUser();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const actionsButton = async (a) => {
    try {
      if (a === "a") {
        await getData('order/lanjutOrder/' + orderList.data.id);
        detailOrder()
      }
      if (a === "c") {
        await getData('order/selesaiOrder/' + orderList.data.id);
        detailOrder()
      }
      if (a === "b") {
        await getData('order/cancelOrder/' + orderList.data.id);
        detailOrder()
      }
    } catch (error) {
      console.log('order/lanjutOrder/' + orderList.data.id)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onUserLocationChange={handleUserLocationChange}
        showsUserLocation={true}
      >
        <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={[styles.markerContainer, { backgroundColor: 'white' }]}>
            <Image source={require("../../assets/logo.png")} style={styles.markerImage} />
          </View>
        </Marker>
        {orderList.data !== null &&
          <Marker coordinate={pickupLocation} pinColor='red' title='Origin' />
        }
        {orderList.data !== null &&
          <Marker coordinate={destinationLocation} pinColor='green' title='Destination' />
        }
        {orderList.data !== null &&
          <Polyline coordinates={coordinate} strokeColor="#37AFE1" strokeWidth={4} />
        }
      </MapView>
      <View style={{ alignItems: 'center', position: 'absolute', top: 0, left: 10, right: 10 }}>
        <Image source={require("../../assets/logo2.png")} style={{ width: 100, height: 100 }} />
      </View>
      <View style={styles.balanceBar2}>

        <ToggleButtonComponent balance={user} />
      </View>

      <View style={styles.balanceBar}>
        <View>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Deposit</Text>
          <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 600 }]}>{user?.data?.balance.toLocaleString('id')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Akun")} style={{ alignItems: 'center' }}>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Pengaturan</Text>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Deposit</Text>
        </TouchableOpacity>
      </View>
      <ModalNotifikasi
        isVisible={modalInfo}
        setModalVisible={setmodalInfo}
        title={titleInfo}
        payment={"Metoda Pembayaran Tunai"}
        actions={() => ambilOrder()}
        isOrder={isorder}
        desc={bodyInfo} />
      <ModalSearchView
        asal={orderList?.data?.pickupLocation?.address}
        tujuan={orderList?.data?.destinationLocation?.address}
        modalSearchBarShow={orderList.data !== null}
      />
      {orderList.data !== null &&
        <ModalUser
          title={"asd"}
          desc={"hjk"}
          isVisible={orderList.data !== null}
          actions={(a) => actionsButton(a)}
          call={() => navigation.navigate("Call", {
            idDriver: 0
          })}
          chat={() => navigation.navigate("Chat", {
            idDriver: orderList.data.idDriver,
            idOrder: orderList.data.id,
            idUser: orderList.data.idUser
          })}
          selesai={() => navigation.replace("Rating", {
            idInvoice: 'INV 123.2123'
          })}
          status={orderList?.data?.status}
          data={orderList}
          driverLocation={driverLocation} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 140,
    borderRadius: 10, // Membuat gambar bulat
    marginRight: 10, // Jarak antar gambar
    padding: 5
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
    padding: 20,
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10
  },
  balanceBar2: {
    padding: 20,
    position: 'absolute',
    bottom: 80,
    left: 100,
    right: 100
  },
  map: {
    flex: 1
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
  },
});

export default HomeScreen;
