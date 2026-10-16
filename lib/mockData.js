// Initial Seed Data following PRD 7.1 and PRD 2.1
export const INITIAL_USERS = [
  {
    id: "user-ratna",
    nama: "Bu Ratna",
    email: "ratna@senyumrekah.id",
    noHp: "081299887766",
    role: "super_admin",
    aktif: true,
    dibuatPada: "2026-10-01T08:00:00Z"
  },
  {
    id: "user-laras",
    nama: "Laras",
    email: "laras@senyumrekah.id",
    noHp: "081234567891",
    role: "resepsionis",
    aktif: true,
    dibuatPada: "2026-10-01T08:15:00Z"
  },
  {
    id: "user-bima",
    nama: "drg. Bima",
    email: "bima@senyumrekah.id",
    noHp: "081234567892",
    role: "dokter",
    aktif: true,
    dibuatPada: "2026-10-01T08:30:00Z"
  },
  {
    id: "user-sinta",
    nama: "drg. Sinta",
    email: "sinta@senyumrekah.id",
    noHp: "081234567893",
    role: "dokter",
    aktif: true,
    dibuatPada: "2026-10-01T08:45:00Z"
  },
  {
    id: "user-andi",
    nama: "Andi Pratama",
    email: "andi@gmail.com",
    noHp: "081234567890",
    role: "pasien",
    aktif: true,
    dibuatPada: "2026-10-02T09:00:00Z"
  },
  {
    id: "user-maya",
    nama: "Maya Putri",
    email: "maya@gmail.com",
    noHp: "081234567894",
    role: "pasien",
    aktif: true,
    dibuatPada: "2026-10-02T10:00:00Z"
  }
];

export const INITIAL_LAYANAN = [
  {
    id: "layanan-1",
    nama: "Pembersihan Karang Gigi (Scaling)",
    durasiMenit: 30,
    harga: 200000,
    aktif: true
  },
  {
    id: "layanan-2",
    nama: "Tambal Gigi Komposit",
    durasiMenit: 60,
    harga: 300000,
    aktif: true
  },
  {
    id: "layanan-3",
    nama: "Cabut Gigi",
    durasiMenit: 30,
    harga: 250000,
    aktif: true
  },
  {
    id: "layanan-4",
    nama: "Konsultasi & Pemeriksaan Gigi",
    durasiMenit: 30,
    harga: 100000,
    aktif: true
  },
  {
    id: "layanan-5",
    nama: "Perawatan Saluran Akar",
    durasiMenit: 90,
    harga: 500000,
    aktif: true
  }
];

export const INITIAL_JADWAL_DOKTER = [
  {
    id: "jadwal-1",
    dokterId: "user-bima",
    hari: "senin",
    jamMulai: "09:00",
    jamSelesai: "15:00"
  },
  {
    id: "jadwal-2",
    dokterId: "user-bima",
    hari: "selasa",
    jamMulai: "09:00",
    jamSelesai: "15:00"
  },
  {
    id: "jadwal-3",
    dokterId: "user-bima",
    hari: "kamis",
    jamMulai: "09:00",
    jamSelesai: "15:00"
  },
  {
    id: "jadwal-4",
    dokterId: "user-sinta",
    hari: "rabu",
    jamMulai: "10:00",
    jamSelesai: "16:00"
  },
  {
    id: "jadwal-5",
    dokterId: "user-sinta",
    hari: "jumat",
    jamMulai: "10:00",
    jamSelesai: "16:00"
  },
  {
    id: "jadwal-6",
    dokterId: "user-sinta",
    hari: "sabtu",
    jamMulai: "09:00",
    jamSelesai: "14:00"
  }
];

export const INITIAL_JANJI = [
  {
    id: "janji-101",
    pasienId: "user-andi",
    dokterId: "user-bima",
    layananId: "layanan-2",
    tanggal: "2026-10-15",
    jam: "09:30",
    keluhan: "Gigi geraham belakang ngilu saat minum dingin",
    status: "hadir", // siap diperiksa di dokter
    alasanBatal: "",
    dibuatPada: "2026-10-12T10:00:00Z"
  },
  {
    id: "janji-102",
    pasienId: "user-maya",
    dokterId: "user-sinta",
    layananId: "layanan-1",
    tanggal: "2026-10-15",
    jam: "11:00",
    keluhan: "Pembersihan rutin karang gigi setahun sekali",
    status: "menunggu",
    alasanBatal: "",
    dibuatPada: "2026-10-14T08:20:00Z"
  },
  {
    id: "janji-103",
    pasienId: "user-andi",
    dokterId: "user-bima",
    layananId: "layanan-3",
    tanggal: "2026-10-16",
    jam: "10:00",
    keluhan: "Gigi bungsu bawah goyang dan menusuk pipi",
    status: "dikonfirmasi",
    alasanBatal: "",
    dibuatPada: "2026-10-13T14:15:00Z"
  },
  {
    id: "janji-104",
    pasienId: "user-maya",
    dokterId: "user-bima",
    layananId: "layanan-4",
    tanggal: "2026-10-10",
    jam: "13:00",
    keluhan: "Pemeriksaan gusi berdarah",
    status: "selesai",
    alasanBatal: "",
    dibuatPada: "2026-10-08T09:00:00Z"
  },
  {
    id: "janji-105",
    pasienId: "user-andi",
    dokterId: "user-bima",
    layananId: "layanan-1",
    tanggal: "2026-10-05",
    jam: "10:30",
    keluhan: "Karang gigi bagian depan",
    status: "selesai",
    alasanBatal: "",
    dibuatPada: "2026-10-01T11:00:00Z"
  },
  {
    id: "janji-106",
    pasienId: "user-maya",
    dokterId: "user-sinta",
    layananId: "layanan-2",
    tanggal: "2026-10-12",
    jam: "14:00",
    keluhan: "Gigi depan berlubang kecil",
    status: "dibatalkan",
    alasanBatal: "Pasien sedang dinas luar kota mendadak",
    dibuatPada: "2026-10-09T16:00:00Z"
  }
];

export const INITIAL_CATATAN = [
  {
    id: "catatan-1",
    janjiId: "janji-104",
    pasienId: "user-maya",
    dokterId: "user-bima",
    tindakan: "Gingivektomi minor & pembersihan plak subgingiva",
    catatan: "Kumur air garam hangat 2x sehari, kontrol jika masih nyeri dalam 3 hari",
    dibuatPada: "2026-10-10T13:40:00Z"
  },
  {
    id: "catatan-2",
    janjiId: "janji-105",
    pasienId: "user-andi",
    dokterId: "user-bima",
    tindakan: "Pembersihan karang gigi ultrasonik rahang atas dan bawah",
    catatan: "Gunakan pasta gigi sensitif, hindari minuman terlalu dingin selama 48 jam",
    dibuatPada: "2026-10-05T11:15:00Z"
  }
];

export const INITIAL_SLOT_TERISI = [
  {
    id: "janji-101",
    dokterId: "user-bima",
    tanggal: "2026-10-15",
    jam: "09:30",
    durasiMenit: 60
  },
  {
    id: "janji-102",
    dokterId: "user-sinta",
    tanggal: "2026-10-15",
    jam: "11:00",
    durasiMenit: 30
  },
  {
    id: "janji-103",
    dokterId: "user-bima",
    tanggal: "2026-10-16",
    jam: "10:00",
    durasiMenit: 30
  }
];
