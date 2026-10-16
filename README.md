# 🦷 Portal Janji Senyum Rekah

Aplikasi Janji Temu dan Catatan Perawatan Klinik Gigi berbasis web untuk Klinik Gigi Senyum Rekah Makassar. Menggantikan buku janji manual dan pencatatan kertas dengan sistem terintegrasi yang mencegah jadwal bertabrakan dan menjamin kerahasiaan data rekam perawatan.

---

## 🎨 Palet Warna Brand
Aplikasi ini dirancang dengan palet warna modern dan nyaman untuk layanan kesehatan gigi:
- **`#5798D7`** — Primary Dental Sky Blue (Header, navigasi utama, tombol primer, dan kartu fokus)
- **`#B9C255`** — Accent Fresh Lime / Rekah Vitality (Aksen brand, CTA utama *Buat Janji*, badge peran, dan avatar)
- **`#E6F1FA`** — Soft Ice Blue Tint (Latar belakang aplikasi lembut, surface card, dan badge netral)

---

## 👥 4 Peran Pengguna (PRD)

| Peran | Nilai Role | Hak Akses Utama |
|---|---|---|
| **Pasien** | `pasien` | Beranda janji terdekat, melihat slot jam kosong, membuat & membatalkan janji sendiri, membaca riwayat perawatan. |
| **Staf Depan / Resepsionis** | `resepsionis` / `staf depan` | Dasbor hari ini, konfirmasi janji, jadwal ulang, batalkan janji, tandai pasien hadir, data kontak pasien (tanpa catatan medis). |
| **Dokter** | `dokter` | Dasbor jadwal hari ini, pemeriksaan pasien hadir, mengisi catatan tindakan medis pasien yang ditangani. |
| **Super Admin** | `super_admin` | Akses penuh ke seluruh modul, kelola pengguna, ubah tarif layanan, jadwal praktik dokter, dan laporan kunjungan bulanan. |

---

## 🛡️ Keamanan & Route Guard
- **Route Guard Resepsionis & Staf**: Seluruh rute `/resepsionis` dan `/staf` diproteksi ketat hanya untuk role `staf depan` dan `super_admin`. Pengguna belum masuk otomatis dialihkan ke `/masuk`, dan peran lain melihat halaman **Akses Ditolak (403)**.
- **Pencegahan Keputusan Prematur**: Sistem menampilkan layar `Memuat...` selama role pengguna masih dalam proses pembacaan dari dokumen `users/{uid}` di Firestore.

---

## 🚀 Teknologi yang Digunakan
- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS & Vanilla CSS Variables
- **Icons**: Lucide React
- **Backend & Database**: Firebase Authentication & Cloud Firestore

---

## 💻 Cara Menjalankan Secara Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/lizbeth-23/Portal_Janji_Senyum_Rekah.git
   cd Portal_Janji_Senyum_Rekah
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin file `.env.example` ke `.env.local` dan masukkan kredensial Firebase Anda:
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan server development**:
   ```bash
   npm run dev
   ```
   Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## 📄 Lisensi & Pemilik
Dikembangkan untuk Tugas Mandiri Sesi 6 - Bootcamp Fullstack Web Development.  
**Klinik Gigi Senyum Rekah Makassar**
