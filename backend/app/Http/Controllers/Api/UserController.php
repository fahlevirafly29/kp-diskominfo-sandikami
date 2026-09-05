<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // =========================================================
    // CEK ADMIN
    // =========================================================
    private function checkAdmin()
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Akses ditolak. Hanya Admin yang dapat mengelola pengguna.'
            ], 403);
        }

        return null;
    }

    // =========================================================
    // 1. MENAMPILKAN SEMUA DATA PENGGUNA
    // =========================================================
    public function index()
    {
        if ($response = $this->checkAdmin()) {
            return $response;
        }

        $users = User::all();

        return response()->json($users);
    }

    // =========================================================
    // 2. MENAMBAHKAN PENGGUNA BARU
    // =========================================================
    public function store(Request $request)
    {
        if ($response = $this->checkAdmin()) {
            return $response;
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,kadis,petugas',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Pengguna baru berhasil ditambahkan!',
            'data' => $user
        ], 201);
    }

    // =========================================================
    // 3. MENGHAPUS PENGGUNA
    // =========================================================
    public function destroy($id)
    {
        if ($response = $this->checkAdmin()) {
            return $response;
        }

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