<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sertifikats', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');                       // Tanggal pencatatan data
            $table->integer('terbit_baru')->default(0);    // Jumlah Sertifikat Terbit Baru
            $table->integer('diperpanjang')->default(0);   // Jumlah Sertifikat Diperpanjang
            $table->integer('dicabut')->default(0);        // Jumlah Sertifikat Dicabut
            $table->integer('dihentikan')->default(0);     // Jumlah Sertifikat Dihentikan (Expired)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sertifikats');
    }
};