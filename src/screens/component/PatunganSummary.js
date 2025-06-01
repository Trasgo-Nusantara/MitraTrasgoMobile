import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PatunganSummary = () => {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryBox}>
        <MaterialCommunityIcons name="cash-multiple" size={28} color="#4CAF50" />
        <Text style={styles.summaryValue}>Rp 1 M</Text>
        <Text style={styles.summaryLabel}>Total Pendanaan</Text>
      </View>

      <View style={styles.summaryBox}>
        <MaterialCommunityIcons name="home-city-outline" size={28} color="#2196F3" />
        <Text style={styles.summaryValue}>22</Text>
        <Text style={styles.summaryLabel}>Aset Terdaftar</Text>
      </View>

      <View style={styles.summaryBox}>
        <MaterialCommunityIcons name="account-group-outline" size={28} color="#FF9800" />
        <Text style={styles.summaryValue}>193</Text>
        <Text style={styles.summaryLabel}>Pembeli Terdaftar</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#214937',
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default PatunganSummary;
