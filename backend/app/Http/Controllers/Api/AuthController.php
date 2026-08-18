<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Pastikan React mengirim username dan password (tidak boleh kosong)
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // 2. Cek ke Database: Apakah ada kombinasi username dan password yang cocok?
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            
            // 3. Jika cocok, ambil data user tersebut dari database
            $user = Auth::user();
            
            // 4. Buatkan "Kartu Akses" (Token) menggunakan fitur Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            // 5. Kembalikan respons sukses beserta Token dan Data User (termasuk Role)
            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'data' => $user,
                'access_token' => $token,
            ]);
        }

        // 6. Jika username/password salah, kembalikan respons error (401 Unauthorized)
        return response()->json([
            'status' => 'error',
            'message' => 'Username atau kata sandi salah'
        ], 401);
    }

}