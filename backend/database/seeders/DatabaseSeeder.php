<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Petugas/Admin
        User::create([
            'name' => 'Petugas Sandikami',
            'username' => 'admin',
            'password' => Hash::make('password123'), // Hash::make untuk enkripsi password
            'role' => 'admin',
        ]);

        // 2. Buat Akun Kepala Dinas
        User::create([
            'name' => 'Kepala Dinas',
            'username' => 'kadis',
            'password' => Hash::make('password123'),
            'role' => 'kadis',
        ]);
    }
}