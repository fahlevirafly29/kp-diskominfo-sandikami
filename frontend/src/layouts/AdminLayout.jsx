import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, PieChart, Users, Menu } from 'lucide-react';
import logoInstansi from '../assets/logo-diskominfo.jpg'; 

export default function AdminLayout() {
  // State untuk mengontrol sidebar terbuka/tertutup
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // Mengambil data user yang sedang login dari saku browser (localStorage)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'User', role: 'guest' };

  // Fungsi untuk Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Mengambil inisial nama
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR KIRI (Dengan Animasi Buka Tutup) */}
      <div 
        className={`bg-slate-900 text-white flex flex-col shadow-xl transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
          isSidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        {/* Inner div w-64 agar konten tidak berantakan saat proses animasi mengecil */}
        <div className="w-64 flex flex-col h-full">
            
            {/* BAGIAN HEADER SIDEBAR (LOGO BULAT) */}
            <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-3">
                <img 
                    src={logoInstansi} 
                    alt="Logo Diskominfo" 
                    className="w-9 h-9 object-contain rounded-full bg-white p-0.5" 
                />
                Sandikami
            </div>
            
            {/* MENU NAVIGASI */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
                <LayoutDashboard size={20} />
                Dashboard
            </Link>
            <Link to="/rekap-data" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
                <FileText size={20} />
                Rekap Data
            </Link>
            <Link to="/data-penolakan" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
                <PieChart size={20} />
                Data Penolakan
            </Link>
            
            {/* MENU MANAJEMEN PENGGUNA */}
            <Link to="/manajemen-pengguna" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors">
                <Users size={20} />
                Manajemen Pengguna
            </Link>
            </nav>
            
            {/* TOMBOL KELUAR */}
            <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full hover:bg-slate-800 rounded-lg text-red-400 transition-colors">
                <LogOut size={20} />
                Keluar
            </button>
            </div>
        </div>
      </div>

      {/* AREA KANAN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* NAVBAR ATAS */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm shrink-0">
          
          {/* Tombol Hamburger di Kiri */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
          >
            <Menu size={24} />
          </button>

          {/* Profil Dinamis di Kanan */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-right hidden sm:block">
              <div className="font-bold text-slate-800">{user.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {getInitials(user.name)}
            </div>
          </div>
        </header>

        {/* KONTEN HALAMAN */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}