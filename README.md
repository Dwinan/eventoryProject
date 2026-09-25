# Eventory

Sistem informasi terpadu untuk kegiatan kampus. Eventory menghubungkan organisasi mahasiswa dengan warga kampus: ormawa menerbitkan kegiatan, mahasiswa mendaftar dan mendapat tiket QR, sementara pengelola kampus menjaga konten lewat moderasi terpusat.

## Sekilas

- **Publikasi kegiatan** — organisasi (BEM, HMJ, UKM) membuat event dengan kategori, kapan pun tanpa menunggu persetujuan. Konten ditinjau setelah tayang (post-moderation).
- **Pendaftaran & e-ticket** — setiap pendaftaran menghasilkan token unik yang ditampilkan sebagai QR di perangkat mahasiswa.
- **Presensi scan** — panitia memvalidasi tiket langsung di lokasi; status kehadiran tercatat otomatis.
- **Bookmark** — mahasiswa menyimpan event favorit untuk dipantau dari dashboard.
- **Moderasi admin** — take-down/restore event, aktivasi ormawa, dan kelola pengguna.

## Tumpukan Teknologi

| Bagian | Teknologi |
| --- | --- |
| Backend | Laravel 13, Eloquent, Laravel Fortify (autentikasi + 2FA) |
| Frontend | React 19, TypeScript, Inertia.js 3, Tailwind CSS |
| Aset | Vite |
| Database | PostgreSQL |
| QR tiket | `qrcode.react` |
| Kualitas | PHPStan (Larastan), Pint, ESLint/Prettier |

## Kebutuhan Sistem

- PHP 8.3+ (ekstensi `pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`, `curl`, `ctype`)
- Composer 2
- Node.js 22+ dan npm
- PostgreSQL 14+ (dev lokal boleh pakai SQLite, lihat bagian [Alternatif SQLite](#alternatif-sqlite))
- Git

Cek versi terpasang:

```bash
php -v && composer -V && node -v && npm -v
```

## Instalasi Awal

```bash
git clone <alamat-repo> eventory
cd eventory
composer install
npm install
```

Salin environment lalu buat kunci aplikasi:

```powershell
# Windows (PowerShell)
Copy-Item .env.example .env
php artisan key:generate
```

```bash
# Linux / macOS
cp .env.example .env
php artisan key:generate
```

Sesuaikan koneksi database pada `.env`:

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=db_eventory
DB_USERNAME=username_kamu
DB_PASSWORD=password_kamu
```

> Disarankan pakai PostgreSQL.

Buat database kosong (Laravel yang membuat tabel-tabelnya):

```bash
psql -U postgres -c "CREATE DATABASE db_eventory;"
```

Pastikan nilai `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` pada `.env` cocok dengan kredensial PostgreSQL yang kamu gunakan.

Migrasi skema dan isi data contoh:

```bash
php artisan migrate:fresh --seed
```

> `migrate:fresh --seed` langsung membangun ulang seluruh skema dan mengisi data demo sekaligus, jadi aman dipakai untuk setup pertama maupun reset kapan saja.

## Menjalankan

Satu perintah untuk semua service pengembangan (server, queue, dan Vite):

```bash
composer dev
```

Atau manual lewat dua terminal:

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

Buka `http://localhost:8000`.

## Akun Bawaan

Semua akun hasil seeding memakai password `password`. User role `general` dibuat acak oleh factory dan tidak tercantum di daftar email tetap.

| Peran | Email | Keterangan |
| --- | --- | --- |
| Administrator | `admin@eventory.test` | Moderasi event, kelola ormawa & pengguna |
| Organizer | `bem@eventory.test` | BEM UGM |
| Organizer | `hmi@eventory.test` | HMJ Teknik Informatika |
| Organizer | `ukm-musik@eventory.test` | UKM Musik |
| Organizer | `ukm-olahraga@eventory.test` | UKM Olahraga |
| Organizer | `hmj-manajemen@eventory.test` | HMJ Manajemen |

Role `general` untuk mahasiswa; akunnya dibuat otomatis saat seeder (10 user, email acak). Login memakai email masing-masing dengan password bawaan `password`.

## Perintah yang Sering Dipakai

| Perintah | Fungsi |
| --- | --- |
| `composer dev` | Jalankan seluruh service pengembangan |
| `npm run dev` | Vite dev server (hot reload) |
| `npm run build` | Bangun aset produksi |
| `php artisan migrate:fresh --seed` | Reset database dan isi ulang data demo |
| `php artisan tinker` | REPL interaktif untuk coba Eloquent |
| `php artisan test` | Jalankan suite test |
| `composer lint` | Format kode backend dengan Pint |
| `composer types:check` | Analisis statis dengan PHPStan |
| `npm run check` | Lint & format frontend |