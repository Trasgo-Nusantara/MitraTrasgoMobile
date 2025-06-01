import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getData, postData } from '../../api/service';

const { width } = Dimensions.get('window');

const SedekahScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [saldo, setSaldo] = useState(500000); // contoh saldo
    const [totalSedekah, setTotalSedekah] = useState(1250000);
    const [modalVisible, setModalVisible] = useState(false);
    const [nominal, setNominal] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [history, setHistory] = useState([]);
    const [rekening, setrekening] = useState(0);

    const getDatabase = async () => {
        try {
            const transaksi = await getData('Sedekah');
            setHistory(transaksi.data.filter(item => item.type.includes('Sedekah')));
            setrekening(transaksi.totalSedekah);
            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    useEffect(() => {
        getDatabase();
    }, []);

    const handleTransfer = async () => {
        const amount = parseInt(nominal);

        if (!amount || amount <= 0) {
            Alert.alert('Error', 'Nominal harus diisi dengan angka lebih dari 0');
            return;
        }

        if (!keterangan || keterangan.trim() === '') {
            Alert.alert('Error', 'Keterangan tidak boleh kosong');
            return;
        }

        try {
            const formData = {
                nominal: amount,
                keterangan: keterangan.trim(),
            };

            await postData('Transaksi/Sedekah', formData);
            getDatabase();
            setModalVisible(false);
            setNominal('');
            setKeterangan('');
            Alert.alert('Sukses', 'Pembayaran berhasil.');
        } catch (err) {
            Alert.alert('Error', err?.message || "Transaksi gagal");
            setLoading(false);
        }
    };


    const handleNominalChange = (text) => {
        // Hapus semua karakter non angka
        const raw = text.replace(/\D/g, '');
        setNominal(raw);
    };

    const formatCurrency = (numberString) => {
        if (!numberString) return '';
        return parseInt(numberString).toLocaleString('id-ID');
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');

        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year} ${hours}:${minutes}`;
    };



    const renderHistoryItem = ({ item }) => (
        <View style={[styles.historyItem, item.status === 'Income' ? styles.income : styles.expense]}>
            <View>
                <Text style={styles.historyDesc}>{item.ket}</Text>
                <Text style={styles.historyDate}>{formatDateTime(item.createdAt)}</Text>
            </View>
            <Text style={styles.historyAmount}>
                {item.status === 'Income' ? '+' : '-'} Rp {item.nominal.toLocaleString('id-ID')}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor="#214937" barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#214937" />
                ) : (
                    <>
                        {/* Total Sedekah */}
                        <View style={styles.centerContent}>
                            <Icon name="hand-holding-heart" size={32} color="#214937" />
                            <Text style={styles.totalText}>Total Sedekah</Text>
                            <Text style={styles.totalAmount}>Rp {rekening?.toLocaleString('id-ID')}</Text>
                        </View>

                        {/* Tombol Sedekah */}
                        <TouchableOpacity style={styles.sedekahButton} onPress={() => setModalVisible(true)}>
                            <Text style={styles.buttonText}>Sedekah Sekarang</Text>
                        </TouchableOpacity>

                        {/* Riwayat */}
                        <Text style={styles.sectionTitle}>Riwayat Sedekah</Text>
                        <FlatList
                            data={history}
                            renderItem={renderHistoryItem}
                            keyExtractor={item => item.id}
                            style={styles.historyList}
                        />
                    </>
                )}
            </ScrollView>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sedekah</Text>

                        <TextInput
                            placeholder="Nominal"
                            keyboardType="numeric"
                            value={formatCurrency(nominal)}
                            onChangeText={handleNominalChange}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Keterangan"
                            value={keterangan}
                            onChangeText={setKeterangan}
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
                                <Text style={styles.buttonText}>Transfer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    saldoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#214937',
        marginBottom: 12,
    },
    backgroundStyle: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollViewContent: {
        padding: 16,
    },
    centerContent: {
        alignItems: 'center',
        marginBottom: 24,
    },
    totalText: {
        fontSize: 16,
        marginTop: 10,
        color: '#555',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#214937',
        marginTop: 4,
    },
    sedekahButton: {
        backgroundColor: '#214937',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#214937',
        marginBottom: 10,
    },
    historyList: {
        paddingBottom: 30,
    },
    historyItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        elevation: 2,
    },
    income: {
        borderLeftWidth: 5,
        borderLeftColor: '#4caf50',
    },
    expense: {
        borderLeftWidth: 5,
        borderLeftColor: '#f44336',
    },
    historyDesc: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    historyDate: {
        fontSize: 13,
        color: '#777',
    },
    historyAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#214937',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    transferButton: {
        backgroundColor: '#214937',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    cancelButton: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    cancelText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },

});

export default SedekahScreen;
