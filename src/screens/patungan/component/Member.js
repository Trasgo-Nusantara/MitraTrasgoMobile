import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getData, postData } from '../../../api/service';

const Member = ({ data, getPatunganDatabase }) => {
    const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });
    const [datas, setdatas] = useState("");
    const [loading, setLoading] = useState(true);

    const getDatabase = async () => {
        try {
            const response = await getData('auth/verifySessions');
            setdatas(response.data);
            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    useEffect(() => {
        getDatabase()
        console.log(data);
    }, []);

    // const handleBayar = async (items) => {
    //     const formData = {
    //         idTransaksi: data.id,
    //         idUser: items?.idUser
    //     };
    //     try {
    //         const response = await postData('Patungan/PayCompletePatungan',formData);
    //         Alert.alert("Berhasil", response.message);
    //         getPatunganDatabase();
    //     } catch (error) {
    //         console.log(error)
    //         Alert.alert("Error", error.data.errorMessage.Error || "Terjadi kesalahan saat memverifikasi.");
    //     }
    // };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[styles.row, styles.header]}>
                    <Text style={[styles.cell, styles.no]}>No</Text>
                    <Text style={[styles.cell, styles.nama]}>Nama</Text>
                    <Text style={[styles.cell, styles.slot]}>Lembar</Text>
                    <Text style={[styles.cell, styles.slot]}>Nilai</Text>

                </View>

                {/* Rows */}
                {data.memberPatungan.map((item, index) => (
                    <View style={styles.row} key={index}>
                        <Text style={[styles.cell, styles.no]}>{index + 1}</Text>
                        <Text style={[styles.cell, styles.nama]}>{item.name}</Text>
                        <Text style={[styles.cell, styles.slot]}>{item.jumlahLot}</Text>
                        <Text style={[styles.cell, styles.slot]}>{(item.jumlahLot * data.targetPay).toLocaleString('id')}</Text>

                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#f0f0f0',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    cell: {
        fontSize: 14,
        paddingHorizontal: 5,
    },
    no: {
        width: 30,
    },
    nama: {
        flex: 2,
    },
    slot: {
        flex: 1,
    },
    payment: {
        flex: 1,
        textAlign: 'center',
    },
    terima: {
        flex: 1,
        textAlign: 'center',
    },
});

export default Member;
