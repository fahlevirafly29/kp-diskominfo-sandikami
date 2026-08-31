# 🛡️ SANDIKAMI - Sistem Monitoring Sertifikat Elektronik
> Dinas Komunikasi dan Informatika (Diskominfo) Kabupaten Garut

SANDIKAMI adalah aplikasi berbasis web yang dirancang untuk memantau, merekapitulasi, dan melaporkan aktivitas layanan sertifikat elektronik secara real-time dan transparan bagi pimpinan eksekutif.

---

## 🛠️ Tech Stack
* **Backend:** Laravel (RESTful API)
* **Frontend:** React.js, Tailwind CSS, Recharts (Data Visualization)
* **Library Pendukung:** Axios, html2pdf.js, Lucide React

---

## 📂 Struktur Proyek (Monorepo / Terpisah)
Pastikan direktori proyek Anda terstruktur dengan memisahkan folder frontend dan backend:
kp-diskominfo/
├── backend/   (Laravel API)
└── frontend/  (React.js UI)

---

## ⚙️ Panduan Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah ini secara berurutan untuk menjalankan sistem di komputer lokal Anda.

### 1. Konfigurasi Backend (Laravel)
Buka terminal, arahkan direktori ke folder backend:
cd backend

Instal seluruh dependensi PHP menggunakan Composer:
composer install

Salin file konfigurasi lingkungan (.env):
cp .env.example .env

Generate kunci aplikasi (Application Key):
php artisan key:generate

Sesuaikan konfigurasi database Anda di dalam file .env:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_sertifikat_diskominfo
DB_USERNAME=root
DB_PASSWORD=

Jalankan migrasi database beserta seeder:
php artisan migrate --seed

Jalankan server lokal Laravel (berjalan di http://localhost:8000):
php artisan serve

---

### 2. Konfigurasi Frontend (React.js)
Buka terminal baru (biarkan terminal backend tetap berjalan), arahkan direktori ke folder frontend:
cd frontend

Instal seluruh dependensi Node.js:
npm install

Jalankan server pengembangan (Development Server):
npm run dev
(Aplikasi akan berjalan di http://localhost:5173).

---

## 🚀 Cara Penggunaan
1. Buka browser dan akses tautan frontend: http://localhost:5173
2. Masuk menggunakan akun administrator atau petugas yang telah terdaftar di database.
3. Gunakan menu Dashboard untuk melihat grafik analitik serta mengunduh dokumen laporan dalam format PDF.
4. Gunakan menu Rekap Data untuk melakukan input, update, atau delete data harian.
5. Gunakan menu Manajemen Pengguna (khusus Admin) untuk menambah akun hak akses baru.
