import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getData, postData } from '../../../api/service';

const Member = ({ data, getArisanDatabase }) => {
    const bulanSekarang = new Date().toLocaleString('id-ID', { month: 'long' });
    const [datas, setdatas] = useState("");

    const getDatabase = async () => {
        try {
            const response = await getData('auth/verifySessions');
            console.log(data);
            setdatas(response.data);
        } catch (error) {
            Alert.alert("Error", error.response.data.message || "Terjadi kesalahan saat memverifikasi.");
        }
    };

    useEffect(() => {
        getDatabase()
    }, []);

    const handleBayar = async (items) => {
        const formData = {
            idTransaksi: data.id,
            idUser: items?.idUser
        };
        try {
            const response = await postData('Arisan/PayCompleteArisan',formData);
            Alert.alert("Berhasil", response.message);
            getArisanDatabase();
        } catch (error) {
            console.log(error)
            Alert.alert("Error", error.data.errorMessage.Error || "Terjadi kesalahan saat memverifikasi.");
        }
    };
    
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
                    <Text style={[styles.cell, styles.slot]}>Slot</Text>
                    <Text style={[styles.cell, styles.payment]}>Iuran {bulanSekarang}</Text>
                    <Text style={[styles.cell, styles.terima]}>Terima</Text>
                </View>

                {/* Rows */}
                {data.memberArisan.map((item, index) => (
                    <View style={styles.row} key={index}>
                        <Text style={[styles.cell, styles.no]}>{index + 1}</Text>
                        <Text style={[styles.cell, styles.nama]}>{item.name}</Text>
                        <Text style={[styles.cell, styles.slot]}>{item.jumlahLot}</Text>

                        {!item.isMonthPayed ? (
                            <Icon name="close" size={16} color="red" style={[styles.cell, styles.terima]} />
                        ) : (
                            <Icon name="check" size={16} color="green" style={[styles.cell, styles.terima]} />
                        )}
                        {item.isPayed ? (
                            <Icon name="check" size={16} color="green" style={[styles.cell, styles.terima]} />
                        ) : (
                            datas?.role === '2' ? (
                                <TouchableOpacity onPress={() => handleBayar(item)} style={[{ backgroundColor: 'green', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, textAlign: 'center' }]}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Approve</Text>
                                </TouchableOpacity>
                            ) : <Icon name="close" size={16} color="red" style={[styles.cell, styles.terima]} />
                        )}
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
