<?php

namespace App\Http\Controllers\Api;

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

    // 2. Menambahkan pengguna baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,kadis,petugas'
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

    // 3. Menghapus pengguna
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Pengguna tidak ditemukan.'
            ], 404);
        }

        // Admin tidak boleh menghapus akun sendiri
        if ($user->id === auth()->id()) {
            return response()->json([
                'status' => false,
                'message' => 'Anda tidak dapat menghapus akun sendiri.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'Pengguna berhasil dihapus.'
        ]);
    }
}

