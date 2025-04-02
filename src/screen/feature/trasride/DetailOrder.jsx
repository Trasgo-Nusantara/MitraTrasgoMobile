import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getData } from '../../../api/service';
import { ButtonComponent } from '../../../component/ButtonComponent';
import { LoadingSearchComponent } from './component/LoadingSearchComponent';
import ModalDriver from '../../../component/ModaDriver';
import { ModalSearchView } from './component/SearchComponent';


const { width, height } = Dimensions.get('window');

const DetailOrder = ({ route, navigation }) => {
    const mapRef = useRef(null);
    const isMounted = useRef(true); // Untuk mengecek apakah komponen masih mounted
    const { idInvoice } = route.params;

    const [status, setStatus] = useState(0);
    const [data, setData] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [mencariDriver, setMencariDriver] = useState(false);
    const [findDriver, setfindDriver] = useState(false);

    // Fungsi untuk mengambil data pesanan
    const getProfileUser = useCallback(async () => {
        try {
            const response = await getData(`order/GetOrder/Detail/${idInvoice}`);
            if (!isMounted.current) return;

            setData(response);
            console.log(response)
            setStatus(response?.data?.status || 0);
            setDriverLocation(response?.locationDriver || null);
            setPickupLocation(response?.data?.pickupLocation || null);
            setDestinationLocation(response?.data?.destinationLocation || null);
            setCoordinates(response?.data?.coordinates || []);

            if (response?.data?.status === 4) {
                navigation.goBack();
            }

            if (response.data.status != 0) {
                setfindDriver(true)
            }

            if (response.data.status === 0) {
                setfindDriver(false)
            }


            const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 };

            if (mapRef.current) {
                let locations = [];

                if (response?.data?.status === 0) {
                    setMencariDriver(true);
                    locations = [response?.data?.pickupLocation];
                } else {
                    setMencariDriver(false);
                }

                if (response?.data?.status === 1) {
                    locations = [response?.data?.pickupLocation, response?.locationDriver];
                }

                if (response?.data?.status >= 2) {
                    locations = [response?.locationDriver, response?.data?.destinationLocation];
                }

                // Filter lokasi yang valid sebelum di-set ke peta
                const validLocations = locations.filter(Boolean);
                if (validLocations.length > 0) {
                    mapRef.current.fitToCoordinates(validLocations, {
                        edgePadding: paddingMap,
                        animated: true,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    }, [idInvoice, navigation]);

    // useEffect untuk mengambil data awal dan polling setiap 10 detik
    useEffect(() => {
        isMounted.current = true;
        getProfileUser();

        const intervalId = setInterval(() => {
            getProfileUser();
        }, 10000);

        return () => {
            isMounted.current = false;
            clearInterval(intervalId);
        };
    }, [getProfileUser]);

    // Fungsi untuk membatalkan pencarian driver
    const batalMencari = async () => {
        try {
            const response = await getData(`order/cancelOrderByUser/${idInvoice}`);
            setMencariDriver(false);
            navigation.goBack();
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <MapView
                ref={mapRef}
                style={styles.map}
                pitch={30}
                region={{
                    latitude: pickupLocation?.latitude || -6.2067,
                    longitude: pickupLocation?.longitude || 106.7161,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
                {pickupLocation && <Marker coordinate={pickupLocation} pinColor="red" title="Origin" />}
                {destinationLocation && (
                    <Marker coordinate={destinationLocation} pinColor="green" title="Origin" />
                )}
                {status > 0 && driverLocation && (
                    <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
                        <View style={[styles.markerContainer, { backgroundColor: 'green' }]}>
                            <Image source={require("../../../assets/logo.png")} style={styles.markerImage} />
                        </View>
                    </Marker>
                )}
                {coordinates.length > 0 && (
                    <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} />
                )}
            </MapView>

            {mencariDriver && (
                <>
                    <View style={styles.modalBackground} />
                    <View style={styles.modalBottom}>
                        <ButtonComponent
                            style={{ backgroundColor: COLORS.secondary }}
                            title="Batal Mencari"
                            onPress={batalMencari}
                        />
                    </View>
                    <LoadingSearchComponent />
                </>
            )}

            {findDriver &&
                <>
                    <ModalSearchView
                        modalSearchBarShow={findDriver}
                        asal={data.data.pickupLocation.address}
                        tujuan={data.data.destinationLocation.address} />
                    <ModalDriver
                        title={"asd"}
                        desc={"hjk"}
                        isVisible={findDriver}
                        setModalVisible={setfindDriver}
                        actions={() => batalMencari()}
                        call={() => navigation.navigate("Call", {
                            idDriver: 0
                        })}
                        chat={() => navigation.navigate("Chat", {
                            idDriver: data.data.idDriver,
                            idOrder: data.data.id,
                            idUser: data.data.idUser
                        })}
                        selesai={() => navigation.replace("Rating", {
                            idInvoice: 'INV 123.2123'
                        })}
                        status={status}
                        data={data} />
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
    modalBackground: {
        position: 'absolute',
        backgroundColor: '#00000090',
        width: width,
        height: height,
    },
    modalBottom: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    markerContainer: {
        backgroundColor: 'white',
        borderRadius: 100,
        padding: 5,
    },
    markerImage: {
        width: 20,
        height: 20,
    },
});

export default DetailOrder;
