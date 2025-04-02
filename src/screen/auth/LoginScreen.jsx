import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, Alert } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { ButtonComponent } from '../../component/ButtonComponent';
import TextInputComponent from '../../component/TextInputComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';
import DropdownLanguangeComponent from '../../component/DropdownLanguangeComponent';
import { getData } from '../../lib/transFunctions';
import ModalDown from '../../component/ModalDown';
import { postData } from '../../api/service';


const { width } = Dimensions.get('window');

const flagItems = [
  { label: 'Indonesian', value: '+62', flag: "🇮🇩" },
  { label: 'Singapore', value: '+65', flag: "🇸🇬" },
  { label: 'Malaysia', value: '+60', flag: "🇲🇾" },
];

const languageItems = [
  { label: 'Bahasa Indonesia', value: 'id' },
  // { label: 'English', value: 'en' },
  // { label: '普通话', value: 'cn' },
];

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [flag, setflag] = useState('🇮🇩 +62');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setloading] = useState(false);


  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getData();
      setSelectedLanguage(response)
    }
    fetchData()
  }, [selectedLanguage]);

  // handle login press (to be implemented)
  const handleLoginPress = async () => {
    if (!phone) {
      setError(t('loginScreen.emptyPhone'));
    } else {
      setError('');
      setModalVisible(true)
    }
  };

  const sendViaWA = async () => {
    setloading(true)
    const cleanedPhone = phone.replace(/^0/, '');
    if (cleanedPhone.startsWith(flag.replace(/[^\d+]/g, ''))) {
      return Alert.alert('Peringatan', 'Nomor tidak boleh diawali dengan ' + flag.replace(/[^\d+]/g, ''));
    }
    const string = flag + cleanedPhone;
    const phoneNumber = string.replace(/[^\d+]/g, '');

    const formData = {
      phonenumber: phoneNumber
    };

    try {
      await postData('otp/sendWA', formData);
      navigation.navigate("Verifikasi", {
        phonenumber: phoneNumber
      })
      setloading(false)
    } catch (error) {
      console.error(error);
      setloading(false)
    }
  }



  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }} />
          <DropdownLanguangeComponent
            // label={t('loginScreen.placeholderEmail')}
            items={languageItems}
            value={languageItems.find((e) => e.value === selectedLanguage).label}
            iconName={"caret-down-outline"}
            onValueChange={setSelectedLanguage}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Image source={require('../../assets/logo2.png')} style={{ width: 200, height: 200 }} />
          <Image source={require('../../assets/opening.png')} style={{ width: width - 150, height: 240 }} />
        </View>
        <View style={{ flex: 1 }} />
        <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{t('loginScreen.welcome')}</Text>
        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{t('loginScreen.welcomeSub')}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '600' }]}>{t('loginScreen.phoneLabel')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <DropdownFlagComponent
            // label={t('loginScreen.placeholderEmail')}
            items={flagItems}
            value={flag}
            onValueChange={setflag}
          />
          <View style={{ flex: 1 }} >
            <TextInputComponent
              // label={t('loginScreen.phoneLabel')}
              placeholder={t('loginScreen.placeholderPhone')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              errorMessage={error}
            />
          </View>
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <ButtonComponent
          title={t('loginScreen.loginButton')}
          onPress={handleLoginPress}
          isLoading={loading}
        />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
      </ScrollView>
      <ModalDown isVisible={modalVisible} setModalVisible={setModalVisible} navigasi={() => sendViaWA()} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#9911ff",
    borderRadius: 5,
  }
});

export default LoginScreen;
