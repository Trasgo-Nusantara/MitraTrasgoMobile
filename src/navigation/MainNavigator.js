import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AktifitasScreen from '../screens/AktifitasScreen';
import AkunScreen from '../screens/AkunScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'; // import icon
import PatunganScreen from '../screens/patungan/PatunganScreen';
import ArisanScreen from '../screens/arisan/ArisanScreen';
import ArisanDetailScreen from '../screens/arisan/ArisanDetailScreen';
import PatunganDetailScreen from '../screens/patungan/PatunganDetailScreen';
import SedekahScreen from '../screens/sedekah/SedekahScreen';
import KoperasiScreen from '../screens/koperasi/KoperasiScreen';
import SaldoScreen from '../screens/saldo/SaldoScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={MainNavigator} />
    <Stack.Screen 
      name="Patungan" 
      component={PatunganScreen} 
      options={{
      title: 'Patungan',
      headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff', // Mengatur warna latar belakang header
      },
      headerTintColor: '#000', // Mengatur warna teks header menjadi putih
    }} />
    <Stack.Screen 
      name="PatunganDetail" 
      component={PatunganDetailScreen} 
      options={{
      title: 'Detail',
      headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff', // Mengatur warna latar belakang header
      },
      headerTintColor: '#000', // Mengatur warna teks header menjadi putih
    }} />
    <Stack.Screen 
      name="Arisan" 
      component={ArisanScreen} 
      options={{
      title: 'Arisan',
      headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff', // Mengatur warna latar belakang header
      },
      headerTintColor: '#000', // Mengatur warna teks header menjadi putih
    }} />
    <Stack.Screen 
      name="ArisanDetail" 
      component={ArisanDetailScreen} 
      options={{
      title: 'Detail',
      headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff', // Mengatur warna latar belakang header
      },
      headerTintColor: '#000', // Mengatur warna teks header menjadi putih
    }} />
    <Stack.Screen 
      name="Sedekah" 
      component={SedekahScreen} 
      options={{
      title: 'Sedekah',
      headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff', // Mengatur warna latar belakang header
      },
      headerTintColor: '#000', // Mengatur warna teks header menjadi putih
    }} />
    <Stack.Screen 
      name="Koperasi" 
      component={KoperasiScreen} 
      options={{
      title: 'Koperasi',
      headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
      headerShown: true,
      headerStyle: {
        backgroundColor: '#fff', // Mengatur warna latar belakang header
      },
      headerTintColor: '#000', // Mengatur warna teks header menjadi putih
    }} />
    <Stack.Screen 
      name="Saldo" 
      component={SaldoScreen} 
      options={{
        title: 'Saldo',
        headerTitleAlign: 'center', // Mengatur posisi judul header ke tengah
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff', // Mengatur warna latar belakang header
        },
        headerTintColor: '#000', // Mengatur warna teks header menjadi putih
      }} />
     <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Daftar Koperasi',
          headerTitleAlign: 'center',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff', // Mengatur warna latar belakang header
          },
          headerTintColor: '#000', // Mengatur warna teks header menjadi putih
        }}
      />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: styles.tabBarStyle,
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#214937',
      tabBarInactiveTintColor: '#777',
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Beranda') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Aktifitas') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Akun Saya') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Beranda" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Aktifitas" component={AktifitasScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Akun Saya" component={AkunScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 60,
    paddingBottom: 5,
  },
});

export default HomeStack;
