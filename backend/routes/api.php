<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RekapLayananController;
use App\Http\Controllers\Api\AlasanPenolakanController;
use App\Http\Controllers\Api\AuthController;

// Pintu masuk umum (Tidak perlu Kartu Akses/Token)
Route::post('/login', [AuthController::class, 'login']);

// Zona Wajib Login (Semua route di dalam group ini wajib menyertakan Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // Mengecek identitas user yang sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // -------------------------------------------------------------
    // ZONA BERSAMA (Kadis & Admin Boleh Masuk untuk Melihat Data)
    // -------------------------------------------------------------
    Route::get('/rekap-layanan', [RekapLayananController::class, 'index']);
    Route::get('/rekap-layanan/{id}', [RekapLayananController::class, 'show']);
    Route::get('/alasan-penolakan', [AlasanPenolakanController::class, 'index']);
    // -------------------------------------------------------------
    // ZONA KHUSUS ADMIN (Hanya Admin yang bisa Merubah/Menghapus Data)
    // -------------------------------------------------------------
    Route::middleware('role:admin')->group(function () {
        Route::post('/rekap-layanan', [RekapLayananController::class, 'store']);
        Route::put('/rekap-layanan/{id}', [RekapLayananController::class, 'update']);
        Route::delete('/rekap-layanan/{id}', [RekapLayananController::class, 'destroy']);
        Route::post('/alasan-penolakan', [AlasanPenolakanController::class, 'store']);
        Route::delete('/alasan-penolakan/{id}', [AlasanPenolakanController::class, 'destroy']);

        });

});