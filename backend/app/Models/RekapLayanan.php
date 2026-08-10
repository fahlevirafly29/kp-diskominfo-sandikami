<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RekapLayanan extends Model
{
    use HasFactory;

    // Beri tahu Laravel nama tabel aslinya
    protected $table = 'rekap_layanan';

    // Izinkan kolom-kolom ini diisi data (Fillable)
    protected $fillable = [
        'tanggal', 'jml_permohonan', 'jml_penerimaan', 'jml_penolakan', 
        'status_terbit_baru', 'status_dicabut', 'status_diperpanjang', 
        'status_expired', 'jml_sertifikat_aktif', 'doc_individu', 
        'doc_online', 'doc_level3', 'doc_segel'
    ];
}