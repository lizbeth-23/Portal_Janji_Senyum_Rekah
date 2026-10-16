# Rancangan Portal Janji Senyum Rekah

## 1. Daftar Fitur dari Bab 4
1. Daftar dan Masuk (4.1)
2. Melihat Janji Terdekat & Tombol Buat Janji di Beranda (4.2)
3. Membuat Janji Temu (4.3.1)
4. Melihat Daftar dan Rincian Janji Pasien (4.3.2)
5. Membatalkan Janji Pasien (4.3.2)
6. Melihat Riwayat Perawatan Pasien (4.4)
7. Melihat dan Mengubah Profil (4.5)
8. Dasbor Resepsionis: Janji Hari Ini & Menunggu Konfirmasi (4.6)
9. Mengelola Janji: Konfirmasi, Jadwal Ulang, Batalkan, Tandai Hadir (4.7)
10. Melihat Data Kontak Pasien (4.8)
11. Dasbor Dokter: Jadwal Hari Ini (4.9)
12. Melakukan Pemeriksaan & Simpan Catatan Perawatan (4.10)
13. Melihat Riwayat Pasien oleh Dokter (4.11)
14. Dasbor Admin: Ringkasan Kunjungan & Laporan (4.12)
15. Mengelola Pengguna: Mengubah Peran & Menonaktifkan Akun (4.13)
16. Mengelola Layanan Klinik (4.14)
17. Mengelola Jadwal Praktik Dokter (4.15)
18. Melihat Laporan Kunjungan Bulanan (4.16)

---

## 2. Matriks Akses

| Fitur (subbab PRD) | Pengunjung | Pasien | Resepsionis | Dokter | Super Admin |
|---|---|---|---|---|---|
| Daftar dan Masuk (4.1) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Beranda & Janji Terdekat (4.2) | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| Membuat Janji (4.3.1) | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| Daftar & Rincian Janji Pasien (4.3.2) | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| Membatalkan Janji Pasien (4.3.2) | ✕ | ✓ milik sendiri (H-1) | ✕ | ✕ | ✓ |
| Riwayat Perawatan Pasien (4.4) | ✕ | ✓ milik sendiri | ✕ | ✕ | ✓ |
| Profil (4.5) | ✕ | ✓ milik sendiri | ✓ milik sendiri | ✓ milik sendiri | ✓ milik sendiri |
| Dasbor Resepsionis (4.6) | ✕ | ✕ | ✓ | ✕ | ✓ |
| Kelola Janji Resepsionis (4.7) | ✕ | ✕ | ✓ | ✕ | ✓ |
| Data Pasien (4.8) | ✕ | ✕ | ✓ (tanpa catatan) | ✕ | ✓ |
| Dasbor Dokter (4.9) | ✕ | ✕ | ✕ | ✓ milik sendiri | ✓ |
| Pemeriksaan (4.10) | ✕ | ✕ | ✕ | ✓ milik sendiri | ✓ |
| Riwayat Pasien Dokter (4.11) | ✕ | ✕ | ✕ | ✓ pasien ditangani | ✓ |
| Dasbor Admin (4.12) | ✕ | ✕ | ✕ | ✕ | ✓ |
| Kelola Pengguna (4.13) | ✕ | ✕ | ✕ | ✕ | ✓ |
| Kelola Layanan (4.14) | ✕ | ✕ | ✕ | ✕ | ✓ |
| Kelola Jadwal Dokter (4.15) | ✕ | ✕ | ✕ | ✕ | ✓ |
| Laporan Kunjungan (4.16) | ✕ | ✕ | ✕ | ✕ | ✓ |

---

## 3. Peta Route

| Halaman | Alamat | Peran yang boleh membuka | Belum masuk | Peran lain |
|---|---|---|---|---|
| Beranda Utama / Pengalihan | `/` | Semua | Terbuka / `/masuk` | - |
| Daftar | `/daftar` | Pengunjung (belum masuk) | Halaman terbuka | Diarahkan ke peran masing-masing |
| Masuk | `/masuk` | Pengunjung (belum masuk) | Halaman terbuka | Diarahkan ke peran masing-masing |
| Beranda Pasien | `/beranda` | `pasien`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Janji Saya (Daftar) | `/janji` | `pasien`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Buat Janji | `/janji/baru` | `pasien`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Rincian Janji Pasien | `/janji/[id]` | `pasien`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Riwayat Perawatan | `/riwayat` | `pasien`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Profil | `/profil` | `pasien`, `resepsionis`, `dokter`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Dasbor Resepsionis | `/resepsionis` | `resepsionis`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Kelola Janji | `/resepsionis/janji` | `resepsionis`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Rincian Janji Resepsionis | `/resepsionis/janji/[id]` | `resepsionis`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Data Pasien | `/resepsionis/pasien` | `resepsionis`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Dasbor Dokter | `/dokter` | `dokter`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Pemeriksaan | `/dokter/janji/[id]` | `dokter`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Riwayat Pasien Dokter | `/dokter/pasien/[id]` | `dokter`, `super_admin` | ke `/masuk` | Akses Ditolak |
| Dasbor Admin | `/admin` | `super_admin` | ke `/masuk` | Akses Ditolak |
| Kelola Pengguna | `/admin/pengguna` | `super_admin` | ke `/masuk` | Akses Ditolak |
| Rincian Pengguna | `/admin/pengguna/[id]` | `super_admin` | ke `/masuk` | Akses Ditolak |
| Layanan | `/admin/layanan` | `super_admin` | ke `/masuk` | Akses Ditolak |
| Jadwal Dokter | `/admin/jadwal-dokter` | `super_admin` | ke `/masuk` | Akses Ditolak |
| Laporan | `/admin/laporan` | `super_admin` | ke `/masuk` | Akses Ditolak |

---

## 4. Jawaban Keputusan Wajib

### 1. Bolehkah resepsionis membaca catatan perawatan?
**Tidak boleh.**
*Dasar PRD*: Subbab 2.4 (Tabel: Catatan perawatan untuk Resepsionis = "Tidak tampil"), Subbab 4.7 ("Rincian untuk resepsionis tidak menampilkan catatan perawatan"), dan Subbab 4.8 ("Batasan v1: resepsionis tidak bisa membaca catatan perawatan dari halaman mana pun").

### 2. Bolehkah drg. Bima membuka pemeriksaan janji drg. Sinta?
**Tidak boleh.**
*Dasar PRD*: Subbab 2.4 (Janji pasien lain untuk Dokter = "Hanya janji yang ia tangani"), Subbab 4.9 ("Perilaku otomatis: hanya janji dengan dokterId miliknya yang tampil. Janji drg. Sinta tidak terlihat oleh drg. Bima"), dan Subbab 4.10 ("Validasi: hanya janji milik dokter itu yang berstatus Hadir yang bisa diisi. Bila ID diganti dengan janji dokter lain, tampil 'Janji tidak ditemukan'").

### 3. Bolehkah pasien melihat jam yang sudah terisi pasien lain?
**Tidak boleh.**
*Dasar PRD*: Subbab 2.4 (Janji pasien lain untuk Pasien = "Tidak tampil"), Subbab 4.3.1 ("Sistem menampilkan slot jam yang masih kosong. Slot yang bertabrakan dengan janji lain dokter itu yang belum dibatalkan tidak ditampilkan. Untuk mengetahuinya, aplikasi membaca koleksi slot_terisi yang hanya berisi dokter, tanggal, jam, dan durasi, tanpa nama atau keluhan pasien"). Pasien hanya melihat daftar slot waktu yang masih tersedia (kosong).

### 4. Halaman mana saja yang boleh dibuka Bu Ratna?
**Semua halaman (seluruh modul dalam aplikasi).**
*Dasar PRD*: Subbab 2.1 ("Super Admin (Bu Ratna): Semua hak tiga peran lain, ditambah mengelola pengguna, layanan, jadwal dokter, dan laporan"), Subbab 2.3 (Hak akses Super Admin berstatus "Penuh" untuk semua modul), Subbab 3.1 ("Super Admin: semua menu peran lain, ditambah Dasbor Admin, Kelola Pengguna, Layanan, Jadwal Dokter, Laporan"), dan Subbab 4.12 ("Menu samping Super Admin juga memuat semua menu peran lain").
