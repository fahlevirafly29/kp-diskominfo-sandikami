<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sertifikat extends Model
{
    use HasFactory;

    protected $table = 'sertifikats';

    // Kolom yang diizinkan untuk diisi (Permohonan & Ditolak sudah dibuang)
    protected $fillable = [
        'tanggal',
        'terbit_baru',
        'diperpanjang',
        'dicabut',
        'dihentikan'
    ];
}