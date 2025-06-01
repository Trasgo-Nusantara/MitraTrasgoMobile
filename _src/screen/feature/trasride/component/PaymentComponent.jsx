import { Motion } from "@legendapp/motion"
import { COMPONENT_STYLES, formatRupiah } from "../../../../lib/constants"
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal, PanResponder } from 'react-native';
import DropdownSearchComponent from "../../../../component/DropdownSearchComponent";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DropdownLanguangeComponent from "../../../../component/DropdownLanguangeComponent";
import { ButtonComponent } from "../../../../component/ButtonComponent";

const languageItems = [
    { label: 'Tunai', value: 'tn' },
    { label: 'Traspay', value: 'tp' },
    // { label: 'Gopay', value: 'gp' },
    // { label: 'ShoopePay', value: 'sp' },
    // { label: 'OVO', value: 'ov' },
];

const promo = [
    { label: 'Kode Promo', value: 's' },
    { label: 'Hemat Ride', value: 'XBXDCD' },
    { label: 'Hemat Car', value: 'XBXDCDA' },
];

const ModalPaymentComponent = ({
    modalPaymentShow,
    setmodalPaymentShow,
    navigasi,
    selectedValue
}) => {

    const { t } = useTranslation();
    const [payment, setpayment] = useState('tn');
    const [kodePromo, setkodePromo] = useState({
        label: 'Kode Promo',
        value: 's'
    });

    useEffect(() => {
        if (modalPaymentShow) {
            const timer = setTimeout(() => {
                setmodalPaymentShow(true);
            }, 100); // 0.5 seconds delay
            return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
        } else {
            setmodalPaymentShow(false); // Reset animation when modal is closed
        }
    }, [modalPaymentShow]);

    const handleNavigasi = () => {
        const timer = setTimeout(() => {
            navigasi();
        }, 200); // 0.5 seconds delay
        return () => clearTimeout(timer);
    };

    return (
        <Motion.View
            initial={{ y: 0 }}
            animate={{ x: 0, y: modalPaymentShow ? 0 * 100 : 4 * 100 }} // Use the animateModal state for triggering animation
            whileHover={{ scale: 1.2 }}
            whileTap={{ y: 20 }}
            transition={{ type: 'spring' }}
            style={styles.modalAnimate}
        >
            <View style={styles.modalComponentBottom} >
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <DropdownLanguangeComponent
                            items={languageItems}
                            value={languageItems.find((e) => e.value === payment).label}
                            iconName={"chevron-forward-outline"}
                            onValueChange={setpayment}
                        />
                    </View>
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={COMPONENT_STYLES.spacer} />
                    <View style={{ flex: 1 }}>
                        {/* <DropdownSearchComponent
                            items={promo}
                            value={kodePromo.value}
                            iconName={"pricetags-outline"}
                            onValueChange={setkodePromo}
                            trigger={(a) => ""}
                        /> */}
                    </View>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        {selectedValue.harga !== undefined &&
                            <ButtonComponent
                                title={t('button.pesan') + " Rp " + formatRupiah(selectedValue.harga)}
                                onPress={handleNavigasi}
                            />
                        }
                        {selectedValue.harga === undefined &&
                            <ButtonComponent
                                title={t('button.pilihkendaraan')}
                            />
                        }
                    </View>
                </View>
            </View>
        </Motion.View>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    modalAnimate: {
        position: 'absolute',
        bottom: 0, // Position it at the bottom
        left: 0,
        right: 0,
    },
    modalComponent: {
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    modalComponentBottom: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#00000030',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        elevation: 1
    },
});

export {
    ModalPaymentComponent
}