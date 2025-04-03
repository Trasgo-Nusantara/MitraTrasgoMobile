import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../lib/translations';
import { ButtonComponent } from '../../component/ButtonComponent';
import TextInputStandardComponent from '../../component/TextInputStandardComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../../lib/transFunctions';
import { postData } from '../../api/service';
import ModalWarning from '../../component/ModalWaring';

const { width } = Dimensions.get('window');

const VerifikasiScreen = ({ route, navigation }) => {
  const { phonenumber } = route.params
  const intervalRef = useRef(null);
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // 20 minutes in seconds
  const [modalWarning, setmodalWarning] = useState(false)
  const [warning, setwarning] = useState('')
  const [loading, setloading] = useState(false)



  const [form, setForm] = useState({
    otp: '',
  })

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      AsyncStorage.setItem('verificationTimer', timer.toString());
    };
  }, [timer]);

  // handle login press (to be implemented)
  const handlePress = async () => {
    setloading(true)
    const formData = {
      phonenumber: phonenumber,
      code: form.otp
    };
    try {
      const response = await postData('otp/validateWA', formData);
      console.log(response.message.idRole)
      if(response.message.idRole === "2")
      {
        await AsyncStorage.setItem('accessTokens', response.message.accessToken);
        setloading(false)
      } else {
        Alert.alert(
          "Opss",
          "Nomor ini belum terhubung ke fasilitas driver Trasgo",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        setloading(false)
      }
    } catch (error) {
      setmodalWarning(true)
      setwarning(error.response.data.message)
      setloading(false)
    }
  };

  const handleResendPress = async () => {
    const formData = {
      phonenumber: phonenumber
    };
    try {
      await postData('otp/sendWA', formData);
      setTimer(60);
      await AsyncStorage.setItem('verificationTimer', '60');
    } catch (error) {
      setmodalWarning(true)
      setwarning(error.message)
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>

        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={COMPONENT_STYLES.textLarge}>{t('verifikasiScreen.title')}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <TextInputStandardComponent
          label={t('verifikasiScreen.kodeverifikasi')}
          placeholder={t('verifikasiScreen.placeholderkode')}
          value={form.otp}
          onChangeText={(value) => handleInputChange('otp', value)}
          keyboardType="numeric"
          errorMessage={error}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 'bold' }]}>{timer === 0 ? "" : formatTime(timer)}</Text>
          <TouchableOpacity
            onPress={handleResendPress}
            disabled={timer > 0}
            style={{ opacity: timer > 0 ? 0.5 : 1 }}
          >
            <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 'bold' }]}>{t('verifikasiScreen.kirimulang')}</Text>
          </TouchableOpacity>
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <ButtonComponent
          title={t('verifikasiScreen.verifikasiButton')}
          onPress={handlePress}
          isLoading={loading}
        />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
      </ScrollView>
      <ModalWarning
        isVisible={modalWarning}
        setmodalWarning={setmodalWarning}
        title={warning}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add additional custom styles here if needed
});

export default VerifikasiScreen;
