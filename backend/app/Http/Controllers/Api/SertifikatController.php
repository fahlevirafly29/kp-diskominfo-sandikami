<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sertifikat;
use Illuminate\Http\Request;

class SertifikatController extends Controller
{
    // Mengambil data untuk Grafik & Tabel (Sudah support Filter Tanggal)
    public function index(Request $request)
    {
        $query = Sertifikat::query();

        // Jika ada filter rentang waktu dari React
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }

        // Urutkan dari tanggal paling lama ke terbaru untuk grafik
        $data = $query->orderBy('tanggal', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    // Menyimpan atau Update data harian
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

    // Menghapus data berdasarkan ID
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