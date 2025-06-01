import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ImageSlider from './ImageSlider';

const { width } = Dimensions.get('window');

const data = {
    title: 'Rumah Rimbo Datar',
    images: [
        'https://api.patunganproperti.com/api/v1/upload?folder=asset_joint_property&filename=asset_image4_1728706413490.jpeg.enc',
        'https://api.patunganproperti.com/api/v1/upload?folder=asset_joint_property&filename=asset_image3_1728706413451.jpeg.enc',
        'https://api.patunganproperti.com/api/v1/upload?folder=asset_joint_property&filename=asset_image2_1728706413397.jpeg.enc'
    ],
};

const PatunganCard = () => {
    return (
        <View style={styles.card}>
            <ImageSlider images={data.images} />
            <View style={styles.content}>
                <Text style={styles.title}>Rumah Rimbo Datar</Text>
                <Text style={styles.address}>Jl. Rimbo Datar No.36 ... Sumatera Barat</Text>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Harga/Lot</Text>
                        <Text style={styles.value}>Rp 10.000.000</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Sisa Lot</Text>
                        <Text style={styles.value}>49</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Sisa Waktu</Text>
                        <Text style={styles.value}>0 Hari Lagi</Text>
                    </View>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: '2%' }]} />
                </View>
                <Text style={styles.progressText}>2%</Text>

                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Harga Jual</Text>
                        <Text style={styles.value}>Rp 500.000.000</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Tercapai</Text>
                        <Text style={styles.value}>Rp 10.000.000</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Detail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F3C623',
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 5,
        color: '#000',
    },
    address: {
        color: '#666',
        fontSize: 12,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    col: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#777',
    },
    value: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#eee',
        borderRadius: 3,
        overflow: 'hidden',
        marginVertical: 6,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#F3C623',
    },
    progressText: {
        fontSize: 12,
        color: '#777',
        alignSelf: 'flex-end',
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#F3C623',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default PatunganCard;
