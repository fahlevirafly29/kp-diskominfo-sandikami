import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import logoInstansi from '../assets/logo-diskominfo.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log('==============================');
    console.log('LOGIN BUTTON TERTEKAN');
    console.log('Username:', username);
    console.log('==============================');

    setError('');
    setLoading(true);

    try {
      console.log('AKAN REQUEST KE:', '/api/login');

      const response = await api.post('/login', {
        username: username,
        password: password,
      });

      console.log('LOGIN BERHASIL');
      console.log('Status:', response.status);
      console.log('Response:', response.data);

      // Simpan token
      localStorage.setItem('token', response.data.access_token);

      // Simpan data user
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.data)
      );

      console.log('TOKEN TERSIMPAN');
      console.log('PINDAH KE DASHBOARD');

      navigate('/dashboard');
    } catch (err) {
      console.error('LOGIN GAGAL');
      console.error('Status:', err.response?.status);
      console.error('Response:', err.response?.data);
      console.error('Error:', err);

      if (err.response?.status === 401) {
        setError('Username atau password salah!');
      } else if (err.response?.status === 422) {
        setError('Username dan password wajib diisi.');
      } else if (err.response?.status === 404) {
        setError('API login tidak ditemukan.');
      } else if (err.response?.status === 500) {
        setError('Terjadi error pada server.');
      } else {
        setError('Tidak dapat terhubung ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* Logo & Judul */}
        <div className="text-center mb-8">
          <img
            src={logoInstansi}
            alt="Logo Instansi"
            className="w-24 h-auto mx-auto mb-4 object-contain"
          />

          <h1 className="text-2xl font-bold text-slate-800">
            Sandikami
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Silakan login untuk mengakses sistem
          </p>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
              placeholder="Masukkan username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

        </form>
      </div>
    </div>
  );
}