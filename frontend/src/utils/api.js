import axios from 'axios';

// Membuat "kurir" khusus dengan alamat tujuan utama ke Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
});

// Menyelipkan Token otomatis ke dalam setiap pengiriman
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Cek saku browser, ada token tidak?
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Kalau ada, tempelkan!
  }
  return config;
});

export default api;