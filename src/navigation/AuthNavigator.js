import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OtpVerificationScreen from '../screens/auth/OtpScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Home Page', headerShown: false }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpVerificationScreen}
        options={{
          title: 'OTP',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff', // Mengatur warna latar belakang header
          },
          headerTintColor: '#000', // Mengatur warna teks header menjadi putih
        }}
      />
     
    </Stack.Navigator>
  );
}
