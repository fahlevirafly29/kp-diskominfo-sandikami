import React, { useState, useEffect } from 'react';
import { Users, FileCheck, XCircle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api'; 

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#3b82f6'];

const KpiCard = ({ title, angka, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-5">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{angka}</h3>
    </div>
  </div>
);

export default function Dashboard() {
  const [dataGrafik, setDataGrafik] = useState([]);
  const [pieData, setPieData] = useState([]); 
  const [kpi, setKpi] = useState({ totalPermohonan: 0, totalTerbit: 0, totalTolak: 0, totalAktif: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- 1. PROSES DATA REKAP ---
        const resRekap = await api.get('/rekap-layanan');
        const dataDB = resRekap?.data?.data || [];

        // Hitung total untuk Kotak KPI Atas (Tetap total keseluruhan)
        let permohonan = 0, terbit = 0, tolak = 0, aktif = 0;
        dataDB.forEach(item => {
          permohonan += parseInt(item.jml_permohonan) || 0;
          terbit += parseInt(item.status_terbit_baru) || 0;
          tolak += parseInt(item.jml_penolakan) || 0;
          aktif += parseInt(item.jml_sertifikat_aktif) || 0;
        });

        setKpi({ totalPermohonan: permohonan, totalTerbit: terbit, totalTolak: tolak, totalAktif: aktif });

        // LOGIKA BARU: Mengelompokkan Data Harian Menjadi BULANAN
        const rekapanBulanan = dataDB.reduce((acc, curr) => {
          // Ubah format "2026-07-21" menjadi "Jul 2026"
          const dateObj = new Date(curr.tanggal);
          const namaBulan = dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

          // Cek apakah bulan ini sudah ada di dalam keranjang?
          const existing = acc.find(item => item.tanggal === namaBulan);
          
          const jmlPermohonan = parseInt(curr.jml_permohonan) || 0;
          const jmlTerbit = parseInt(curr.status_terbit_baru) || 0;
          const jmlTolak = parseInt(curr.jml_penolakan) || 0;

          if (existing) {
            // Kalau bulan sudah ada, jumlahkan angkanya
            existing.permohonan += jmlPermohonan;
            existing.terbit += jmlTerbit;
            existing.tolak += jmlTolak;
          } else {
            // Kalau bulan belum ada, buat keranjang bulan baru
            acc.push({
              tanggal: namaBulan, // Teks bawah grafik jadi "Jul 2026"
              permohonan: jmlPermohonan,
              terbit: jmlTerbit,
              tolak: jmlTolak,
              _rawDate: dateObj // Tanggal mentah untuk keperluan mengurutkan
            });
          }
          return acc;
        }, []);

        // Urutkan grafik dari bulan terlama di kiri, ke terbaru di kanan
        rekapanBulanan.sort((a, b) => a._rawDate - b._rawDate);

        // Masukkan data yang sudah jadi bulanan ke grafik
        setDataGrafik(rekapanBulanan);

        // --- 2. PROSES DATA PENOLAKAN (Pie Chart) ---
        const resPenolakan = await api.get('/alasan-penolakan');
        const dataPenolakanDB = resPenolakan?.data?.data || [];
        
        const groupedPie = dataPenolakanDB.reduce((acc, curr) => {
          const jumlahAngka = parseInt(curr.jumlah) || 0;
          const existing = acc.find(item => item.name === curr.alasan);
          if (existing) {
            existing.value += jumlahAngka; 
          } else {
            acc.push({ name: curr.alasan, value: jumlahAngka }); 
          }
          return acc;
        }, []);
        
        setPieData(groupedPie);

      } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Memuat data Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Utama</h1>
        <p className="text-slate-500">Ringkasan pemanfaatan layanan sertifikat elektronik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Permohonan" angka={kpi.totalPermohonan} icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <KpiCard title="Sertifikat Terbit" angka={kpi.totalTerbit} icon={FileCheck} colorClass="bg-green-100 text-green-600" />
        <KpiCard title="Permohonan Ditolak" angka={kpi.totalTolak} icon={XCircle} colorClass="bg-red-100 text-red-600" />
        <KpiCard title="Sertifikat Aktif" angka={kpi.totalAktif} icon={Activity} colorClass="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Tren Permohonan (Per Bulan)</h2>
          {dataGrafik.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
              <Activity size={48} className="mb-3 opacity-50" />
              <p>Belum ada data rekap layanan.</p>
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrafik}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tanggal" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="permohonan" name="Permohonan Masuk" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="terbit" name="Sertifikat Terbit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tolak" name="Ditolak" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Faktor Penolakan Utama</h2>
          {pieData.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
               <XCircle size={48} className="mb-3 opacity-50" />
               <p>Belum ada data penolakan.</p>
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}