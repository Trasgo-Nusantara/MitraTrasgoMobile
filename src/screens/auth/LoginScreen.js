import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Alert,
  StyleSheet, Image, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { postData } from '../../api/service';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned;
  };

  const sendOtp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Nomor ponsel tidak boleh kosong.");
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const formData = {
      phonenumber: formattedPhone
    };

    setLoading(true);
    try {
      await postData('otp/sendWA', formData);
      navigation.navigate("Otp", {
        phonenumber: formattedPhone
      })
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#214937" barStyle="dark-content" />
          <View style={styles.logoContainer}>
            <Image source={require('../../asset/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.label}>Masukkan Nomor Ponsel</Text>
            <TextInput
              style={styles.input}
              placeholder="Cth 081234567890"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonLoading]}
              onPress={sendOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Mengirim...' : 'Masuk'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1
  },
  button: {
    backgroundColor: '#F3C623',  // Same background as the header color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1
  },
  buttonLoading: {
    backgroundColor: '#777',  // Darken the color when loading
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
