/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { getData } from '../api/service';

const { width } = Dimensions.get('window');

const AktifitasScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [detailData2, setDetailData2] = useState([]);


  const getArisanDatabase = async () => {
    try {
      const response = await getData('Arisan/ByUser');
      setDetailData(response.data);
      setLoading(false)
    } catch (error) {
      Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
    }
  };

  const getPatunganDatabase = async () => {
    try {
      const response = await getData('Patungan/ByUser');
      setDetailData2(response.data);
      setLoading(false)
    } catch (error) {
      Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
    }
  };


  useEffect(() => {
    getArisanDatabase();
    getPatunganDatabase();
    console.log(detailData.concat(detailData2));
    // Simulasi fetch data (ganti dengan Firestore jika perlu)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.type === "Arisan") {
          navigation.navigate("ArisanDetail", { data: item });
        } else if (item.type === "Patungan") {
          navigation.navigate("PatunganDetail", { data: item });
        }
      }}
      style={styles.card}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.date}>{item.keterangan}</Text>
        <Text style={styles.date}>{item.desc}</Text>
      </View>
      {item.type === "Arisan" &&
        <Text style={styles.amount}>ARISAN</Text>
      }
      {item.type === "Patungan" &&
        <Text style={styles.amount}>PATUNGAN</Text>
      }
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar backgroundColor="#214937" barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: 20, marginVertical: 20 }}>
        <Text style={styles.header}>Aktivitas Aset</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#214937" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={detailData.concat(detailData2)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
            contentContainerStyle={{ paddingTop: 10 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#214937',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 32,
    marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#214937',
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F3C623',
  },
});

export default AktifitasScreen;
