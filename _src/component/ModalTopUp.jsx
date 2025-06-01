import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Dimensions, View, Modal, Button } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion"
import { useTranslation } from 'react-i18next';
import * as RNIap from 'react-native-iap';

const { width, height } = Dimensions.get('window');

const ModalTopUp = ({ title, desc, isVisible, setModalVisible, actions }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);
  const [products, setProducts] = useState([]);

  // Trigger the animation 0.5 seconds after the modal becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimateModal(true);
      }, 100); // 0.5 seconds delay
      return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
    } else {
      setAnimateModal(false); // Reset animation when modal is closed
    }
  }, [isVisible]);

  useEffect(() => {
    const initIAP = async () => {
      try {
        await RNIap.initConnection();
        console.log('IAP connected');
        const products = await RNIap.getProducts(['inv25k']); 
        console.log('Products:', products);
        setProducts(products);
      } catch (err) {
        console.warn('IAP Error:', err);
      }
    };
  
    initIAP();
  
    return () => {
      RNIap.endConnection();
    };
  }, []);

  const buyProduct = async (sku) => {
    try {
      const purchase = await RNIap.requestPurchase(sku);
      Alert.alert('Success', `Purchase successful: ${purchase.productId}`);
    } catch (err) {
      console.warn('Purchase Error:', err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Motion.View
          initial={{ y: 0 }}
          animate={{ x: 0, y: animateModal ? -4 * 100 : 4 * 100 }} // Use the animateModal state for triggering animation
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
          transition={{ type: 'spring' }}
          style={styles.modalAnimate}
        >
          <View style={styles.modalComponent} >
            {products.map((product) => (
              <View key={product.productId} style={{ marginBottom: 20 }}>
                <Text>{product.title}</Text>
                <Text>{product.description}</Text>
                <Text>{product.localizedPrice}</Text>
                <Button title="Buy" onPress={() => buyProduct(product.productId)} />
              </View>
            ))}
          </View>
        </Motion.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 50,
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
  }
});

export default ModalTopUp;
