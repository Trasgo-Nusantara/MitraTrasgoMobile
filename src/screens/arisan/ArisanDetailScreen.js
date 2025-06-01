import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Modal,
    TextInput,
    Alert,
    Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Deskripsi from './component/Deskripsi';
import Chat from './component/Chat';
import Member from './component/Member';
import Syarat from './component/Syarat';
import { getData, postData } from '../../api/service';

const { width, height } = Dimensions.get('window');

const banners = [
    { id: '1', color: '#ff7675', text: 'Banner 1' },
    { id: '2', color: '#74b9ff', text: 'Banner 2' },
    { id: '3', color: '#55efc4', text: 'Banner 3' },
];

const tabs = ['Deskripsi', 'Syarat', 'Member', 'Chat'];

export default function ArisanDetail({ route }) {
    const { data } = route.params
    const [activeTab, setActiveTab] = useState('Deskripsi');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPayment, setmodalPayment] = useState(false);
    const [jumlahLot, setJumlahLot] = useState(1);
    const [nominal, setNominal] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [detailData, setDetailData] = useState("");
    const [loading, setLoading] = useState(true);
    const [datas, setdatas] = useState("");

    const getDatabase = async () => {
        try {
            const response = await getData('auth/verifySessions');
            console.log(response.data);
            setdatas(response.data);
        } catch (error) {
            Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    const getArisanDatabase = async () => {
        try {
            const response = await getData('Arisan/' + data?.id);
            setDetailData(response.data);
            setLoading(false)
        } catch (error) {
            Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    const totalSaldo = 500000;
    const iuranWajibPerLot = detailData?.targetPay || 0;

    useEffect(() => {
        getArisanDatabase();
        if (jumlahLot < 1) setJumlahLot(1);
        setNominal(jumlahLot * iuranWajibPerLot);
    }, [jumlahLot]);

    const onBayarSekarang = async () => {
        const formData = {
            idTransaksi: data.id,
        }
        try {
            const response = await postData('Arisan/PayArisan', formData);
            getArisanDatabase();
            setmodalPayment(false)
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    const GabungMember = async () => {
        const formData = {
            "idUser": datas?.phone,
            "idArisan": data?.id,
            "phoneNumber": datas?.phone,
            "jumlahLot": jumlahLot,
            "isActive": true,
            "isPayed": false
        }
        try {
            const response = await postData('Arisan/AddNewArisanMember', formData);
            getArisanDatabase();
            setModalVisible(false)
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#214937" barStyle="dark-content" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#214937" barStyle="dark-content" />
            {activeTab !== 'Chat' &&
                <><ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={styles.bannerContainer}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {detailData.banner.map((banner, idx) => (
                        <Image key={idx} source={{ uri: banner }} style={styles.banner} />
                    ))}
                </ScrollView><View style={styles.dotsContainer}>
                        {detailData.banner.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.activeDot,
                                ]} />
                        ))}
                    </View></>
            }

            {/* Tab Bar */}
            <View style={styles.tabBarContainer}>
                {tabs.map((tab) => {
                    if (
                        detailData?.statusMember?.isMembership === false &&
                        (tab === 'Member' || tab === 'Chat')
                    ) {
                        return null; // Jangan render tab ini
                    }

                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabItem,
                                activeTab === tab && styles.activeTabItem,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Tab Content */}
            <View style={styles.contentContainer}>
                {activeTab !== 'Chat' &&
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {activeTab === 'Deskripsi' &&
                            <Deskripsi data={detailData} />
                        }
                        {activeTab === 'Member' &&
                            <Member data={detailData} getArisanDatabase={getArisanDatabase} />
                        }

                        {activeTab === 'Syarat' &&
                            <Syarat data={detailData} />
                        }
                    </ScrollView>
                }
                {activeTab === 'Chat' &&
                    <Chat data={detailData} />
                }
            </View>

            {/* Floating Button */}
            {
                detailData?.statusMember?.isMembership === false &&
                <TouchableOpacity
                    style={styles.floatingButton}
                    activeOpacity={0.8}
                    onPress={() => { setModalVisible(true); getDatabase() }}
                >
                    <Text style={styles.floatingButtonText}>Gabung Member</Text>
                </TouchableOpacity>
            }

            {
                detailData?.statusMember?.isMembership === true && detailData?.statusMember?.isPayMonth === false &&
                <TouchableOpacity
                    style={styles.floatingButton}
                    activeOpacity={0.8}
                    onPress={() => { setmodalPayment(true); getDatabase() }}
                >
                    <Text style={styles.floatingButtonText}>Bayar Iuran</Text>
                </TouchableOpacity>
            }

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Gabung Member</Text>

                        <Text style={styles.label}>Total Saldo:</Text>
                        <Text style={styles.value}>Rp {datas?.balance}</Text>

                        <Text style={styles.label}>Harga Wajib per Lot:</Text>
                        <Text style={styles.value}>Rp {detailData?.targetPay}</Text>

                        <Text style={styles.label}>Jumlah Lot:</Text>
                        <View style={styles.lotInputContainer}>
                            <TouchableOpacity
                                onPress={() => setJumlahLot(prev => (prev > 1 ? prev - 1 : 1))}
                                style={styles.iconButton}
                            >
                                <Ionicons name="remove-circle-outline" size={32} color="#214937" />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.lotInput}
                                keyboardType="numeric"
                                value={jumlahLot.toLocaleString()}
                                onChangeText={(text) => {
                                    const num = parseInt(text);
                                    if (!isNaN(num) && num > 0) setJumlahLot(num);
                                    else setJumlahLot(1);
                                }}
                                maxLength={3}
                            />

                            <TouchableOpacity
                                onPress={() => setJumlahLot(prev => prev + 1)}
                                style={styles.iconButton}
                            >
                                <Ionicons name="add-circle-outline" size={32} color="#214937" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Total Nominal:</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: '#eee' }]}
                            value={`Rp ${nominal}`}
                            editable={false}
                        />

                        <TouchableOpacity style={styles.payButton} onPress={GabungMember}>
                            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal */}
            <Modal
                visible={modalPayment}
                transparent
                animationType="fade"
                onRequestClose={() => setmodalPayment(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bayar Iuran</Text>

                        <Text style={styles.label}>Total Saldo :</Text>
                        <Text style={styles.value}>Rp {datas?.balance}</Text>

                        <Text style={styles.label}>Iuran :</Text>
                        <Text style={styles.value}>Rp {detailData?.targetPay}</Text>

                        <TouchableOpacity style={styles.payButton} onPress={onBayarSekarang}>
                            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setmodalPayment(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    bannerContainer: { height: 150 },
    banner: {
        width: width,
        resizeMode: 'cover',
    },
    bannerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        position: 'absolute',
        top: height / 4.2,
        left: 10,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    dot: {
        width: 15,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#dfe6e9',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#214937',
        width: 15,
        height: 10,
    },
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#214937',
        paddingVertical: 10,
    },
    tabItem: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeTabItem: {
        backgroundColor: '#55efc4',
    },
    tabText: {
        color: '#dfe6e9',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#214937',
    },
    contentContainer: {
        flex: 5,
        padding: 20,
    },
    contentText: {
        fontSize: 16,
        color: '#2d3436',
        lineHeight: 24,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#214937',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    floatingButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        fontWeight: '600',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginTop: 4,
        color: '#214937',
    },
    lotInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    iconButton: {
        paddingHorizontal: 10,
    },
    lotInput: {
        flex: 1,
        height: 40,
        borderColor: '#214937',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        textAlign: 'center',
        fontSize: 16,
        marginHorizontal: 8,
    },
    input: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#214937',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
    },
    payButton: {
        marginTop: 20,
        backgroundColor: '#214937',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#214937',
        fontWeight: '600',
    },
});
