import React, { useState } from 'react';
import {
  Outlet,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  LayoutDashboard,
  FileText,
  LogOut,
  Users,
  Menu,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

import logoInstansi from '../assets/logo-diskominfo.jpg';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();

  // =========================================================
  // USER
  // =========================================================
  const userString = localStorage.getItem('user');

  const user = userString
    ? JSON.parse(userString)
    : { name: 'User', role: 'guest' };

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // =========================================================
  // INITIAL USER
  // =========================================================
  const getInitials = (name = 'User') => {
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // =========================================================
  // MENU
  // =========================================================
  // Dashboard dan Rekap Data bisa diakses semua role.
  // Manajemen Pengguna hanya muncul untuk Admin.
  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Rekap Data',
      path: '/rekap-data',
      icon: FileText,
    },

    ...(user.role === 'admin'
      ? [
          {
            label: 'Manajemen Pengguna',
            path: '/manajemen-pengguna',
            icon: Users,
          },
        ]
      : []),
  ];

  // =========================================================
  // NAVIGATION CLASS
  // =========================================================
  const getNavClass = ({ isActive }) => {
    return `
      group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150
      ${
        isActive
          ? 'bg-white/10 text-white border-l-2 border-white'
          : 'text-blue-100 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
      }
    `;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`
          bg-[#0B4A99] text-white flex flex-col shrink-0 overflow-hidden transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-[72px]'}
        `}
      >

        {/* ===================================================
            SIDEBAR HEADER
        ==================================================== */}
        <div
          className={`
            h-16 border-b border-white/10 flex items-center shrink-0
            ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}
          `}
        >

          {isSidebarOpen && (
            <div className="flex items-center gap-3 min-w-0">

              {/* LOGO */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border-2 border-white/20">
                <img
                  src={logoInstansi}
                  alt="Logo Diskominfo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 mt-0.5">
                <div className="text-[15px] font-bold tracking-wider truncate">
                  SANDIKAMI
                </div>
              </div>

            </div>
          )}

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-blue-200 hover:bg-white/10 hover:text-white transition-colors focus:outline-none flex-shrink-0"
            title={isSidebarOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <Menu size={20} />
          </button>

        </div>

        {/* ===================================================
            MENU NAVIGASI
        ==================================================== */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

          {isSidebarOpen && (
            <div className="px-3 pb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                Menu Utama
              </p>
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={getNavClass}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  className="shrink-0"
                />

                {isSidebarOpen && (
                  <span className="truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* ===================================================
            INFORMASI INSTANSI
        ==================================================== */}
        {isSidebarOpen && (
          <div className="px-3 pb-3">

            <div className="border border-white/10 bg-white/5 rounded-md p-3">

              <div className="flex items-start gap-2">

                <ShieldCheck
                  size={16}
                  className="text-blue-200 mt-0.5 shrink-0"
                />

                <div>

                  <p className="text-[11px] font-semibold text-white">
                    Persandian & Keamanan Informasi
                  </p>

                  <p className="text-[10px] text-blue-200 mt-1 leading-relaxed">
                    Sistem monitoring layanan sertifikat elektronik.
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================
            LOGOUT
        ==================================================== */}
        <div className="p-3 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-colors"
            title={!isSidebarOpen ? 'Keluar' : undefined}
          >

            <LogOut
              size={19}
              strokeWidth={1.8}
              className="shrink-0"
            />

            {isSidebarOpen && (
              <span>
                Keluar Sistem
              </span>
            )}

          </button>

        </div>

      </aside>

      {/* =====================================================
          AREA KANAN
      ====================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ===================================================
            HEADER ATAS
        ==================================================== */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">

          <div className="flex items-center gap-3">

            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>
            )}

            <div className="hidden md:block">

              <p className="text-xs text-slate-400">
                Sistem Informasi
              </p>

              <p className="text-sm font-semibold text-slate-700">
                Monitoring Sertifikat Elektronik
              </p>

            </div>

          </div>

          {/* =================================================
              PROFILE
          ================================================== */}
          <div className="relative">

            <button
              onClick={() =>
                setIsProfileDropdownOpen(
                  !isProfileDropdownOpen
                )
              }
              className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors focus:outline-none"
            >

              <div className="text-right hidden sm:block">

                <div className="text-sm font-semibold text-slate-700">
                  {user.name}
                </div>

                <div className="text-[11px] text-slate-400 capitalize">
                  {user.role}
                </div>

              </div>

              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-[#0B4A99]">
                {getInitials(user.name)}
              </div>

              <ChevronDown
                size={15}
                className={`text-slate-400 transition-transform ${
                  isProfileDropdownOpen
                    ? 'rotate-180'
                    : ''
                }`}
              />

            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}
            {isProfileDropdownOpen && (
              <>

                <div
                  className="fixed inset-0 z-40"
                  onClick={() =>
                    setIsProfileDropdownOpen(false)
                  }
                />

                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden">

                  <div className="px-4 py-3 border-b border-slate-100">

                    <p className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>

                    <p className="text-xs text-slate-500 capitalize mt-0.5">
                      {user.role}
                    </p>

                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >

                    <LogOut size={16} />

                    <span>
                      Keluar Sistem
                    </span>

                  </button>

                </div>

              </>
            )}

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 bg-slate-50">
          <Outlet />
        </main>

      </div>

    </div>
  );
}