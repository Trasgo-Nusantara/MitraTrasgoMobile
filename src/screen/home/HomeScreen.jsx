import React, { useState, useEffect } from 'react';
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


const { width } = Dimensions.get('window');

const menu = [
  {
    items: "TrasRide",
    image: require("../../assets/trasride.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasRide',
    status: true
  },
  {
    items: "TrasFood",
    image: require("../../assets/trasfood.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasFood',
    status: true
  },
  {
    items: "TrasRent",
    image: require("../../assets/trasrent.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasRent',
    status: true
  },
  {
    items: "TrasMove",
    image: require("../../assets/trasmove.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasMove',
    status: true
  },
]

const bannerNews = [
  {
    id: 0,
    items: "TrasRide",
    image: "https://abigold.co.id/wp-content/uploads/2025/03/1.png",
  },
  {
    id: 1,
    items: "TrasRide",
    image: "https://abigold.co.id/wp-content/uploads/2025/03/2.png",
  },
]

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState({
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


  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
        <Image source={require("../../assets/frame.png")} style={styles.imageBack} />
        <View style={{ alignItems: 'center' }}>
          <Image source={require("../../assets/logo3.png")} style={{ width: 100, height: 100 }} />
        </View>
        <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>{t("menuHome.selamat")}</Text>
        <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>{user.fullName}</Text>
        <View style={styles.balanceBar}>
          <View>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>TrasPoint</Text>
            <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 600 }]}>{user.point.toLocaleString('id')} PTS</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Level</Text>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Pemula</Text>
          </View>
        </View>
        <View style={styles.menuContainer}>
          {menu.map((item, index) => {
            return (
              <TouchableOpacity key={index} style={styles.menuItem}
                onPress={() => {
                  if (item.status === false) {
                    Alert.alert("Info", "Feature ini segera hadir")
                  } else if (user.fullName === "") {
                    navigation.navigate('UpdateProfile')
                  } else {
                    navigation.navigate(item.navigate, {
                      latitude: 0,
                      longitude: 0
                    }
                    )
                  }
                }}>
                <View style={styles.shape} />
                <Image source={item.image} style={{ width: 50, height: 50 }} />
                <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>{item.items}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={[COMPONENT_STYLES.textMedium]}>{t("menuHome.inform")}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <FlatList
          data={bannerNews}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.image} />
          )}
        />
      </ScrollView>
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
    padding: 20
  }
});

export default HomeScreen;
