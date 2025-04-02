/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, View } from 'react-native';



const AppNavigator = () => {

  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [load, setload] = useState(false);

  async function onAuthStateChanged() {
    const user = await AsyncStorage.getItem('accessTokens');
    if (user !== null) {
      setload(false)
      setisLoggedIn(true);
    } else {
      setload(false)
      setisLoggedIn(false);
    }
  }

  

  useEffect(() => {
    setload(true)
    setInterval(onAuthStateChanged, 500);
  }, []);

  if (load) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Image source={require("../assets/logo2.png")} style={{ width: 200, height: 200 }} />
      </View>
    )
  }

  return (
    // <SafeAreaView>
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>

    // </SafeAreaView>
  );
};

export default AppNavigator;
