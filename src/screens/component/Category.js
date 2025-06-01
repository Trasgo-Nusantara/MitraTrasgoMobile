import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const categories = [
  { key: 'Patungan', label: 'Patungan', icon: 'store' },
  { key: 'Arisan', label: 'Arisan', icon: 'gold' },
  { key: 'Koperasi', label: 'Koperasi', icon: 'home' },
  { key: 'Sedekah', label: 'Sedekah', icon: 'mosque' },
];

const CategorySelector = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handlePress = (category) => {
    setSelected(category.key);
    if (onSelect) onSelect(category.key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.button]}
            onPress={() => handlePress(cat)}
          >
            <MaterialCommunityIcons
              name={cat.icon}
              size={28}
              color={'#555'}
              style={styles.icon}
            />
            <Text style={[styles.text]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    justifyContent:"center"
  },
  scrollContainer: {
    flexDirection:'row'
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    width: 80,
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#214937',
  },
  icon: {
    marginBottom: 4,
  },
  text: {
    color: '#555',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
  },
});

export default CategorySelector;
