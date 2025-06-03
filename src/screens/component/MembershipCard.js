import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, postData } from '../../api/service';

const MembershipCard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tujuan, setTujuan] = useState('');
  const [nominal, setNominal] = useState('');

  const getDatabase = async () => {
    setLoading(true);
    try {
      const response = await getData('auth/verifySessions');
      setdata(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Terjadi kesalahan saat memverifikasi OTP.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const formatCurrency = (numberString) => {
        if (!numberString) return 0;
        return parseInt(numberString).toLocaleString('id-ID');
    };

    const handleNominalChange = (text) => {
        // Hapus semua karakter non angka
        const raw = text.replace(/\D/g, '');
        setNominal(raw);
    };

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('08')) return '+62' + cleaned.slice(1);
    if (cleaned.startsWith('62')) return '+62' + cleaned.slice(2);
    if (cleaned.startsWith('8')) return '+62' + cleaned;
    if (cleaned.startsWith('628')) return '+' + cleaned;
    if (cleaned.startsWith('+628')) return cleaned;
    return '+62' + cleaned;
  };

  const handleTransfer = async () => {
    try {
      const formData ={
        phone: formatPhoneNumber(tujuan),
        balance: parseFloat(nominal)
      }
      await postData('user/Transfer', formData);
      Alert.alert("Berhasil", `Transfer ke ${tujuan} sebesar Rp ${formatCurrency(nominal)}`);
      setShowModal(false);
      setTujuan('');
      setNominal('');
    } catch (error) {
      Alert.alert("Error", error || "Terjadi kesalahan saat memverifikasi OTP.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setTujuan('');
    setNominal('');
  };

  return (
    <View style={styles.membershipContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={getDatabase} style={styles.membershipBox}>
          <Text style={styles.membershipLabel}>Saldo</Text>
          <Text style={styles.membershipValue}>Rp {formatCurrency(data.balance)}</Text>
          <Text style={styles.membershipLabel2}>Klik untuk update saldo</Text>
        </TouchableOpacity>

        <View style={styles.membershipBox2}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => setShowModal(true)}>
            <Icon name="swap-horizontal" size={24} color="#000" />
            <Text style={styles.membershipValue2}>Transfer</Text>
          </TouchableOpacity>
          <View style={{ margin: 5 }}></View>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Saldo')}>
            <Icon name="plus-circle-outline" size={24} color="#000" />
            <Text style={styles.membershipValue2}>TopUp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Transfer */}
      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Transfer Dana</Text>
            <TextInput
              placeholder="Nomor Ponsel Tujuan"
              value={tujuan}
              onChangeText={setTujuan}
              style={styles.input}keyboardType="numeric"
            />
            <TextInput
              placeholder="Nominal"
              value={formatCurrency(nominal)}
                            onChangeText={handleNominalChange}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
                <Text style={styles.buttonText}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  membershipContainer: {
    flexDirection: 'column',
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    paddingHorizontal: 10,
  },
  membershipBox: {
    flex: 1,
  },
  membershipBox2: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flex: 1,
  },
  membershipLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  membershipLabel2: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  membershipValue: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },
  membershipValue2: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  transferButton: {
    backgroundColor: '#214937',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MembershipCard;
