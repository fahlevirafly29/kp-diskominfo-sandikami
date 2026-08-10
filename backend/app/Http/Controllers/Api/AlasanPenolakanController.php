<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AlasanPenolakan;
use Illuminate\Http\Request;

class AlasanPenolakanController extends Controller
{
    public function index()
    {
        // Mengambil semua data untuk Pie Chart
        $data = AlasanPenolakan::orderBy('tanggal', 'desc')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $alasan = AlasanPenolakan::create($request->all());
        return response()->json([
            'status' => 'success',
            'data' => $alasan
        ], 201);
    }

    public function destroy(string $id)
    {
        $alasan = AlasanPenolakan::find($id);
        if ($alasan) {
            $alasan->delete();
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error'], 404);
    }
}