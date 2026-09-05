<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\RekapLayananController;
use App\Http\Controllers\Api\AlasanPenolakanController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SertifikatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| ROUTE WAJIB LOGIN
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | CEK USER YANG SEDANG LOGIN
    |--------------------------------------------------------------------------
    */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    /*
    |--------------------------------------------------------------------------
    | ZONA BERSAMA
    |--------------------------------------------------------------------------
    | Semua user yang sudah login dapat melihat data.
    |--------------------------------------------------------------------------
    */

    // Rekap Layanan
    Route::get('/rekap-layanan', [RekapLayananController::class, 'index']);
    Route::get('/rekap-layanan/{id}', [RekapLayananController::class, 'show']);

    // Alasan Penolakan
    Route::get('/alasan-penolakan', [AlasanPenolakanController::class, 'index']);

    // Sertifikat
    Route::get('/sertifikat', [SertifikatController::class, 'index']);


    /*
    |--------------------------------------------------------------------------
    | ADMIN + PETUGAS
    |--------------------------------------------------------------------------
    | Admin dan Petugas boleh:
    | - Menambah data
    | - Mengubah data
    | - Menghapus data
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,petugas')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | REKAP LAYANAN
        |--------------------------------------------------------------------------
        */
        Route::post('/rekap-layanan', [RekapLayananController::class, 'store']);
        Route::put('/rekap-layanan/{id}', [RekapLayananController::class, 'update']);
        Route::delete('/rekap-layanan/{id}', [RekapLayananController::class, 'destroy']);


        /*
        |--------------------------------------------------------------------------
        | ALASAN PENOLAKAN
        |--------------------------------------------------------------------------
        */
        Route::post('/alasan-penolakan', [AlasanPenolakanController::class, 'store']);
        Route::delete('/alasan-penolakan/{id}', [AlasanPenolakanController::class, 'destroy']);


        /*
        |--------------------------------------------------------------------------
        | SERTIFIKAT
        |--------------------------------------------------------------------------
        */
        Route::post('/sertifikat', [SertifikatController::class, 'store']);
        Route::delete('/sertifikat/{id}', [SertifikatController::class, 'destroy']);

    });


    /*
    |--------------------------------------------------------------------------
    | ADMIN SAJA
    |--------------------------------------------------------------------------
    | Hanya Admin yang boleh mengelola pengguna.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->group(function () {

        // Menampilkan semua pengguna
        Route::get('/users', [UserController::class, 'index']);

        // Menambahkan pengguna
        Route::post('/users', [UserController::class, 'store']);

        // Menghapus pengguna
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

    });

});