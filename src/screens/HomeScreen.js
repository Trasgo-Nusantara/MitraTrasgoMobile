import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    PermissionsAndroid,
    Alert, InteractionManager
} from 'react-native';
import ImageSlider from './component/ImageSlider';
import PatunganCard from './component/PatunganView';
import CategorySelector from './component/Category';
import MembershipCard from './component/MembershipCard';
import ArisanCard from './component/ArisanView';
import messaging from '@react-native-firebase/messaging';
import { request, PERMISSIONS } from 'react-native-permissions';

import artikelData from './../dummy/artikel.json';
import { getData, postData } from '../api/service';
import PatunganComponent from './component/PatunganView';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

    const [arisanData, setArisanData] = useState([]);
    const [patunganData, setPatunganData] = useState([]);
    const [data, setdata] = useState([]);
    const [dataProfile, setdataProfile] = useState("");

    const getDatabaseUser = async () => {
        try {
            const response = await getData('auth/verifySessions');
            console.log(response)
            setdataProfile(response.data);
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan.");
            setLoading(false)
        }
    };

    const getDatabase = async () => {
        try {
            const response = await getData('rekening/Banner');
            setdata(response.data);
        } catch (error) {
            Alert.alert("Error", error || "Terjadi kesalahan.");
        }
    };

    useEffect(() => {
        getDatabaseUser();
        getDatabase();
        getDatabaseArisan();
        getDatabasePatungan();
    }, []);

    const getDatabaseArisan = async () => {
        try {
            const res = await getData('Arisan');
            setArisanData(res.data);
        } catch (error) {
            console.error("Gagal fetch Arisan:", error);
        }
    };

    const getDatabasePatungan = async () => {
        try {
            const res2 = await getData('Patungan');
            console.log("Patungan Data:", res2.data);
            setPatunganData(res2.data);
        } catch (error) {
            console.error("Gagal fetch Arisan:", error);
        }
    };

    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                // Request permission for Geolocation
                const locationGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                // Request permission for Camera
                const cameraGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );

                // Request permission for Notifications (Android 13+)
                const notificationGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );

                if (
                    locationGranted === PermissionsAndroid.RESULTS.GRANTED &&
                    cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
                    notificationGranted === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    return true;
                } else {
                    Alert.alert(
                        'Permission Denied',
                        'You need to grant permissions for location, camera, and notifications.'
                    );
                    return false;
                }
            } else if (Platform.OS === 'ios') {
                // iOS: Request permissions using `react-native-permissions`
                const locationPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
                const notificationPermission = await request(PERMISSIONS.IOS.NOTIFICATIONS);

                // Check if all permissions are granted
                if (
                    locationPermission === 'granted' &&
                    cameraPermission === 'granted' &&
                    notificationPermission === 'granted'
                ) {
                    return true;
                } else {
                    Alert.alert(
                        'Permission Denied',
                        'You need to grant permissions for location, camera, and notifications.'
                    );
                    return false;
                }
            }
            return false; // default for unsupported platforms
        } catch (error) {
            console.error('Permission request failed', error);
            return false;
        }
    };

    const handleArtikelPress = (artikel) => {
        console.log('Artikel dipilih:', artikel.title);
    };

    const handleCategorySelect = (cat) => {
        if (cat === 'Arisan') {
            navigation.navigate('Arisan');
        } else if (cat === 'Patungan') {
            navigation.navigate('Patungan');
        } else if (cat === 'Koperasi') {
            if (!dataProfile.isMember) {
                navigation.navigate('Register');
            } else {
                navigation.navigate('Koperasi');
            }
        } else if (cat === 'Sedekah') {
            if (!dataProfile.isMember) {
                navigation.navigate('Register');
            } else {
                navigation.navigate('Sedekah');
            }
        }
    }

    const getFCM = async () => {
        const fcmToken = await messaging().getToken();
        const form = {
            fcm: fcmToken,
        };
        await postData('auth/updateFCMUser', form);
    }

    useEffect(() => {
        getFCM()
        InteractionManager.runAfterInteractions(() => {
            requestPermissions();
        });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <StatusBar backgroundColor="#214937" barStyle="light-content" />
            {/* 1. Banner */}
            <ImageSlider images={data} style={styles.banner} />

            <MembershipCard navigation={navigation} />

            <Text style={styles.sectionTitle}>Telusuri Kategori</Text>
            <CategorySelector onSelect={handleCategorySelect} dataProfile={dataProfile} navigation={navigation} />

            {/* 3. Promo */}
            <Text style={styles.sectionTitle}>Promo Patungan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingHorizontal: 10 }}>
                {patunganData.map((item, idx) =>
                    !item.isPromo ? (
                        <TouchableOpacity key={idx} onPress={() => navigation.navigate("PatunganDetail", { data: item })} style={{ marginHorizontal: 5, marginVertical: 10, width: width / 1.8 }}>
                            <PatunganComponent data={item} />
                        </TouchableOpacity>
                    ) : null
                )}
            </ScrollView>

            {/* 4. Arisan Terkini */}
            <Text style={styles.sectionTitle}>Arisan Terkini</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingHorizontal: 10 }}>
                {arisanData.map((item) =>
                    !item.isPromo ? (
                        <TouchableOpacity onPress={() => navigation.navigate("ArisanDetail", { data: item })} style={{ marginHorizontal: 5, marginVertical: 10, width: width / 2 }} key={item}>
                            <ArisanCard data={item} />
                        </TouchableOpacity>
                    ) : null
                )}
            </ScrollView>

            {/* 5. Artikel */}
            <Text style={styles.sectionTitle}>Artikel</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            >
                {artikelData.map((artikel) => (
                    <TouchableOpacity
                        key={artikel.id}
                        onPress={() => handleArtikelPress(artikel)}
                        style={styles.artikelCard}
                    >
                        <Image source={{ uri: artikel.image }} style={styles.artikelImage} />
                        <View style={styles.artikelTitleContainer}>
                            <Text style={styles.artikelTitle} numberOfLines={1}>{artikel.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* 6. Nama PT */}
            <View style={styles.footer}>
                <Text style={styles.ptText}>© 2025 PT. Patungan Properti Internasional</Text>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    banner: {
        width: '100%',
        height: 180,
        borderRadius: 15,
        marginTop: 15,
        marginBottom: 20,
    },
    horizontalScroll: {
        marginBottom: 20,
    },
    artikelCard: {
        marginTop: 10,
        marginRight: 12,
        borderRadius: 12,
        overflow: 'hidden',
        width: 200,
        height: 120,
    },
    artikelImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
        marginTop: 15,
        color: '#214937',
        letterSpacing: 0.5,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    ptText: {
        color: '#888',
        fontSize: 14,
    },
    artikelTitleContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },

    artikelTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    membershipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#214937',
        paddingVertical: 15,
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    membershipBox: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    membershipLabel: {
        color: '#BFD8B8',
        fontSize: 16,
        fontWeight: '600',
    },
    membershipValue: {
        color: '#F3C623',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
    },
});

export default HomeScreen;
