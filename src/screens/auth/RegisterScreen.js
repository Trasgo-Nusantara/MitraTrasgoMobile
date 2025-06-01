import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput,
  StyleSheet, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback, Keyboard,
  TouchableOpacity, StatusBar,
  Alert
} from 'react-native';
import { getData, postData } from '../../api/service';
import Icon from 'react-native-vector-icons/Feather'; // Feather Icon

const RegisterScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [noNIK, setNoNIK] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAgreedFee, setIsAgreedFee] = useState(false);
  const [rekening, setrekening] = useState(0);

  const getDatabase = async () => {
    try {
      const rekening = await getData('rekening/SettingIuranTahunan');
      setrekening(rekening.data);
    } catch (error) {
      Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const handleRegister = async () => {
    if (!fullname || !address || !email || !noNIK) {
      Alert.alert('Error', 'Semua field wajib diisi.');
      return;
    }

    if (!isAgreed || !isAgreedFee) {
      Alert.alert('Error', 'Kamu harus menyetujui semua persyaratan terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        fullname,
        email,
        noNIK,
        address,
      };
      await postData('auth/updateProfile', userData);
      Alert.alert('Sukses', 'Pendaftaran berhasil.');
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }], // atau 'Login', dsb.
      });
    } catch (err) {
      Alert.alert('Error', err || "Transaksi Tahunan Selesai");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar backgroundColor="#214937" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.bottomContainer}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama lengkap"
              value={fullname}
              onChangeText={setFullname}
              editable={!loading}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />

            <Text style={styles.label}>No NIK</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan No NIK"
              keyboardType="phone-pad"
              value={noNIK}
              onChangeText={setNoNIK}
              editable={!loading}
            />

            <Text style={styles.label}>Alamat</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Alamat"
              keyboardType="default"
              value={address}
              onChangeText={setAddress}
              editable={!loading}
            />

            {/* Ceklis 1 */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsAgreed(!isAgreed)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkboxBox, isAgreed && styles.checkboxChecked]}>
                {isAgreed && <Icon name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya setuju dengan <Text style={{ fontWeight: 'bold' }}>Syarat & Ketentuan</Text>
              </Text>
            </TouchableOpacity>

            {/* Ceklis 2 */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsAgreedFee(!isAgreedFee)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkboxBox, isAgreedFee && styles.checkboxChecked]}>
                {isAgreedFee && <Icon name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya setuju membayar uang koperasi sebesar <Text style={{ fontWeight: 'bold' }}>Rp {rekening.toLocaleString('id')}</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              Dengan mendaftar kamu sekalian membayar uang tahunan koperasi.
            </Text>

            <TouchableOpacity
              style={[styles.button, (loading || !isAgreed || !isAgreedFee) && styles.buttonDisabled]}
              onPress={() => handleRegister()}
              disabled={loading || !isAgreed || !isAgreedFee}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Mendaftarkan...' : 'Daftar'}
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
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 1
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#214937',
    borderColor: '#214937',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1
  },
  note: {
    fontSize: 12,
    color: '#444',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#F3C623',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
