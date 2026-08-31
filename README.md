PANDUAN LENGKAP: CLONE PROYEK, INSTALASI, DAN SETUP AKUN PERTAMA (TINKER) DI DEVICE BARU

A. TENTANG PROYEK & TECH STACK
SANDIKAMI adalah aplikasi berbasis web yang dirancang untuk memantau, merekapitulasi, dan melaporkan aktivitas layanan sertifikat elektronik secara real-time dan transparan bagi pimpinan eksekutif di lingkungan Dinas Komunikasi dan Informatika (Diskominfo) Kabupaten Garut.

Tools & Tech Stack yang digunakan:
- Backend: Laravel (RESTful API)
- Frontend: React.js, Tailwind CSS, Recharts (Data Visualization)
- Database: MySQL
- Library Pendukung: Axios, html2pdf.js, Lucide React

---

B. STRUKTUR DIREKTORI PROYEK
Proyek ini menggunakan struktur monorepo terpisah antara API dan UI:
kp-diskominfo-sandikami/
├── backend/   (Laravel API)
└── frontend/  (React.js UI)

---

C. LANGKAH-LANGKAH INSTALASI DI DEVICE BARU

1. CLONE REPOSITORY DARI GITHUB
Buka terminal di komputer atau perangkat baru kamu, lalu jalankan perintah berikut untuk mengunduh kode proyek:

git clone https://github.com/fahlevirafly29/kp-diskominfo-sandikami.git
cd kp-diskominfo-sandikami

---

2. SETUP SISI BACKEND (LARAVEL)
Masuk ke folder backend, lalu siapkan lingkungan PHP dan instal dependensinya:

cd backend
composer install
cp .env.example .env
php artisan key:generate

Buka file .env yang baru saja disalin menggunakan text editor (seperti VS Code), lalu sesuaikan konfigurasi database MySQL di komputer baru kamu:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_sertifikat_diskominfo
DB_USERNAME=root
DB_PASSWORD=

Pastikan database dengan nama `db_sertifikat_diskominfo` sudah kamu buat sebelumnya di MySQL / phpMyAdmin. Setelah itu, jalankan migrasi database:

php artisan migrate

Jalankan server lokal Laravel:
php artisan serve
(Server backend akan berjalan di http://localhost:8000)

---

3. MEMBUAT AKUN PERTAMA DENGAN LARAVEL TINKER
Karena database masih kosong setelah migrasi, kamu harus membuat akun administrator pertama kali secara manual menggunakan Laravel Tinker:

- Buka terminal BARU (biarkan terminal server backend yang sedang berjalan tetap terbuka).
- Masuk ke direktori backend:
  cd backend

- Masuk ke mode Tinker:
  php artisan tinker

- Di dalam mode Tinker, copy dan paste perintah untuk membuat akun admin berikut (kamu bisa mengubah nama, username, atau password sesuai keinginan):
  \App\Models\User::create([
      'name' => 'Administrator',
      'username' => 'admin',
      'password' => bcrypt('password123'),
      'role' => 'admin'
  ]);

- Jika berhasil, akan muncul informasi data user yang baru dibuat.
- Ketik `exit` untuk keluar dari mode Tinker.
(Sekarang kamu sudah memiliki akun dengan username: admin dan password: password123).

---

4. SETUP SISI FRONTEND (REACT.JS)
Buka terminal baru lagi, arahkan direktori ke folder frontend, lalu instal dependensinya:

cd frontend
npm install

Jalankan server pengembangan frontend:
npm run dev
(Aplikasi frontend akan berjalan di http://localhost:5173)

---

5. SELESAI
Buka browser, akses http://localhost:5173, dan login menggunakan akun yang sudah kamu buat di Tinker tadi!
