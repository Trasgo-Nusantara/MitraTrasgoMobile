import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid, FlatList } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../lib/constants';
import Geolocation from '@react-native-community/geolocation';
import { useTranslation } from 'react-i18next';
import { request, PERMISSIONS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import { getData, postData } from '../../api/service';
import ModalInfo from '../../component/ModalInfo';
import ModalWarning from '../../component/ModalWaring';
import ModalNotifikasi from '../../component/ModalNotifikasi';
import MapView, { Marker } from 'react-native-maps';


const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
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
      const response = await getData('auth/verifySessions');
      setUser(response.data)
      if (response.data.fullName === "") {
        navigation.navigate("UpdateProfile")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFCM = async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken)
    const form = {
      fcm: fcmToken,
    };
    await postData('auth/updateFCMUser', form);
  }


  useEffect(() => {
    getFCM();
    getCurrentLocation();
    getProfileUser();
  }, []);

  const handleUserLocationChange = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDriverLocation({ latitude: latitude, longitude: longitude });
  };


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
        {/* <Marker coordinate={pickupLocation} pinColor='red' title='Origin' /> */}
        {/* <Marker coordinate={destinationLocation} pinColor='green' title='Destination' /> */}
        {/* <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} /> */}
        {/* {driverLocation.latitude !== 0 && statusDriver === 0 && findDriver &&
            <Polyline coordinates={[pickupLocation, driverLocation]} strokeColor="#37AFE1" strokeWidth={4} />
          } */}
        {/* {findDriver &&
            <Marker coordinate={driverLocation} pinColor='blue' title='Driver' />
          } */}
      </MapView>
      <View style={{ alignItems: 'center', position:'absolute',top:0,left:10,right:10 }}>
        <Image source={require("../../assets/logo2.png")} style={{ width: 100, height: 100 }} />
      </View>
      <View style={styles.balanceBar}>
        <View>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Deposit</Text>
          <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 600 }]}>{user.balance.toLocaleString('id')}</Text>
        </View>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>TopUp</Text>
          <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Deposit</Text>
        </TouchableOpacity>
      </View>
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
