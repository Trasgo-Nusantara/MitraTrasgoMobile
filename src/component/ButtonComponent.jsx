// filepath: /Users/hilmanzu/Documents/mobileReact/Trasgo/src/component/ButtonComponent.jsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, PanResponder, View, Alert } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES } from '../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getData, postData } from '../api/service';

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


const ButtonSlideComponent = ({ title, onSlideComplete, style }) => {
  const [slideAnim] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx >= 0) {
        slideAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 150) { // Jika geser cukup jauh, eksekusi aksi
        onSlideComplete();
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={[styles.slideButtonContainer, style]}>
      <Animated.View
        style={[styles.slider, { transform: [{ translateX: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.sliderText}>➡</Text>
      </Animated.View>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  );
};

const ToggleButtonComponent = ({
  titleOn = "Aktif",
  titleOff = "Nonaktif",
  iconOn = "checkmark-circle",
  iconOff = "close-circle",
  onToggle,
  balance,
  style
}) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = async () => {
    if(balance >= 3000){
      const newState = !isToggled;
      setIsToggled(newState);
      await postData('auth/updateStatusDriver',{isStandby: newState});
      detailOrder()
      if (onToggle) {
        onToggle(newState);
      }
    }else{
      Alert.alert("Opss","Deposit kurang, mohon topup ke admin Trasgo dii button Pengaturan Deposit")
    }
  };

  const detailOrder = async () => {
      try {
        if(balance <= 0)
        {
          setIsToggled(false)
        }else{
          var response = await getData('auth/updateStatusDriver');
          setIsToggled(response.data.isStandby)
        }
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    detailOrder();
  }, []);

  return (
    <TouchableOpacity
      style={[styles.toggleButton, isToggled ? styles.buttonOn : styles.buttonOff, style]}
      onPress={handleToggle}
    >
      <Ionicons
        name={isToggled ? iconOn : iconOff}
        size={24}
        color={COLORS.background}
        style={styles.icon}
      />
      <Text style={styles.buttonText}>{isToggled ? titleOn : titleOff}</Text>
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
  slideButtonContainer: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  slider: {
    width: 59,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    position: 'absolute',
    left: 5,
    top: 5,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderText: {
    fontSize: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
  },
  buttonOn: {
    backgroundColor: COLORS.success, // Warna hijau saat aktif
  },
  buttonOff: {
    backgroundColor: COLORS.warning, // Warna merah saat nonaktif
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

export {
  ButtonComponent,
  ButtonSecondaryComponent,
  ButtonSlideComponent,
  ToggleButtonComponent
}