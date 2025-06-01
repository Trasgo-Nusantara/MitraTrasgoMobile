import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

const FloatingButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.fab} onPress={onPress}>
            <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#214937',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    plus: {
        color: '#fff',
        fontSize: 32,
        lineHeight: 32
    }
});

export default FloatingButton;
