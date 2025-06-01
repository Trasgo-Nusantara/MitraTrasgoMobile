import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, COMPONENT_STYLES, formatRupiah } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RadioButtonChoiceGroup = ({ options, selectedValue, onSelect }) => {

  const sortedOptions = options.sort((a, b) => (a === selectedValue ? -1 : b === selectedValue ? 1 : 0));

  return (
    <View style={styles.radioGroup}>
      {sortedOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.radioButton, {
            backgroundColor: selectedValue === option ? "#37AFE110" : "#FFFFFF",
            borderWidth: 1,
            borderRadius: 10,
            borderColor: selectedValue === option ? "#37AFE1" : "#00000020",
            padding: 20,
          }]}
          onPress={() => onSelect(option)}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 50, height: 40 }}>
              {option.icon === '1' &&
                <Image source={require("../assets/trasride/motor.png")} style={[styles.icon, { width: '100%', height: '100%' }]} />
              }
              {option.icon === '2' &&
                <Image source={require("../assets/trasride/motorxl.png")} style={[styles.icon, { width: '100%', height: '100%' }]} />
              }
              {option.icon === '3' &&
                <Image source={require("../assets/trasride/mobil.png")} style={[styles.icon, { width: '100%', height: '100%' }]} />
              }
              {option.icon === '4' &&
                <Image source={require("../assets/trasride/mobilxl.png")} style={[styles.icon, { width: '100%', height: '100%' }]} />
              }
              {option.icon === '5' &&
                <Image source={require("../assets/trasride/mobilxl.png")} style={[styles.icon, { width: '100%', height: '100%' }]} />
              }
            </View>
            <View style={COMPONENT_STYLES.spacer} />
            <View>
              <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '700' }]}>{option.name}</Text>
            <Text style={[COMPONENT_STYLES.textSmall]}>{option.penumpang} <Ionicons name={"person"} size={10} color={COLORS.text} /></Text>
              <Text style={[COMPONENT_STYLES.textSmall, { fontSize: 10 }]}>{option.desc}</Text>

            </View>
          </View>
          <View>
            <Text style={[COMPONENT_STYLES.textMedium, { textAlign: 'right' }]}>Rp {formatRupiah(option.harga)}</Text>
              <Text style={[COMPONENT_STYLES.textSmall, { textAlign: 'right' }]}>{Math.ceil(parseInt(option.durasi)/60)} Menit</Text>
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
    marginVertical: 5,
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
  icon: {
    resizeMode: 'stretch'
  }
});

export default RadioButtonChoiceGroup;
