import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
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

const UpdateScreen = ({navigation}) => {
  const { t } = useTranslation();

  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  const [modalWarning, setmodalWarning] = useState(false)
  const [warning, setwarning] = useState('')


  const [form, setForm] = useState({
    fullName: '',
    email: '',
  });
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Hanya huruf dan spasi
    return nameRegex.test(name);
  };
  
  const handlePress = async () => {
    setError1('')
    setError2('')

    if (!form.fullName.trim()) {
      setError1('Nama lengkap tidak boleh kosong.');
      return;
    }
  
    if (!validateFullName(form.fullName)) {
      setError1('Nama lengkap tidak boleh mengandung angka atau karakter khusus.');
      return;
    }
  
    if (!form.email.trim()) {
      setError2('Email tidak boleh kosong.');
      return;
    }
  
    if (!validateEmail(form.email)) {
      setError2('Format email tidak valid.');
      return;
    }
  
    try {
      const response = await postData('auth/updateProfile', form);
      navigation.replace('Home');
    } catch (error) {
      setmodalWarning(true);
      setwarning(error.response?.data?.message || 'Terjadi kesalahan.');
    }
  };
  

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>

        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={COMPONENT_STYLES.textLarge}>{t('updateScreen.title')}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <TextInputStandardComponent
          label={t('updateScreen.fullName')}
          placeholder={t('updateScreen.placeholderfullName')}
          value={form.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
          keyboardType="default"
          errorMessage={error1}
        />
        <TextInputStandardComponent
          label={t('updateScreen.email')}
          placeholder={t('updateScreen.placeholderemail')}
          value={form.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email"
          errorMessage={error2}
        />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <ButtonComponent
          title={t('button.simpan')}
          onPress={handlePress}
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

export default UpdateScreen;
