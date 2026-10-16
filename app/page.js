"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Shield,
  UserCheck,
  ArrowRight,
  Sparkles,
  Stethoscope,
  ClipboardList,
  Heart,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#1F2937]">
      {/* Top Navbar */}
      <nav className="h-16 bg-[#5798D7] text-white flex items-center justify-between px-6 md:px-12 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl shadow-xs">
            🦷
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide block">
              PORTAL JANJI SENYUM <span className="text-[#B9C255]">REKAH</span>
            </span>
            <span className="text-[11px] text-sky-100 hidden sm:block">
              Klinik Gigi Makassar · Buka Senin - Sabtu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/masuk"
            className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="px-4 py-2 text-xs font-semibold text-[#5798D7] bg-white hover:bg-[#E6F1FA] rounded-lg shadow-sm transition-colors"
          >
            Daftar Pasien
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F1FA] border border-[#B9C255]/50 text-gray-800 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#B9C255]" />
          <span>Sistem Janji Temu & Catatan Perawatan Klinik Gigi</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Senyum Sehat & <span className="text-[#B9C255]">Rekah</span>, <br className="hidden sm:inline" />
          <span className="text-[#5798D7]">Pesan Janji Tanpa Menunggu</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Pilih dokter gigi favoritmu, tentukan slot jam kosong secara real-time,
          dan nikmati perawatan gigi tanpa antrean bentrok.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/janji/baru"
            className="px-6 py-3 bg-[#B9C255] hover:bg-[#A4AD45] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Buat Janji Sekarang
          </Link>
          <Link
            href="/beranda"
            className="px-6 py-3 bg-white hover:bg-[#E6F1FA] text-[#5798D7] font-semibold text-sm rounded-xl border border-[#5798D7]/30 shadow-sm transition-all flex items-center gap-2"
          >
            Buka Beranda Pasien
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Role Access Cards (PRD Bab 4 Modules) */}
        <div className="mt-16 text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 text-center">
            Jelajahi Modul Empat Peran (PRD Bab 4)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pasien */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Pasien</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Andi & Maya: Buat janji, lihat jadwal, dan baca riwayat perawatan.
              </p>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/beranda"
                  className="block text-[#5798D7] font-medium hover:underline"
                >
                  → /beranda (Janji Terdekat)
                </Link>
                <Link
                  href="/janji"
                  className="block text-[#5798D7] font-medium hover:underline"
                >
                  → /janji (Daftar Janji)
                </Link>
                <Link
                  href="/riwayat"
                  className="block text-[#5798D7] font-medium hover:underline"
                >
                  → /riwayat (Riwayat Perawatan)
                </Link>
              </div>
            </div>

            {/* Resepsionis */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Resepsionis</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Laras: Konfirmasi, jadwal ulang, batalkan, dan tandai hadir.
              </p>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/resepsionis"
                  className="block text-[#2563EB] font-medium hover:underline"
                >
                  → /resepsionis (Dasbor Hari Ini)
                </Link>
                <Link
                  href="/resepsionis/janji"
                  className="block text-[#2563EB] font-medium hover:underline"
                >
                  → /resepsionis/janji (Kelola Janji)
                </Link>
                <Link
                  href="/resepsionis/pasien"
                  className="block text-[#2563EB] font-medium hover:underline"
                >
                  → /resepsionis/pasien (Data Kontak)
                </Link>
              </div>
            </div>

            {/* Dokter */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Dokter</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                drg. Bima & drg. Sinta: Jadwal praktik, periksa pasien hadir, isi catatan.
              </p>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/dokter"
                  className="block text-[#7C3AED] font-medium hover:underline"
                >
                  → /dokter (Dasbor Pemeriksaan)
                </Link>
                <Link
                  href="/dokter/janji/janji-101"
                  className="block text-[#7C3AED] font-medium hover:underline"
                >
                  → /dokter/janji/[id] (Pemeriksaan)
                </Link>
                <Link
                  href="/dokter/pasien/user-andi"
                  className="block text-[#7C3AED] font-medium hover:underline"
                >
                  → /dokter/pasien/[id] (Riwayat)
                </Link>
              </div>
            </div>

            {/* Super Admin */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#15A66A] flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Super Admin</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Bu Ratna: Laporan klinik, pengguna, tarif layanan, & jadwal dokter.
              </p>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/admin"
                  className="block text-[#15A66A] font-medium hover:underline"
                >
                  → /admin (Dasbor Admin)
                </Link>
                <Link
                  href="/admin/pengguna"
                  className="block text-[#15A66A] font-medium hover:underline"
                >
                  → /admin/pengguna (Kelola Pengguna)
                </Link>
                <Link
                  href="/admin/layanan"
                  className="block text-[#15A66A] font-medium hover:underline"
                >
                  → /admin/layanan (Layanan & Tarif)
                </Link>
                <Link
                  href="/admin/laporan"
                  className="block text-[#15A66A] font-medium hover:underline"
                >
                  → /admin/laporan (Laporan Kunjungan)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 py-8 bg-white border-t border-gray-200 text-center text-xs text-gray-500">
        <p className="font-semibold text-gray-700">Klinik Gigi Senyum Rekah Makassar</p>
        <p className="mt-1">
          Buka Senin – Sabtu | Alamat: Makassar, Sulawesi Selatan | janji.senyumrekah.id
        </p>
      </footer>
    </div>
  );
}
