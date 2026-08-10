<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekap_layanan', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->integer('jml_permohonan')->default(0);
            $table->integer('jml_penerimaan')->default(0);
            $table->integer('jml_penolakan')->default(0);
            $table->integer('status_terbit_baru')->default(0);
            $table->integer('status_dicabut')->default(0);
            $table->integer('status_diperpanjang')->default(0);
            $table->integer('status_expired')->default(0);
            $table->integer('jml_sertifikat_aktif')->default(0);
            $table->integer('doc_individu')->default(0);
            $table->integer('doc_online')->default(0);
            $table->integer('doc_level3')->default(0);
            $table->integer('doc_segel')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekap_layanan');
    }
};