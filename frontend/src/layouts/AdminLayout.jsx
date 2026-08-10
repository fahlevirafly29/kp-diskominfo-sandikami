import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, PieChart } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  
  // Mengambil data user yang sedang login dari saku browser (localStorage)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'User', role: 'guest' };

  // Fungsi untuk Logout
  const handleLogout = () => {
    // 1. Hapus tiket dan data user dari saku
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 2. Usir kembali ke halaman login
    navigate('/login');
  };

  // Mengambil inisial nama (Misal: "Petugas Sandikami" jadi "PS")
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* SIDEBAR KIRI */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">🔐</div>
          Sandikami
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
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
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full hover:bg-slate-800 rounded-lg text-red-400 transition-colors">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </div>

      {/* AREA KANAN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* NAVBAR ATAS (Dinamis sesuai User yang Login) */}
        <header className="h-16 bg-white border-b flex items-center justify-end px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-sm text-right">
              <div className="font-bold text-slate-800">{user.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {getInitials(user.name)}
            </div>
          </div>
        </header>

        {/* KONTEN HALAMAN */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}