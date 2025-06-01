import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DropdownComponent = ({ label, items, value, onValueChange, placeholder, iconName = 'chevron-down', style, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectItem = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>
          {value ? items.find(item => item.value === value)?.label : placeholder?.label}
        </Text>
        {iconName && (
        <Ionicons name={iconName} size={24} color={COLORS.text} />
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
    marginBottom: SPACING.large,
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
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.small,
  },
  dropdownText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
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
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
  },
});

export default DropdownComponent;