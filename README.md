# eLabCare — Advanced Medical Analysis & Health Monitoring

eLabCare adalah aplikasi web (PWA) untuk membantu pasien memantau kesehatannya secara mandiri — mencatat hasil pemeriksaan lab, melihat tren kesehatan dari waktu ke waktu, serta mengelola terapi/konsumsi obat — sekaligus menyediakan panel admin bagi tenaga klinik untuk mengelola data pasien, master data obat, dan terapi yang dijalankan pasien.

Dibangun dengan **Laravel 12** (backend) + **Inertia.js v2** + **React (TypeScript)** untuk antarmuka, dengan dua tampilan terpisah:

- **Sisi pasien (PWA)** — bergaya mobile-first (Tailwind CSS), diakses lewat browser seperti aplikasi.
- **Sisi admin** — dashboard bergaya WowDash (Bootstrap), diakses lewat `/admin`.

## Fitur Utama

### Untuk Pasien (PWA)

- **Beranda** — ringkasan status kesehatan terkini, kalender pemeriksaan, banner info.
- **Tambah Pemeriksaan** — input hasil lab (gula darah, kolesterol, asam urat, dll), unggah dokumen hasil lab.
- **Riwayat Pemeriksaan** — daftar seluruh pemeriksaan beserta analisis status (normal/perlu perhatian), dilengkapi ringkasan obat yang sedang dikonsumsi.
- **Tren Kesehatan** — grafik tren parameter lab per periode (1 bulan s/d 1 tahun), skor kesehatan, kalender aktivitas pemeriksaan, dan **timeline riwayat obat** yang dikorelasikan dengan grafik.
- **Obat Saya** — catat obat yang sedang/pernah dikonsumsi lewat form dinamis (golongan → obat → dosis → aturan pakai → status terapi → rentang tanggal), bisa menambahkan beberapa obat sekaligus.
- **Notifikasi** — pengingat otomatis harian untuk minum obat (untuk terapi yang sedang aktif), serta notifikasi umum lainnya.
- **Profil** — kelola data diri dan keamanan akun.
- **Captcha Login** — verifikasi matematika sederhana saat login untuk mencegah spam/bot.

### Untuk Admin

- **Dashboard** — ringkasan data sistem.
- **Users** — kelola akun pasien, termasuk **reset password** langsung dari panel admin.
- **Banner Images** — kelola banner yang tampil di beranda pasien.
- **Health Records** — lihat riwayat pemeriksaan seluruh pasien.
- **Master Obat** — kelola data referensi obat: golongan terapi (Antihipertensi, Diabetes Melitus, Hiperkolesterol, dst), sub-golongan, serta pilihan dosis & aturan pakai per obat.
- **Terapi Pasien** — input & kelola terapi obat untuk pasien tertentu (form dinamis yang sama seperti di sisi pasien), lihat riwayat terapi seluruh pasien dengan filter per pasien.
- **Settings** — pengaturan logo aplikasi & kebijakan privasi.

## Teknologi

| Bagian    | Teknologi                                             |
| --------- | ------------------------------------------------------ |
| Backend   | PHP 8.2+, Laravel 12, MySQL                             |
| Frontend  | React 19 + TypeScript, Inertia.js v2, Vite              |
| Styling   | Tailwind CSS (PWA), Bootstrap 5 / WowDash theme (Admin) |
| Grafik    | ECharts (`echarts-for-react`)                           |

## Instalasi & Menjalankan Secara Lokal

### Prasyarat

- PHP >= 8.2 dengan ekstensi standar Laravel (termasuk `pdo_mysql`)
- MySQL / MariaDB (mis. lewat Laragon, XAMPP, atau server terpisah)
- Composer
- Node.js (LTS) & npm

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/Gudangsoft/elabscare.git
cd elabscare

# 2. Install dependency backend & frontend
composer install
npm install

# 3. Siapkan file environment
cp .env.example .env
php artisan key:generate
```

Buka `.env`, ubah bagian database ke MySQL dan sesuaikan dengan kredensial lokal Anda (buat database kosong terlebih dulu, mis. `elabs`):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elabs
DB_USERNAME=root
DB_PASSWORD=
```

Lalu jalankan migrasi & seeder:

```bash
php artisan migrate --seed

# Buat symlink storage (untuk avatar, banner, dokumen lab)
php artisan storage:link

# Build asset frontend
npm run build
```

### Menjalankan Aplikasi

**Mode pengembangan** (server, queue worker, log viewer, dan Vite dev server sekaligus):

```bash
composer run dev
```

Atau jalankan manual di beberapa terminal terpisah:

```bash
php artisan serve      # server Laravel
npm run dev            # Vite dev server (hot reload)
php artisan queue:listen
```

Buka `http://127.0.0.1:8000` di browser.

### Akun Bawaan (hasil seeder)

| Peran  | Email                  | Password      |
| ------ | ----------------------- | -------------- |
| Admin  | `admin@gmail.com`       | `Password123`  |
| Pasien | `user.male@gmail.com`   | `Password123`  |
| Pasien | `user.female@gmail.com` | `Password123`  |

Panel admin dapat diakses di `/admin` setelah login dengan akun berperan `admin`.

## Pengingat Obat Otomatis (Scheduler)

Sistem menghasilkan notifikasi pengingat minum obat setiap hari jam 07:00 lewat scheduler Laravel. Agar berjalan otomatis di server produksi, tambahkan cron job berikut:

```
* * * * * cd /path-ke-project && php artisan schedule:run >> /dev/null 2>&1
```

Untuk menguji secara manual tanpa menunggu jadwal:

```bash
php artisan obat:generate-reminders
```

## Skrip Berguna

```bash
npm run types     # cek TypeScript tanpa build
npm run lint      # ESLint (auto-fix)
npm run format    # Prettier untuk folder resources/
php artisan test  # jalankan test suite (Pest)
```

## Struktur Frontend

```
resources/js/
├── admin/     # Halaman & komponen khusus panel admin (Bootstrap/WowDash)
└── pwa/       # Halaman & komponen khusus aplikasi pasien (Tailwind)
```

Setiap sisi memiliki `app.tsx` masing-masing (`resources/js/admin/app.tsx` dan `resources/js/pwa/app.tsx`) yang didaftarkan sebagai entry point terpisah di `vite.config.ts`, dengan routing halaman Inertia yang juga terpisah antara `routes/admin.php` (prefix `/admin`) dan `routes/web.php`.
