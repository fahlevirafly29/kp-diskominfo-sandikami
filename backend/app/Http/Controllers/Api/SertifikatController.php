<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sertifikat;
use Illuminate\Http\Request;

class SertifikatController extends Controller
{
    // Mengambil data untuk Grafik & Tabel (Sudah support Filter Tanggal & Tampil Semua di Awal)
    public function index(Request $request)
    {
        $query = Sertifikat::query();

        // UBAHAN KECIL: Gunakan filled() bukan has().
        // Jika form tanggal di React kosong, kondisi ini akan dilewati dan memanggil seluruh data.
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        // Urutkan dari tanggal paling lama ke terbaru untuk sumbu X grafik (biarkan aslinya)
        $data = $query->orderBy('tanggal', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    // Menyimpan atau Update data harian (TIDAK DIUBAH - Sudah Sangat Bagus)
    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'terbit_baru' => 'numeric',
            'diperpanjang' => 'numeric',
            'dicabut' => 'numeric',
            'dihentikan' => 'numeric',
        ]);

        // updateOrCreate: Kalau tanggal sudah ada, update datanya. Kalau belum, buat baru.
        $sertifikat = Sertifikat::updateOrCreate(
            ['tanggal' => $request->tanggal],
            [
                'terbit_baru' => $request->terbit_baru ?? 0,
                'diperpanjang' => $request->diperpanjang ?? 0,
                'dicabut' => $request->dicabut ?? 0,
                'dihentikan' => $request->dihentikan ?? 0,
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Data sertifikat berhasil disimpan!',
            'data' => $sertifikat
        ]);
    }

    // Menghapus data berdasarkan ID (TIDAK DIUBAH)
    public function destroy($id)
    {
        $sertifikat = Sertifikat::find($id);

        if (!$sertifikat) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $sertifikat->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil dihapus'
        ]);
    }
}