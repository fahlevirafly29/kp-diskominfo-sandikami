import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RekapData from './pages/RekapData';
import DataPenolakan from './pages/DataPenolakan'; 
import ManajemenPengguna from './pages/ManajemenPengguna';

// Komponen Satpam
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/manajemen-pengguna" element={<ManajemenPengguna />} />
          <Route path="rekap-data" element={<RekapData />} />
          {/* 2. INI JALUR YANG TADI HILANG/BELUM TERBACA */}
          <Route path="data-penolakan" element={<DataPenolakan />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;