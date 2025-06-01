import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import FloatingButton from './Floating';
import { getData, postData } from '../../api/service';
import PatunganComponent from '../component/PatunganView';

const { width } = Dimensions.get('window');

const PatunganScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [targetLot, setTargetLot] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [penagihanDateText, setPenagihanDateText] = useState('');

    const [bannerFiles, setBannerFiles] = useState([]);
    const [documentFiles, setDocumentFiles] = useState([]);
    const [PatunganData, setPatunganData] = useState([]);

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

    useEffect(() => {
        getDatabase();
        getDatabasePatungan();
    }, []);

    const getDatabasePatungan = async () => {
        try {
            const res = await getData('Patungan');
            setPatunganData(res.data);
            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    const pickImage = async (setFiles) => {
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 });
        if (!result.didCancel && result.assets) {
            setFiles(prev => [...prev, ...result.assets]);
        }
    };

    const removeImage = (index, setFiles) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (files) => {
        const urls = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: 'image/jpeg',
                name: `photo_${Date.now()}.jpg`,
            });

            const upload = await postData('file/upload', formData);
            console.log("Uploaded URLs:", upload);

            if (upload?.path) {
                urls.push(upload.path);
            }
        }
        console.log("Uploaded URLs:", urls);
        return urls;
    };

    const handleSubmit = async () => {
        if (!title || !description || !targetLot || !targetAmount || !penagihanDateText) {
            Alert.alert("Validasi", "Harap lengkapi semua field wajib.");
            return;
        }

        const [dd, mm, yyyy] = penagihanDateText.split(' ');
        const parsedDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
        if (isNaN(parsedDate.getTime())) {
            Alert.alert("Error", "Format tanggal tidak valid. Gunakan format DD MM YYYY");
            return;
        }

        try {
            const [uploadedBanner, uploadedDocs] = await Promise.all([
                uploadImages(bannerFiles),
                uploadImages(documentFiles),
            ]);

            console.log("Uploaded Banner:", uploadedBanner);
            console.log("Uploaded Documents:", uploadedDocs);

            const body = {
                title,
                description,
                keterangan,
                banner: uploadedBanner,
                document: uploadedDocs,
                location: "Default Location",
                targetLot: parseFloat(targetLot),
                targetAmount: parseFloat(targetAmount),
                penagihanDate: parsedDate.toISOString(),
                isAvailable: true,
            };

            const response = await postData('Patungan', body);
            Alert.alert("Sukses", "Patungan berhasil ditambahkan!");
            setModalVisible(false);
            resetForm();
            getDatabasePatungan();
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setKeterangan('');
        setTargetLot('');
        setTargetAmount('');
        setPenagihanDateText('');
        setBannerFiles([]);
        setDocumentFiles([]);
    };

    const formatNumber = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor="#214937" barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#214937" style={{ marginTop: 30 }} />
                ) : (
                    <View style={styles.cardContainer}>
                        {PatunganData.map((item) => (
                            <TouchableOpacity onPress={() => navigation.navigate("PatunganDetail", { data: item })} key={item} style={styles.card}>
                                <PatunganComponent key={item} data={item} />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {datas?.role === '2' &&
                <FloatingButton onPress={() => setModalVisible(true)} />
            }

            <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Tambah Patungan</Text>

                            {/* Input Fields */}
                            <TextInput placeholder="Title" style={styles.input} onChangeText={setTitle} value={title} />
                            <TextInput placeholder="Deskripsi" style={styles.input} onChangeText={setDescription} value={description} />
                            <TextInput placeholder="Alamat" style={styles.input} onChangeText={setKeterangan} value={keterangan} />
                            <TextInput
                                placeholder="Total Lembar"
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => setTargetLot(text.replace(/\./g, ''))}
                                value={formatNumber(targetLot)}
                            />

                            <TextInput
                                placeholder="Harga Minimal Untuk 1 Lembar"
                                keyboardType="numeric"
                                style={styles.input}
                                onChangeText={(text) => setTargetAmount(text.replace(/\./g, ''))}
                                value={formatNumber(targetAmount)}
                            />
                            {targetAmount * targetLot > 0 &&
                                <Text style={{ margin: 20, textAlign: 'center' }}>Total Rp {(targetAmount * targetLot).toLocaleString('id')}</Text>
                            }
                            <TextInput placeholder="Tanggal Penagihan (DD MM YYYY)" keyboardType="numeric" style={styles.input} onChangeText={setPenagihanDateText} value={penagihanDateText} />

                            {/* Banner */}
                            <TouchableOpacity onPress={() => pickImage(setBannerFiles)} style={styles.uploadBtn}>
                                <Text>Upload Banner</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={bannerFiles}
                                horizontal
                                renderItem={({ item, index }) => (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: item.uri }} style={styles.imageThumb} />
                                        <TouchableOpacity onPress={() => removeImage(index, setBannerFiles)} style={styles.removeBtn}>
                                            <Text style={styles.removeText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />

                            {/* Document */}
                            <TouchableOpacity onPress={() => pickImage(setDocumentFiles)} style={styles.uploadBtn}>
                                <Text>Upload Dokumen</Text>
                            </TouchableOpacity>
                            <FlatList
                                data={documentFiles}
                                horizontal
                                renderItem={({ item, index }) => (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: item.uri }} style={styles.imageThumb} />
                                        <TouchableOpacity onPress={() => removeImage(index, setDocumentFiles)} style={styles.removeBtn}>
                                            <Text style={styles.removeText}>X</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />

                            <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                                <Text style={{ color: '#fff' }}>Simpan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text>Batal</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = {
    backgroundStyle: { flex: 1, backgroundColor: '#FFF' },
    scrollViewContent: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 30,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        borderRadius: 10,
        width: (width - 20) / 2,
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    uploadBtn: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    submitBtn: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelBtn: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#ddd',
    },
    imageContainer: {
        marginRight: 10,
        marginBottom: 10,
        marginTop: 10,
        position: 'relative',
    },
    imageThumb: {
        width: 80,
        height: 80,
        borderRadius: 6,
    },
    removeBtn: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
};

export default PatunganScreen;
