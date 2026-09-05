import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Edit, Trash2, X, FileText, Database } from 'lucide-react';

export default function RekapData() {
  const [dataRekap, setDataRekap] = useState([]);

  // Ambil data user yang sedang login
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Admin dan Petugas boleh mengelola data
  const canManageData =
    user?.role === 'admin' || user?.role === 'petugas';

  const [formData, setFormData] = useState({
    tanggal: '',
    terbit_baru: 0,
    diperpanjang: 0,
    dicabut: 0,
    dihentikan: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // =====================================================
  // AMBIL DATA REKAP
  // =====================================================
  const fetchRekap = async () => {
    try {
      const response = await api.get('/sertifikat');

      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      );

      setDataRekap(sortedData);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, []);

  // =====================================================
  // SIMPAN / UPDATE DATA
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update data
        await api.put(`/rekap-layanan/${editId}`, formData);
        alert('Data berhasil diperbarui!');
      } else {
        // Tambah data
        await api.post('/sertifikat', formData);
        alert('Data berhasil disimpan!');
      }

      resetForm();
      fetchRekap();
    } catch (error) {
      console.error('Error proses data:', error);
      alert('Gagal memproses data! Pastikan input valid.');
    }
  };

  // =====================================================
  // EDIT DATA
  // =====================================================
  const handleEdit = (item) => {
    setFormData({
      tanggal: item.tanggal,
      terbit_baru: item.terbit_baru,
      diperpanjang: item.diperpanjang,
      dicabut: item.dicabut,
      dihentikan: item.dihentikan
    });

    setIsEditing(true);
    setEditId(item.id);
  };

  // =====================================================
  // HAPUS DATA
  // =====================================================
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus rekap data ini?')) {
      try {
        await api.delete(`/sertifikat/${id}`);

        alert('Data berhasil dihapus!');

        fetchRekap();
      } catch (error) {
        console.error('Error delete:', error);

        alert(
          'Gagal menghapus data! Pastikan Anda memiliki izin.'
        );
      }
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================
  const resetForm = () => {
    setFormData({
      tanggal: '',
      terbit_baru: 0,
      diperpanjang: 0,
      dicabut: 0,
      dihentikan: 0
    });

    setIsEditing(false);
    setEditId(null);
  };

  // =====================================================
  // FORMAT TANGGAL
  // =====================================================
  const formatTanggalTabel = (tanggalStr) => {
    if (!tanggalStr) return '-';

    const date = new Date(tanggalStr);

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER HALAMAN
      ================================================= */}
      <div className="flex items-center gap-3 mb-2">

        <div className="p-2.5 bg-blue-50 text-[#0B4A99] rounded-lg">
          <FileText size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manajemen Rekap Data
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {canManageData
              ? 'Input dan kelola rekapitulasi layanan sertifikat elektronik.'
              : 'Laporan riwayat data layanan sertifikat elektronik.'}
          </p>
        </div>

      </div>


      {/* =================================================
          GRID UTAMA
      ================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        {/* =================================================
            FORM INPUT
            ADMIN + PETUGAS
        ================================================= */}
        {canManageData && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 h-fit">

            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">

              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">

                <Database
                  size={18}
                  className="text-[#0B4A99]"
                />

                {isEditing
                  ? 'Edit Data Layanan'
                  : 'Input Data Baru'}

              </h2>

              {isEditing && (
                <button
                  onClick={resetForm}
                  className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
                  title="Batal Edit"
                >
                  <X size={18} />
                </button>
              )}

            </div>


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* TANGGAL */}
              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Tanggal Laporan
                </label>

                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggal: e.target.value
                    })
                  }
                  disabled={isEditing}
                  className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700 disabled:bg-slate-100 disabled:text-slate-500"
                />

              </div>


              {/* INPUT ANGKA */}
              <div className="grid grid-cols-2 gap-4">

                {/* TERBIT BARU */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Terbit Baru
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.terbit_baru}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terbit_baru: e.target.value
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700"
                  />

                </div>


                {/* DIPERPANJANG */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Diperpanjang
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.diperpanjang}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diperpanjang: e.target.value
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700"
                  />

                </div>


                {/* DICABUT */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Dicabut
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.dicabut}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dicabut: e.target.value
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700"
                  />

                </div>


                {/* DIHENTIKAN */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Dihentikan
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.dihentikan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dihentikan: e.target.value
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:border-[#0B4A99] focus:ring-1 focus:ring-[#0B4A99] outline-none text-sm text-slate-700"
                  />

                </div>

              </div>


              {/* TOMBOL SIMPAN / UPDATE */}
              <button
                type="submit"
                className={`w-full text-white font-bold py-2.5 rounded-md transition-colors mt-2 shadow-sm text-sm ${
                  isEditing
                    ? 'bg-[#F59E0B] hover:bg-[#D97706]'
                    : 'bg-[#0B4A99] hover:bg-[#083670]'
                }`}
              >
                {isEditing
                  ? 'Update Data'
                  : 'Simpan Data'}
              </button>

            </form>

          </div>
        )}


        {/* =================================================
            TABEL RIWAYAT
        ================================================= */}
        <div
          className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 ${
            canManageData
              ? 'col-span-2'
              : 'col-span-3'
          }`}
        >

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-base font-bold text-slate-800">
              Riwayat Pencatatan
            </h2>

            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Total: {dataRekap.length} Hari
            </span>

          </div>


          {/* TABEL */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">

            <table className="w-full text-sm text-left">

              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">

                <tr>

                  <th className="py-3.5 px-4 whitespace-nowrap">
                    Tanggal Laporan
                  </th>

                  <th className="py-3.5 px-4 text-center">
                    Terbit Baru
                  </th>

                  <th className="py-3.5 px-4 text-center">
                    Diperpanjang
                  </th>

                  <th className="py-3.5 px-4 text-center">
                    Dicabut
                  </th>

                  <th className="py-3.5 px-4 text-center">
                    Dihentikan
                  </th>

                  {canManageData && (
                    <th className="py-3.5 px-4 text-center">
                      Aksi
                    </th>
                  )}

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {dataRekap.length === 0 ? (

                  <tr>

                    <td
                      colSpan={canManageData ? '6' : '5'}
                      className="text-center py-10 text-slate-400"
                    >
                      Belum ada data pencatatan yang dimasukkan.
                    </td>

                  </tr>

                ) : (

                  dataRekap.map((item) => (

                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {formatTanggalTabel(item.tanggal)}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {item.terbit_baru}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {item.diperpanjang}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {item.dicabut}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-600 font-medium">
                        {item.dihentikan}
                      </td>


                      {/* AKSI ADMIN + PETUGAS */}
                      {canManageData && (

                        <td className="py-3 px-4 flex justify-center gap-2">

                          {/* EDIT */}
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-amber-100 hover:text-amber-700 transition-colors border border-slate-200 hover:border-amber-200"
                            title="Edit Data"
                          >
                            <Edit size={15} />
                          </button>


                          {/* HAPUS */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 bg-slate-100 text-slate-600 rounded hover:bg-red-100 hover:text-red-700 transition-colors border border-slate-200 hover:border-red-200"
                            title="Hapus Data"
                          >
                            <Trash2 size={15} />
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