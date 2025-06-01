import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TextInputStandardComponent = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  iconName, 
  iconSize = 24, 
  iconColor = COLORS.textDark, 
  errorMessage, 
  style, 
  ...props 
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {iconName && (
          <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.textDarkShadow}
          {...props}
        />
      </View>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.large,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDarkShadow,
    fontFamily: FONT_FAMILIES.regular,
    marginBottom: SPACING.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.small,
  },
  icon: {
    marginRight: SPACING.small,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDarkShadow,
    fontFamily: FONT_FAMILIES.regular,
  },
  error: {
    fontSize: FONT_SIZES.small,
    color: 'red',
    marginTop: SPACING.small,
  }
});

export default TextInputStandardComponent;