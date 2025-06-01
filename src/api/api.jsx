import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL API
const API_URL = 'https://beres-backend-609517395039.asia-southeast2.run.app/api/v1/';
// const API_URL = 'http://192.168.156.46:5000/api/v1/';


// Membuat instance Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 100000, // Timeout 10 detik
});

// Interceptor untuk menambahkan accessToken ke setiap request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Pastikan tidak menimpa Content-Type untuk multipart/form-data
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return Promise.reject(data?.errorMessage.Error); // Kembalikan error untuk ditangani di tempat lain
          console.error('❌ [400] Bad Request:', data?.errorMessage.Error || 'Permintaan tidak valid');
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
          return Promise.reject(data?.errorMessage.Error);
          console.error('🔥 [500] Server Error:', data?.message || 'Terjadi kesalahan pada server');
          break;
        default:
          return Promise.reject(data?.errorMessage.Error);
          console.error(`⚠️ [${status}] Error tidak terduga:`, data?.message || 'Terjadi kesalahan');
      }
    } else if (error.request) {
      console.error('⏳ Tidak ada respons dari server, periksa koneksi jaringan Anda');
    } else {
      console.error('⚠️ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Fungsi untuk mendapatkan token dari AsyncStorage
const getToken = async () => {
  return await AsyncStorage.getItem('accessTokens');
};

export default api;
