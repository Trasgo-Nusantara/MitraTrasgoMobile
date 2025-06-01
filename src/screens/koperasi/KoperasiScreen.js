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
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const { width } = Dimensions.get('window');

const KoperasiScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [saldo, setSaldo] = useState(300000); // saldo contoh
    const [totalIuran, setTotalIuran] = useState(900000);
    const [modalVisible, setModalVisible] = useState(false);
    const [nominal, setNominal] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [history, setHistory] = useState([]);

    const [rekening, setrekening] = useState(0);

    const getDatabase = async () => {
        try {
            const rekening = await getData('rekening/SettingIuranBulanan');
            const transaksi = await getData('transaksi');
            setHistory(transaksi.data.filter(item => item.type.includes('KoperasiBulanan')));
            setrekening(rekening.data);
            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    useEffect(() => {
        getDatabase();
    }, []);

    const handleTransfer = () => {
        const amount = parseInt(nominal);
        if (!amount || amount <= 0 || !keterangan) {
            Alert.alert('Error', 'Nominal dan keterangan harus diisi');
            return;
        }
        if (amount > saldo) {
            Alert.alert(
                'Saldo Tidak Cukup',
                'Saldo Anda tidak cukup, silahkan isi ulang.',
                [
                    {
                        text: 'Nanti Saja',
                        style: 'cancel',
                    },
                    {
                        text: 'Topup Sekarang',
                        onPress: () => navigation.navigate('Saldo'),
                    },
                ],
                { cancelable: true }
            );
            return;
        }

        setSaldo(prev => prev - amount);
        setTotalIuran(prev => prev + amount);
        setHistory(prev => [
            {
                id: Date.now().toString(),
                amount,
                desc: keterangan,
                date: new Date().toLocaleDateString('id-ID')
            },
            ...prev,
        ]);
        setModalVisible(false);
        setNominal('');
        setKeterangan('');
    };

    const handleNominalChange = (text) => {
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
        <View style={styles.historyItem}>
            <View>
                <Text style={styles.historyTitle}>{item.ket}</Text>
                <Text style={styles.historyDate}>{formatDateTime(item.createdAt)}</Text>
            </View>
            <Text style={[styles.historyAmount, item.status === 'Income' ? styles.income : styles.expense]}>
                {item.status === 'Income' ? '+ ' : '- '}Rp {item?.nominal?.toLocaleString('id-ID')}
            </Text>
        </View>
    );

    const bayar = async () => {
        try {
            await postData('Transaksi/PayBulananKoperasi');
            getDatabase();
            Alert.alert('Sukses', 'Pembayaran berhasil.');
        } catch (err) {
            Alert.alert('Error', err || "Transaksi Bulanan Selesai");
            setLoading(false);
        }
    };

    const hasPaidThisMonth = () => {
        const now = new Date();
        return history.some(item => {
            const paidDate = new Date(item.createdAt);
            return (
                paidDate.getMonth() === now.getMonth() &&
                paidDate.getFullYear() === now.getFullYear()
            );
        });
    };


    if (loading) {
        return (
            <SafeAreaView style={styles.backgroundStyle}>
                <StatusBar backgroundColor="#214937" barStyle="dark-content" />
                <ActivityIndicator size="large" color="#214937" style={{ flex: 1, justifyContent: 'center' }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor="#3f2e3e" barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#3f2e3e" />
                ) : (
                    <>
                        <View style={styles.centerContent}>
                            <Icon name="money-check-alt" size={32} color="#3f2e3e" />
                            <Text style={styles.totalText}>Iuran Wajib Bulanan</Text>
                            <Text style={styles.totalAmount}>Rp {rekening.toLocaleString('id-ID')}</Text>
                        </View>

                        {!hasPaidThisMonth() && (
                            <TouchableOpacity style={styles.iuranButton} onPress={() => bayar()}>
                                <Text style={styles.buttonText}>Bayar Iuran Bulan Ini</Text>
                            </TouchableOpacity>
                        )}

                        <Text style={styles.sectionTitle}>Riwayat Iuran</Text>
                        <View style={styles.historyList}>
                            {history.map((item, idx) =>
                                <View key={idx} style={styles.historyItem}>
                                    <View>
                                        <Text style={styles.historyTitle}>{item.ket}</Text>
                                        <Text style={styles.historyDate}>{formatDateTime(item.createdAt)}</Text>
                                    </View>
                                    <Text style={[styles.historyAmount, item.status === 'Income' ? styles.income : styles.expense]}>
                                        {item.status === 'Income' ? '+ ' : '- '}Rp {item?.nominal?.toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bayar Iuran</Text>
                        <Text style={styles.saldoText}>Saldo Anda: Rp {saldo.toLocaleString('id-ID')}</Text>

                        <TextInput
                            placeholder="Nominal"
                            keyboardType="numeric"
                            value={formatCurrency(nominal)}
                            onChangeText={handleNominalChange}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Keterangan (contoh: Iuran Bulan Mei 2025)"
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
        color: '#3f2e3e',
        marginBottom: 12,
    },
    backgroundStyle: {
        flex: 1,
        backgroundColor: '#fdfdfd',
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
        color: '#3f2e3e',
        marginTop: 4,
    },
    iuranButton: {
        backgroundColor: '#3f2e3e',
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
        color: '#3f2e3e',
        marginBottom: 10,
    },
    historyList: {
        marginBottom: 50,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    historyTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    historyDate: {
        fontSize: 13,
        color: '#777',
    },
    historyAmount: {
        fontSize: 15,
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
        color: '#3f2e3e',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    transferButton: {
        backgroundColor: '#3f2e3e',
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

export default KoperasiScreen;
