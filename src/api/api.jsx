import axios from 'axios';
import ModalWarning from '../component/ModalWaring';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL API
const API_URL = 'https://backendtrasgo-609517395039.asia-southeast1.run.app/api/v1/'; // Ganti dengan URL API Anda

// Membuat instance Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 100000, // Timeout 10 detik
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan accessToken ke setiap request
api.interceptors.request.use(
  async (config) => {
    try {
      // Ambil token dari penyimpanan lokal (AsyncStorage)
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Jika sukses, langsung return response
  (error) => {
    if (error.response) {
      // Jika server merespons dengan status error
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('❌ [400] Bad Request:', data?.message || 'Permintaan tidak valid');
          break;
        case 401:
          console.error('🔒 [401] Unauthorized: Token tidak valid atau kadaluarsa');
          break;
        case 403:
          console.error('🚫 [403] Forbidden: Anda tidak memiliki akses');
          break;
        case 404:
          console.error('🔍 [404] Not Found: Resource tidak ditemukan');
          break;
        case 500:
          console.error('🔥 [500] Server Error:', data?.message || 'Terjadi kesalahan pada server');
          break;
        default:
          console.error(`⚠️ [${status}] Error tidak terduga:`, data?.message || 'Terjadi kesalahan');
      }
    } else if (error.request) {
      // Jika tidak mendapat respons dari server
      console.error('⏳ Tidak ada respons dari server, periksa koneksi jaringan Anda');
    } else {
      // Jika terjadi kesalahan lain
      console.error('⚠️ Error:', error.message);
    }

    return Promise.reject(error); // Tetap lempar error agar bisa ditangani di level komponen
  }
);

// Fungsi untuk mendapatkan token (simulasi dari AsyncStorage)
const getToken = async () => {
  // Contoh: Gantilah dengan AsyncStorage atau metode penyimpanan lainnya
  const acc = await AsyncStorage.getItem('accessTokens');
  return acc; 
};

export default api;
