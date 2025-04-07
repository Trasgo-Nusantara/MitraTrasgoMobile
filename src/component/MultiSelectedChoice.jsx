import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COMPONENT_STYLES } from '../lib/constants';

const MultiSelectedChoice = ({ options = [], selected = [], onSelect }) => {
  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onSelect(selected.filter((v) => v !== value));
    } else {
      onSelect([...selected, value]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isSelected = selected.includes(option.value);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, isSelected ? styles.optionOn : styles.optionOff]}
            onPress={() => toggleOption(option.value)}
          >
            <Text style={[COMPONENT_STYLES.textMedium,styles.optionText, isSelected ? styles.textOn : styles.textOff]}>
              {option.label}
            </Text>
            <Text style={[COMPONENT_STYLES.textSmall,styles.optionText, isSelected ? styles.textOn : styles.textOff]}>
              {option.desc}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MultiSelectedChoice;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // fix: use 'column' instead of 'col'
    gap: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'left',
  },
  optionOn: {
    backgroundColor: '#4cd964',
    borderColor: '#4cd964',
  },
  optionOff: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  optionText: {
    fontWeight: '500',
  },
  textOn: {
    color: '#fff',
  },
  textOff: {
    color: '#333',
  },
});
