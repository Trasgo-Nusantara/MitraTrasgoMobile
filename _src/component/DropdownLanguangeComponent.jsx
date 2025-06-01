import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DropdownLanguangeComponent = ({ label, items, value, onValueChange, placeholder, iconName, style, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectItem = async (item) => {
    await AsyncStorage.setItem('languange',item.value)
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={[styles.dropdownText, {fontWeight:'bold'}]}>
          {value}
        </Text>
        <View style={COMPONENT_STYLES.spacer} />
        {iconName && (
        <Ionicons name={iconName} size={15} color={COLORS.text} />
        )}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleSelectItem(item)}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: SPACING.medium,
  },
  label: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
    marginBottom: SPACING.small,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.large,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    marginHorizontal:10
  },
  dropdownText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDarkShadow,
    fontFamily: FONT_FAMILIES.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
  },
  item: {
    padding: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  itemText: {
    fontSize: FONT_SIZES.medium,
    color: "black",
    fontFamily: FONT_FAMILIES.regular,
  },
});

export default DropdownLanguangeComponent;