import React, { useRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  BackHandler,
  Alert,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';

const MyWebScreen = () => {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle back button
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current && !hasError) {
        webviewRef.current.goBack();
        return true;
      } else {
        Alert.alert(
          'Keluar Aplikasi',
          'Apakah kamu yakin ingin keluar?',
          [
            { text: 'Batal', style: 'cancel' },
            { text: 'Keluar', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [canGoBack, hasError]);

  const handleReload = () => {
    setHasError(false);
    webviewRef.current.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#214937" barStyle="dark-content" />

      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tidak ada koneksi internet</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
            <Text style={styles.reloadText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          source={{ uri: 'https://beres.co.id' }}
          javaScriptEnabled
          domStorageEnabled
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
          onError={() => setHasError(true)}
          onHttpError={() => setHasError(true)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#214937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reloadText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MyWebScreen;
