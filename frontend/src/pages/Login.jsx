import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah halaman me-refresh
    setError(''); // Kosongkan pesan error sebelumnya

    try {
      // 1. Mengetuk pintu API Backend
      const response = await api.post('/login', {
        username: username,
        password: password
      });

      // 2. Jika sukses, simpan Token dan Data User ke Saku (localStorage)
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

      // 3. Persilakan masuk ke halaman Dashboard
      navigate('/dashboard');
      
    } catch (err) {
      // Jika salah password, tangkap errornya dari Laravel
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sandikami</h1>
          <p className="text-slate-500 text-sm mt-1">Silakan login untuk mengakses sistem</p>
        </div>

        {/* Tempat Pesan Error Muncul */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Masuk
          </button>
        </form>
        
      </div>
    </div>
  );
}