import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COMPONENT_STYLES } from '../lib/constants';

const RadioButtonGroup = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.radioButton} 
          onPress={() => onSelect(option)}
        >
          <View style={{flex:1, flexDirection:'row'}}>
            <Ionicons name={option.ico} size={24} color={'black'} style={styles.icon} />
            <View style={COMPONENT_STYLES.spacer} />
            <Text style={COMPONENT_STYLES.textMedium}>{option.label}</Text>
          </View>
          <View style={[styles.outerCircle, selectedValue === option.value && styles.selectedOuterCircle]}>
            {selectedValue === option.value && <View style={styles.innerCircle} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: '#007BFF',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  optionText: {
    fontSize: 16,
  },
});

export default RadioButtonGroup;
