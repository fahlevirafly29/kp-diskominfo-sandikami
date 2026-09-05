import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RekapData from './pages/RekapData';
import DataPenolakan from './pages/DataPenolakan';
import ManajemenPengguna from './pages/ManajemenPengguna';

// =========================================================
// PROTECTED ROUTE
// =========================================================
// Mengecek apakah user sudah login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// =========================================================
// ADMIN ONLY ROUTE
// =========================================================
// Hanya Admin yang boleh mengakses halaman tertentu
const AdminOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  // Belum login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Tidak ada data user
  if (!userString) {
    return <Navigate to="/dashboard" replace />;
  }

  let user;

  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error('Data user tidak valid:', error);
    return <Navigate to="/dashboard" replace />;
  }

  // Bukan Admin
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// =========================================================
// APP
// =========================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            LOGIN
        ================================================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            SEMUA HALAMAN YANG MEMBUTUHKAN LOGIN
        ================================================== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* Default */}
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* Rekap Data */}
          <Route
            path="rekap-data"
            element={<RekapData />}
          />

          {/* Data Penolakan */}
          <Route
            path="data-penolakan"
            element={<DataPenolakan />}
          />

          {/* =================================================
              MANAJEMEN PENGGUNA
              HANYA ADMIN
          ================================================== */}
          <Route
            path="manajemen-pengguna"
            element={
              <AdminOnlyRoute>
                <ManajemenPengguna />
              </AdminOnlyRoute>
            }
          />

        </Route>

        {/* =================================================
            URL TIDAK DITEMUKAN
        ================================================== */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;