<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekapLayanan;
use Illuminate\Http\Request;

class RekapLayananController extends Controller
{
    // 1. Menampilkan semua data (Tampil)
    public function index()
    {
        // Mengambil semua data dari database, diurutkan dari yang terbaru
        $data = RekapLayanan::orderBy('tanggal', 'desc')->get();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Data rekap layanan berhasil diambil',
            'data' => $data
        ]);
    }

    // 2. Menyimpan data baru (Tambah)
    public function store(Request $request)
    {
        // Menyimpan data yang dikirim dari React ke database
        $rekap = RekapLayanan::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data rekap layanan berhasil ditambahkan',
            'data' => $rekap
        ], 201);
    }

    // 3. Menampilkan satu data spesifik berdasarkan ID (Lihat Detail)
    public function show(string $id)
    {
        $rekap = RekapLayanan::find($id);

        if (!$rekap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail data rekap layanan',
            'data' => $rekap
        ]);
    }

    // 4. Mengubah data (Edit)
    public function update(Request $request, string $id)
    {
        $rekap = RekapLayanan::find($id);

        if (!$rekap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        // Memperbarui data dengan inputan baru dari React
        $rekap->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data rekap layanan berhasil diperbarui',
            'data' => $rekap
        ]);
    }

    // 5. Menghapus data (Hapus)
    public function destroy(string $id)
    {
        $rekap = RekapLayanan::find($id);

        if (!$rekap) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $rekap->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data rekap layanan berhasil dihapus'
        ]);
    }
}