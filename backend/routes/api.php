<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RekapLayananController;
use App\Http\Controllers\Api\AlasanPenolakanController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SertifikatController; // Tambahan untuk Sertifikat

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
    
    // Route GET Sertifikat agar grafik muncul di Dashboard Kadis dan Admin
    Route::get('/sertifikat', [SertifikatController::class, 'index']);
    
    // -------------------------------------------------------------
    // ZONA KHUSUS ADMIN (Hanya Admin yang bisa Merubah/Menghapus Data)
    // -------------------------------------------------------------
    Route::middleware('role:admin')->group(function () {
        Route::post('/rekap-layanan', [RekapLayananController::class, 'store']);
        Route::put('/rekap-layanan/{id}', [RekapLayananController::class, 'update']);
        Route::delete('/rekap-layanan/{id}', [RekapLayananController::class, 'destroy']);
        Route::post('/alasan-penolakan', [AlasanPenolakanController::class, 'store']);
        Route::delete('/alasan-penolakan/{id}', [AlasanPenolakanController::class, 'destroy']);
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
	Route::delete('/users/{id}',[UserController::class,'destroy']);
        
        // Route POST dan DELETE Sertifikat agar HANYA Admin yang bisa input & hapus data rekap
        Route::post('/sertifikat', [SertifikatController::class, 'store']);
        Route::delete('/sertifikat/{id}', [SertifikatController::class, 'destroy']); // <-- INI YANG BARU DITAMBAHKAN
    });

});
