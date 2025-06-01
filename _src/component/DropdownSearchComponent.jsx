import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { postData } from '../api/service';
import { ButtonComponent } from './ButtonComponent';


const { width, height } = Dimensions.get('window');

const DropdownSearchComponent = ({ setlocationStatus, focus, setfocus, setsearchLocationonMapMode, trigger, label, items, value, onValueChange, placeholder, iconName, iconNameDes, style, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setselectedValue] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSelectItem = (item) => {
    setselectedValue(item.description)
    onValueChange(item);
    trigger(item);
    setModalVisible(false);
  };

  const handleChoiceMapItem = (item) => {
    setModalVisible(false);
    setsearchLocationonMapMode(true)
    setlocationStatus(false)
    setfocus(focus)
  };

  const checkResult = async () => {
    if (searchQuery.length === 0) return;
    setLoading(true);
    const formData = {
      nameSearch: searchQuery
    };
    try {
      const response = await postData('maps/getSearchLocation', formData);
      setResult(response?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      checkResult();
    }, 1000); // 1 detik delay

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
        {iconNameDes && (
          <Ionicons name={iconNameDes} size={24} color={COLORS.text} />
        )}
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={styles.dropdownText} numberOfLines={2} ellipsizeMode="tail">
          {selectedValue === "" ? items.find(item => item.value === value)?.label : selectedValue}
        </Text>
        <View style={{ flex: 1 }}></View>
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
            <TextInput
              style={styles.searchInput}
              placeholder="Cari Lokasi..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <View>
                {result.length === 0 &&
                   <View style={{ marginTop: height/6, justifyContent: 'center', alignItems: 'center', flexDirection:'row' }}>
                    <Text style={styles.itemText}>Klik Cari Lokasi untuk mencari alamat</Text>
                  </View>
                }
                {result.length > 0 &&
                  <FlatList
                    data={result}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.item} onPress={() => handleSelectItem(item)}>
                        <Text style={styles.itemText}>{item.description}</Text>
                      </TouchableOpacity>
                    )}
                  />
                }
              </View>
            )}
          </View>
          <View style={COMPONENT_STYLES.spacer} />
          <ButtonComponent title={"Cari Lewat Peta"} onPress={() => handleChoiceMapItem()} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
    marginBottom: SPACING.small,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.small,
  },
  dropdownText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
    width: width - 150
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    height: '50%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.small,
    marginBottom: SPACING.small,
    fontSize: FONT_SIZES.small,
    color: COLORS.text,
    fontFamily: FONT_FAMILIES.regular,
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

export default DropdownSearchComponent;
