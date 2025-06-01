import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ButtonComponent, ButtonSecondaryComponent } from '../../../component/ButtonComponent';
import { useTranslation } from 'react-i18next';



const { width } = Dimensions.get('window');

const driver =
{
    driverName: 'Arsalim',
    type: 'Toyota Avanza',
    plat: 'B 1234 ABC',
    phone: '081234567890',
    rating: 4.5,
    image: 'https://www.w3schools.com/w3images/avatar2.png',
    biaya: 100000,
    payment: 'Cash',
    invoice: 'INV/2021/01/01/001',
    date: '01 Januari 2021',
}

const RatingScreen = ({ route, navigation }) => {
    const { idInvoice } = route.params
    const { t } = useTranslation();
    const [rating, setRating] = useState(0)
    const [tip, setTip] = useState(0)


    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
                <Text style={[COMPONENT_STYLES.textMedium]}>Beri Rating Transaksimu ? { }</Text>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={styles.barRating}>
                    <TouchableOpacity onPress={() => setRating(1)}>
                        <Ionicons name="star" size={32} color={rating >= 1 ? "yellow" : "white"} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRating(2)}>
                        <Ionicons name="star" size={32} color={rating >= 2 ? "yellow" : "white"} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRating(3)}>
                        <Ionicons name="star" size={32} color={rating >= 3 ? "yellow" : "white"} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRating(4)}>
                        <Ionicons name="star" size={32} color={rating >= 4 ? "yellow" : "white"} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRating(5)}>
                        <Ionicons name="star" size={32} color={rating >= 5 ? "yellow" : "white"} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Image source={{ uri: driver.image }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                    </View>
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{driver.driverName}</Text>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{driver.plat}</Text>
                        <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{driver.type}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
                    </View>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Biaya</Text>
                    <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Rp {driver.biaya.toLocaleString('id')}</Text>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Metoda Pembayaran</Text>
                    <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{driver.payment}</Text>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>Invoice</Text>
                    <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{driver.invoice}</Text>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <Text style={[COMPONENT_STYLES.textMedium]}>Kasih Tip yuk untuk TRASGO, agar kami bisa selalu bersemangat melayani kamu dan mitra kami agar menjadi lebih baik</Text>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={styles.barTips}>
                    <TouchableOpacity onPress={() => setTip(1000)}>
                        <View style={[styles.subPay, {backgroundColor:tip == 1000 ? "yellow" : "white"}]}>
                            <Text>Rp 1.000</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTip(3000)}>
                        <View style={[styles.subPay, {backgroundColor:tip == 3000 ? "yellow" : "white"}]}>
                            <Text>Rp 3.000</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTip(5000)}>
                        <View style={[styles.subPay, {backgroundColor:tip == 5000 ? "yellow" : "white"}]}>
                            <Text>Rp 5.000</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTip(10000)}>
                        <View style={[styles.subPay, {backgroundColor:tip == 10000 ? "yellow" : "white"}]}>
                            <Text>Rp 10.000</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ flex: 1,padding:30 }}>
                        <ButtonComponent
                            title={t('button.selesai')}
                            onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    barRating: { padding: 20, borderRadius: 10, flexDirection: "row", justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
    barTips: { 
        padding: 20, 
        borderRadius: 10, 
        flexDirection: "row", 
        justifyContent: 'center', 
        alignItems: 'center'},
        elevation:2,
    subPay:{
        padding:10, 
        borderWidth:1, 
        borderColor:'gray', 
        borderRadius:5,
        margin:10
    }
});

export default RatingScreen;
