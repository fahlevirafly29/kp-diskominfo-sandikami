import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Edit, Trash2, X } from 'lucide-react';

export default function RekapData() {
  const [dataRekap, setDataRekap] = useState([]);
  
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === 'admin';

  const [formData, setFormData] = useState({
    tanggal: '', jml_permohonan: 0, status_terbit_baru: 0, jml_penolakan: 0, jml_sertifikat_aktif: 0
  });

  // State baru untuk mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchRekap = async () => {
    try {
      const response = await api.get('/rekap-layanan');
      setDataRekap(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, []);

  // Fungsi dinamis: Bisa untuk Simpan Baru, bisa untuk Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/rekap-layanan/${editId}`, formData);
        alert('Data berhasil diperbarui!');
      } else {
        await api.post('/rekap-layanan', formData);
        alert('Data berhasil disimpan!');
      }
      resetForm();
      fetchRekap();
    } catch (error) {
      alert('Gagal memproses data! Pastikan input valid.');
    }
  };

  // Fungsi untuk mengisi form dengan data yang mau diedit
  const handleEdit = (item) => {
    setFormData({
      tanggal: item.tanggal,
      jml_permohonan: item.jml_permohonan,
      status_terbit_baru: item.status_terbit_baru,
      jml_penolakan: item.jml_penolakan,
      jml_sertifikat_aktif: item.jml_sertifikat_aktif
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus rekap data ini?')) {
      try {
        await api.delete(`/rekap-layanan/${id}`);
        alert('Data berhasil dihapus!');
        fetchRekap();
      } catch (error) {
        alert('Gagal menghapus data!');
      }
    }
  };

  // Fungsi mengembalikan form ke kondisi kosong
  const resetForm = () => {
    setFormData({ tanggal: '', jml_permohonan: 0, status_terbit_baru: 0, jml_penolakan: 0, jml_sertifikat_aktif: 0 });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Rekap Data</h1>
        <p className="text-slate-500">
          {isAdmin ? "Input dan kelola rekapitulasi layanan harian." : "Laporan riwayat data layanan harian."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? "Edit Data" : "Input Data Baru"}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="text-slate-400 hover:text-red-500" title="Batal Edit">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Tanggal</label>
                <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Jml Permohonan</label>
                <input type="number" required min="0" value={formData.jml_permohonan} onChange={(e) => setFormData({...formData, jml_permohonan: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Sertifikat Terbit</label>
                <input type="number" required min="0" value={formData.status_terbit_baru} onChange={(e) => setFormData({...formData, status_terbit_baru: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Ditolak</label>
                <input type="number" required min="0" value={formData.jml_penolakan} onChange={(e) => setFormData({...formData, jml_penolakan: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Total Aktif Saat Ini</label>
                <input type="number" required min="0" value={formData.jml_sertifikat_aktif} onChange={(e) => setFormData({...formData, jml_sertifikat_aktif: e.target.value})} className="w-full p-2 border rounded-lg bg-purple-50" />
              </div>
              <button type="submit" className={`w-full text-white font-bold py-2 rounded-lg transition-colors ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isEditing ? "Update Data" : "Simpan Data"}
              </button>
            </form>
          </div>
        )}

        <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${isAdmin ? 'col-span-2' : 'col-span-3'}`}>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Riwayat Data Terakhir</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Permohonan</th>
                  <th className="py-3 px-4">Terbit</th>
                  <th className="py-3 px-4">Ditolak</th>
                  <th className="py-3 px-4">Total Aktif</th>
                  {isAdmin && <th className="py-3 px-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {dataRekap.length === 0 ? (
                  <tr><td colSpan={isAdmin ? "6" : "5"} className="text-center py-8 text-slate-400">Belum ada data.</td></tr>
                ) : (
                  dataRekap.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{item.tanggal}</td>
                      <td className="py-3 px-4">{item.jml_permohonan}</td>
                      <td className="py-3 px-4 text-green-600">{item.status_terbit_baru}</td>
                      <td className="py-3 px-4 text-red-600">{item.jml_penolakan}</td>
                      <td className="py-3 px-4 text-purple-600 font-bold">{item.jml_sertifikat_aktif}</td>
                      {isAdmin && (
                        <td className="py-3 px-4 flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-1.5 bg-amber-100 text-amber-600 rounded hover:bg-amber-200" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Hapus">
                            <Trash2 size={16} />
                          </button>
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