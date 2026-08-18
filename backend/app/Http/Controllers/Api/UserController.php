<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // 1. Menampilkan semua data pengguna untuk Tabel React
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // 2. Menambahkan pengguna baru (Pengganti form Register publik)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string' // Wajib memilih role (admin/kadis/petugas)
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role 
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Pengguna baru berhasil ditambahkan!',
            'data' => $user
        ], 201);
    }
}