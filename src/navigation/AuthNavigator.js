import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/auth/LoginScreen';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../lib/translations';
import VerifikasiScreen from '../screen/auth/VerifikasiScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';


const Stack = createNativeStackNavigator();

export default function App() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login', headerShown: false }}
      />
      <Stack.Screen
        name="Verifikasi"
        component={VerifikasiScreen}
        options={({ navigation }) => ({
          title: t('verifikasiScreen.header'),
          headerShown: true,
          headerStyle: {
            elevation: 0, // Remove elevation on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={32} color="black" style={{marginRight:20}}/>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
