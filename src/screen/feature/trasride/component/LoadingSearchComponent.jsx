import { Motion } from "@legendapp/motion"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { COMPONENT_STYLES } from "../../../../lib/constants"
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get('window');

const LoadingSearchComponent = () => {
    const [toggleValue, setToggleValue] = useState(1);

    useEffect(() => {
        const intervalId = setInterval(() => {
          setToggleValue(prevValue => (prevValue === 1 ? 0 : 1)); // Toggle between 1 and 0
        }, 240); // 30ms interval
    
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, []);

    return (
        <Motion.View
            animate={{
                backgroundColor:
                    toggleValue ? '#F81FEC' : '#59B0F8'
            }}
            style={styles.modalAnimateCenter}
        >
            <View>
                <Text style={[COMPONENT_STYLES.textLarge, { textAlign: 'center', color: 'white' }]}>Sedang Mencari Driver Terdekat</Text>
            </View>
        </Motion.View >
    )
}

const styles = StyleSheet.create({
    modalAnimateCenter: {
        position: 'absolute',
        top: height / 3, // Position it at the bottom
        left: 50,
        right: 50,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 5
    },
})

export {
    LoadingSearchComponent
}