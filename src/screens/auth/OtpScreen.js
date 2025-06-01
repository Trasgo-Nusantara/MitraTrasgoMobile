import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData } from '../../api/service';

const OtpVerificationScreen = ({ route }) => {
  const { phonenumber } = route.params
  const [loading, setLoading] = useState(false);

  const intervalRef = useRef(null);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [modalWarning, setmodalWarning] = useState(false)
  const [warning, setwarning] = useState('')

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

  const verifyOtp = async () => {
    if (!form.otp.trim()) {
      Alert.alert("Error", "OTP tidak boleh kosong.");
      return;
    }

    setLoading(true);
    const formData = {
      phonenumber: phonenumber,
      code: form.otp
    };
    try {
      const response = await postData('otp/validateWA', formData);
      await AsyncStorage.setItem('accessTokens', response.message.accessToken);
      setLoading(false)
    } catch (error) {
      Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi OTP.");
      setLoading(false)
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#214937" barStyle="dark-content" />
      <Text style={styles.label}>Masukkan OTP yang kami kirim melalui whatsapp kamu</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan OTP"
        keyboardType="numeric"
        value={form.otp}
        onChangeText={(value) => handleInputChange('otp', value)}
        editable={!loading}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginBottom: 30 }}>
          <Text style={[{ fontWeight: 'bold' }]}>{timer === 0 ? "" : formatTime(timer)}</Text>
          <TouchableOpacity
            onPress={handleResendPress}
            disabled={timer > 0}
            style={{ opacity: timer > 0 ? 0.5 : 1 }}
          >
            <Text style={[{ fontWeight: 'bold' }]}>Kirim Ulang</Text>
          </TouchableOpacity>
        </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonLoading]}
        onPress={verifyOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    width: '100%',
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

export default OtpVerificationScreen;
