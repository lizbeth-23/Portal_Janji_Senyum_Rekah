import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "portal-janji-senyum-reka-2f78b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Menggunakan konfigurasi Firebase Project ID:", firebaseConfig.projectId);

if (!firebaseConfig.apiKey) {
  console.error("ERROR: NEXT_PUBLIC_FIREBASE_API_KEY belum disetel di .env.local");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data seed sesuai PRD 7.1 dan PRD 2.1
const USERS = [
  {
    id: "user-ratna",
    nama: "Bu Ratna",
    email: "ratna@senyumrekah.id",
    noHp: "081299887766",
    role: "super_admin",
    aktif: true,
  },
  {
    id: "user-laras",
    nama: "Laras",
    email: "laras@senyumrekah.id",
    noHp: "081234567891",
    role: "resepsionis",
    aktif: true,
  },
  {
    id: "user-bima",
    nama: "drg. Bima",
    email: "bima@senyumrekah.id",
    noHp: "081234567892",
    role: "dokter",
    aktif: true,
  },
  {
    id: "user-sinta",
    nama: "drg. Sinta",
    email: "sinta@senyumrekah.id",
    noHp: "081234567893",
    role: "dokter",
    aktif: true,
  },
  {
    id: "user-andi",
    nama: "Andi Pratama",
    email: "andi@gmail.com",
    noHp: "081234567890",
    role: "pasien",
    aktif: true,
  },
  {
    id: "user-maya",
    nama: "Maya Putri",
    email: "maya@gmail.com",
    noHp: "081234567894",
    role: "pasien",
    aktif: true,
  },
];

const LAYANAN = [
  {
    id: "layanan-1",
    nama: "Pembersihan Karang Gigi (Scaling)",
    durasiMenit: 30,
    harga: 200000,
    aktif: true,
  },
  {
    id: "layanan-2",
    nama: "Tambal Gigi Komposit",
    durasiMenit: 60,
    harga: 300000,
    aktif: true,
  },
  {
    id: "layanan-3",
    nama: "Cabut Gigi",
    durasiMenit: 30,
    harga: 250000,
    aktif: true,
  },
  {
    id: "layanan-4",
    nama: "Konsultasi & Pemeriksaan Gigi",
    durasiMenit: 30,
    harga: 100000,
    aktif: true,
  },
  {
    id: "layanan-5",
    nama: "Perawatan Saluran Akar",
    durasiMenit: 90,
    harga: 500000,
    aktif: true,
  },
];

const JADWAL_DOKTER = [
  {
    id: "jadwal-1",
    dokterId: "user-bima",
    hari: "senin",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jadwal-2",
    dokterId: "user-bima",
    hari: "selasa",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jadwal-3",
    dokterId: "user-bima",
    hari: "kamis",
    jamMulai: "09:00",
    jamSelesai: "15:00",
  },
  {
    id: "jadwal-4",
    dokterId: "user-sinta",
    hari: "rabu",
    jamMulai: "10:00",
    jamSelesai: "16:00",
  },
  {
    id: "jadwal-5",
    dokterId: "user-sinta",
    hari: "jumat",
    jamMulai: "10:00",
    jamSelesai: "16:00",
  },
  {
    id: "jadwal-6",
    dokterId: "user-sinta",
    hari: "sabtu",
    jamMulai: "09:00",
    jamSelesai: "14:00",
  },
];

const JANJI_TEMU = [
  {
    id: "janji-101",
    pasienId: "user-andi",
    dokterId: "user-bima",
    layananId: "layanan-2",
    tanggal: "2026-10-15",
    jam: "09:30",
    keluhan: "Gigi geraham belakang ngilu saat minum dingin",
    status: "hadir",
    alasanBatal: "",
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
  },
];

const CATATAN_PERAWATAN = [
  {
    id: "catatan-1",
    janjiId: "janji-104",
    pasienId: "user-maya",
    dokterId: "user-bima",
    tindakan: "Gingivektomi minor & pembersihan plak subgingiva",
    catatan: "Kumur air garam hangat 2x sehari, kontrol jika masih nyeri dalam 3 hari",
  },
  {
    id: "catatan-2",
    janjiId: "janji-105",
    pasienId: "user-andi",
    dokterId: "user-bima",
    tindakan: "Pembersihan karang gigi ultrasonik rahang atas dan bawah",
    catatan: "Gunakan pasta gigi sensitif, hindari minuman terlalu dingin selama 48 jam",
  },
];

const SLOT_TERISI = [
  {
    id: "janji-101",
    dokterId: "user-bima",
    tanggal: "2026-10-15",
    jam: "09:30",
    durasiMenit: 60,
  },
  {
    id: "janji-102",
    dokterId: "user-sinta",
    tanggal: "2026-10-15",
    jam: "11:00",
    durasiMenit: 30,
  },
  {
    id: "janji-103",
    dokterId: "user-bima",
    tanggal: "2026-10-16",
    jam: "10:00",
    durasiMenit: 30,
  },
];

async function seed() {
  console.log("Memulai pengisian seed data Firestore...");

  // 1. users
  for (const u of USERS) {
    const { id, ...data } = u;
    await setDoc(doc(db, "users", id), {
      ...data,
      dibuatPada: Timestamp.now(),
    });
    console.log(`✓ users/${id} (${u.nama} - ${u.role})`);
  }

  // 2. layanan
  for (const l of LAYANAN) {
    const { id, ...data } = l;
    await setDoc(doc(db, "layanan", id), data);
    console.log(`✓ layanan/${id} (${l.nama})`);
  }

  // 3. jadwal_dokter
  for (const j of JADWAL_DOKTER) {
    const { id, ...data } = j;
    await setDoc(doc(db, "jadwal_dokter", id), data);
    console.log(`✓ jadwal_dokter/${id} (${j.dokterId} - ${j.hari})`);
  }

  // 4. janji_temu
  for (const jt of JANJI_TEMU) {
    const { id, ...data } = jt;
    await setDoc(doc(db, "janji_temu", id), {
      ...data,
      dibuatPada: Timestamp.now(),
    });
    console.log(`✓ janji_temu/${id} (${jt.status})`);
  }

  // 5. catatan_perawatan
  for (const cp of CATATAN_PERAWATAN) {
    const { id, ...data } = cp;
    await setDoc(doc(db, "catatan_perawatan", id), {
      ...data,
      dibuatPada: Timestamp.now(),
    });
    console.log(`✓ catatan_perawatan/${id}`);
  }

  // 6. slot_terisi
  for (const st of SLOT_TERISI) {
    const { id, ...data } = st;
    await setDoc(doc(db, "slot_terisi", id), data);
    console.log(`✓ slot_terisi/${id}`);
  }

  console.log("\nSemua koleksi PRD 7.1 berhasil diisi ke Cloud Firestore!");
}

seed().catch((err) => {
  console.error("Gagal melakukan seed Firestore:", err);
  process.exit(1);
});
