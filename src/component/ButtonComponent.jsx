// filepath: /Users/hilmanzu/Documents/mobileReact/Trasgo/src/component/ButtonComponent.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ButtonComponent = ({ title, onPress, iconName, iconSize = 24, iconColor = COLORS.text, style, isLoading = false }) => {
  return (
    <TouchableOpacity disabled={isLoading} style={[styles.button, style]} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator color={COLORS.background} />
      ) : (
        <>
          {iconName && (
            <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
          )}
          <Text style={styles.buttonText}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const ButtonSecondaryComponent = ({ title, onPress, iconName, iconSize = 24, iconColor = COLORS.text, style }) => {
  return (
    <TouchableOpacity style={[styles.buttonSecondary, style]} onPress={onPress}>
      {iconName && (
        <Ionicons name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
      )}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium
  },
  buttonText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.background,
    fontFamily: FONT_FAMILIES.regular,
  },
  icon: {
    marginRight: SPACING.small,
  },
});

export{
  ButtonComponent,
  ButtonSecondaryComponent
}