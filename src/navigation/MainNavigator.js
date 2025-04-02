/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/HomeScreen';
import TrasrideScreen from '../screen/feature/trasride/MainScreen';
import TrasfoodScreen from '../screen/feature/trasfood/MainScreen';
import TrasrentScreen from '../screen/feature/trasrent/MainScreen';
import TrasmoveScreen from '../screen/feature/trasmove/MainScreen';
import AktifitasScreen from '../screen/home/AktifitasScreen';
import AkunScreen from '../screen/home/AkunScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import ChatScreen from '../screen/feature/trasride/ChatScreen';
import CallScreen from '../screen/feature/trasride/CallScreen';
import RatingScreen from '../screen/feature/trasride/RatingScreen';
import UpdateScreen from '../screen/home/UpdateScreen';
import ModalNotifikasi from '../component/ModalNotifikasi';
import messaging from '@react-native-firebase/messaging';
import DetailOrder from '../screen/feature/trasride/DetailOrder';
import { getData } from '../api/service';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const { t } = useTranslation();
  const [modalInfo, setmodalInfo] = useState(false);
    const [titleInfo, settitleInfo] = useState(false);
    const [bodyInfo, setbodyInfo] = useState(false);

  

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setmodalInfo(true)
      settitleInfo(remoteMessage.notification.title)
      setbodyInfo(remoteMessage.notification.body)
      // Alert.alert('Pesan Baru!', JSON.stringify(remoteMessage.notification));
    });
    return unsubscribe;
  }, []);

  return (
      <><ModalNotifikasi
      isVisible={modalInfo}
      setModalVisible={setmodalInfo}
      title={titleInfo}
      desc={bodyInfo} /><Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MainNavigator} options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen
          name="TrasRide"
          component={TrasrideScreen}
          options={({ navigation }) => ({
            title: 'TrasRide',
            headerShown: false,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="TrasFood"
          component={TrasfoodScreen}
          options={({ navigation }) => ({
            title: 'TrasFood',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="TrasRent"
          component={TrasrentScreen}
          options={({ navigation }) => ({
            title: 'TrasRent',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="TrasMove"
          component={TrasmoveScreen}
          options={({ navigation }) => ({
            title: 'TrasMove',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: 'Chat',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="Call"
          component={CallScreen}
          options={({ navigation }) => ({
            title: 'Call',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="Rating"
          component={RatingScreen}
          options={({ navigation }) => ({
            title: 'Rating',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="close-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="DetailOrder"
          component={DetailOrder}
          options={({ navigation }) => ({
            title: 'Detail Order',
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={32} color="black" style={{ marginRight: 20 }} />
              </TouchableOpacity>
            ),
          })} />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateScreen}
          options={({ navigation }) => ({
            title: t('updateScreen.header'),
            headerShown: true,
            headerStyle: {
              elevation: 0, // Remove elevation on Android
              shadowOpacity: 0, // Remove shadow on iOS
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <View>
                <Ionicons name="person-outline" size={24} color="black" style={{ marginRight: 20 }} />
              </View>
            ),
          })} />
      </Stack.Navigator></>
  )
};

const MainNavigator = () => {
  const { t } = useTranslation();
  const [data, setdata] = useState(0)

  const getProfileUser = async () => {
      try {
        const response = await getData('order/GetOrder');
        const filtered = response.data.filter((a)=> a.status <= 3)
        setdata(filtered.length)
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      getProfileUser()
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        getProfileUser()
      });
      return unsubscribe;
    }, []);

  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: styles.tabBarStyle, // Custom tab bar style
      tabBarShowLabel: true, // Hide labels (optional)
      tabBarActiveTintColor: '#000000', // Active icon color
      tabBarInactiveTintColor: '#00000050', // Inactive icon color
    }}>
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          tabBarActiveTintColor: '#37AFE1',  // Active text color (when focused)
          tabBarInactiveTintColor: '#00000050',
          title: t('menuBottom.beranda'),
          tabBarLabelPosition: "beside-icon",
          headerShown: false,
          color: '#fff',
          fontFamily: 'Montserrat-Regular',
          tabBarIcon: ({ focused }) => {
            const size = focused ? '#37AFE1' : '#00000030';
            return (
              <Ionicons name="car-outline" size={24} color={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Aktifitas"
        component={AktifitasScreen}
        options={{
          tabBarActiveTintColor: '#37AFE1',  // Active text color (when focused)
          tabBarInactiveTintColor: '#00000050',
          title: t('menuBottom.action'),
          tabBarLabelPosition: "beside-icon",
          headerShown: false,
          color: '#fff',
          fontFamily: 'Montserrat-Regular',
          tabBarIcon: ({ focused }) => {
            const size = focused ? '#37AFE1' : '#00000030';
            return (
              <Ionicons name="flash-outline" size={24} color={size} />
            );
          },
          tabBarBadge: data > 0 ? data : undefined, // Hide jika 0
          tabBarBadgeStyle: { backgroundColor: 'red', color: 'white' },
        }}
      />
      <Tab.Screen
        name="Akun"
        component={AkunScreen}
        options={{
          tabBarActiveTintColor: '#37AFE1',  // Active text color (when focused)
          tabBarInactiveTintColor: '#00000050',
          tabBarLabelPosition: "beside-icon",
          title: t('menuBottom.akun'),
          headerShown: false,
          color: '#fff',
          fontFamily: 'Montserrat-Regular',
          tabBarIcon: ({ focused }) => {
            const size = focused ? '#37AFE1' : '#00000030';
            return (
              <Ionicons name="person-outline" size={18} color={size} />
            );
          },
        }}
      />
    </Tab.Navigator>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    height: 60,
  },
  image: {
    width: 30, // Specify width
    height: 30, // Specify height
  },
  tabBarIconStyle: {
    justifyContent: 'center',  // Center the icon vertically within the tab
    alignItems: 'center',  // Center the icon horizontally within the tab
    fontFamily: 'Montserrat-Regular'
  },
});

export default HomeStack;
