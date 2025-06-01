import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData } from '../../api/service';

const MembershipCard = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState(false);

  const getDatabase = async () => {
    setLoading(true);
    try {
      const response = await getData('auth/verifySessions');
      setdata(response.data);
      setLoading(false)
    } catch (error) {
      Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi OTP.");
      setLoading(false)
    }
  };

  useEffect(() => {
    getDatabase()
  }, []);

  const formatCurrency = (numberString) => {
    if (!numberString) return 0;
    return parseInt(numberString).toLocaleString('id-ID');
  };

  return (
    <View style={styles.membershipContainer}>
      {/* Bagian Saldo */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.membershipBox}>
          <Text style={styles.membershipLabel}>Saldo</Text>
          <Text style={styles.membershipValue}>Rp {formatCurrency(data.balance)}</Text>
        </View>
        <View style={styles.membershipBox2}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => navigation.navigate('Saldo')}>
            <Icon name="plus-circle-outline" size={24} color="#000" />
            <Text style={styles.membershipValue2}>TopUp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Garis Pemisah */}
      {/* <View
        style={{
          borderBottomColor: '#BFD8B8',
          borderBottomWidth: 1,
          marginVertical: 10,
        }}
      /> */}

      {/* Tombol Aksi dengan Ikon
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="file-document-outline" size={24} color="#F3C623" />
          <Text style={styles.buttonLabel}>Iuran</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bank-transfer-out" size={24} color="#F3C623" />
          <Text style={styles.buttonLabel}>Tarik Tunai</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="swap-horizontal" size={24} color="#F3C623" />
          <Text style={styles.buttonLabel}>Transfer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="plus-circle-outline" size={24} color="#F3C623" />
          <Text style={styles.buttonLabel}>Topup</Text>
        </TouchableOpacity>
      </View> */}
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
    // alignItems: 'center',
    flex: 1,
  },
  membershipBox2: {
    alignItems: 'flex-end', // yang benar
    justifyContent: 'center',
    flex: 1,
  },
  membershipLabel: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  membershipLabel2: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  buttonLabel: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default MembershipCard;
