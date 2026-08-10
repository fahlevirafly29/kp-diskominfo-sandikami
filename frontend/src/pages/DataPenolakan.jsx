import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2 } from 'lucide-react';

export default function DataPenolakan() {
  const [dataPenolakan, setDataPenolakan] = useState([]);
  const [formData, setFormData] = useState({ tanggal: '', alasan: '', jumlah: 0 });
  
  // Variabel untuk mengecek admin (Anti-Crash)
  let isAdmin = false;
  try {
    const userString = localStorage.getItem('user');
    if (userString && userString !== 'undefined') {
      const user = JSON.parse(userString);
      isAdmin = user?.role === 'admin';
    }
  } catch (error) {
    console.error("Gagal membaca profil user:", error);
  }

  const fetchData = async () => {
    try {
      const response = await api.get('/alasan-penolakan');
      setDataPenolakan(response?.data?.data || []);
    } catch (error) {
      console.error("Gagal mengambil data penolakan");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alasan-penolakan', formData);
      alert('Alasan penolakan berhasil disimpan!');
      setFormData({ tanggal: '', alasan: '', jumlah: 0 });
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan data!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data ini?')) {
      try {
        await api.delete(`/alasan-penolakan/${id}`);
        fetchData();
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analisis Penolakan</h1>
        <p className="text-slate-500">Rincian faktor penyebab penolakan sertifikat elektronik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORM INPUT */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Input Alasan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Tanggal</label>
                <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Alasan Penolakan</label>
                <select required value={formData.alasan} onChange={(e) => setFormData({...formData, alasan: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="">-- Pilih Alasan --</option>
                  <option value="Dokumen Buram/Tidak Terbaca">Dokumen Buram/Tidak Terbaca</option>
                  <option value="KTP Kadaluarsa">KTP Kadaluarsa</option>
                  <option value="Salah Format Surat Rekomendasi">Salah Format Surat Rekomendasi</option>
                  <option value="SK CPNS/PNS Tidak Sesuai">SK CPNS/PNS Tidak Sesuai</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Jumlah Kasus</label>
                <input type="number" required min="1" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">Simpan Data</button>
            </form>
          </div>
        )}

        {/* TABEL DATA */}
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${isAdmin ? 'col-span-2' : 'col-span-3'}`}>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Riwayat Penolakan Terakhir</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Alasan</th>
                  <th className="py-3 px-4 text-center">Jumlah Kasus</th>
                  {isAdmin && <th className="py-3 px-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {dataPenolakan.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 4 : 3} className="text-center py-8 text-slate-400">Belum ada data.</td></tr>
                ) : (
                  dataPenolakan.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.tanggal}</td>
                      <td className="py-3 px-4">{item.alasan}</td>
                      <td className="py-3 px-4 text-center font-bold text-red-500">{item.jumlah}</td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}