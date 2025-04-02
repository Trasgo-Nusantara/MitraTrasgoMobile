import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';



const { width } = Dimensions.get('window');

const CallScreen = () => {

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
                <Text style={[COMPONENT_STYLES.textMedium]}>Segera Hadir</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
});

export default CallScreen;
