"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { LoadingState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  Calendar,
  Users,
  Activity,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function DasborAdminPage() {
  const router = useRouter();
  const { janjiList, users, layanan } = useApp();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const todayStr = "2026-10-15"; // Seed date
  const currentMonthStr = "2026-10";

  // PRD 4.12 Metrics:
  // 1. Kunjungan hari ini: jumlah janji berstatus Selesai hari ini
  const visitsToday = useMemo(() => {
    return janjiList.filter(
      (j) => j.status === "selesai" && j.tanggal === todayStr
    ).length;
  }, [janjiList, todayStr]);

  // 2. Kunjungan bulan ini: jumlah janji berstatus Selesai bulan ini
  const visitsThisMonth = useMemo(() => {
    return janjiList.filter(
      (j) => j.status === "selesai" && j.tanggal.startsWith(currentMonthStr)
    ).length;
  }, [janjiList, currentMonthStr]);

  // 3. Menunggu konfirmasi: jumlah janji berstatus Menunggu
  const waitingConfirmation = useMemo(() => {
    return janjiList.filter((j) => j.status === "menunggu").length;
  }, [janjiList]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#5798D7]" />
              Dasbor Super Admin
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Selamat datang Bu Ratna, pemilik Klinik Gigi Senyum Rekah
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6F1FA] text-[#5798D7] border border-[#E6F1FA] text-xs font-semibold self-start sm:self-auto">
            Akses Penuh Seluruh Modul
          </div>
        </div>

        {/* PRD 4.12 Cards: Kunjungan Hari Ini, Kunjungan Bulan Ini, Menunggu Konfirmasi */}
        {loading ? (
          <LoadingState message="Memuat metrik operasional klinik..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Kunjungan Hari Ini */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Kunjungan Hari Ini
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-[#15A66A]">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tabular-nums">
                {visitsToday}
              </h2>
              <p className="text-[11px] text-gray-500">
                Pasien telah selesai diperiksa hari ini ({todayStr})
              </p>
            </div>

            {/* Card 2: Kunjungan Bulan Ini (Mengklik membuka /admin/laporan) */}
            <div
              onClick={() => router.push(`/admin/laporan?bulan=${currentMonthStr}`)}
              className="cursor-pointer bg-gradient-to-br from-[#5798D7] to-[#366da2] rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                  Kunjungan Bulan Ini
                </span>
                <div className="p-2 rounded-xl bg-white/20 text-white group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold tabular-nums">
                {visitsThisMonth}
              </h2>
              <p className="text-[11px] text-sky-100 flex items-center justify-between pt-1">
                <span>Total kunjungan selesai Okt 2026</span>
                <span className="font-bold underline text-white">Buka Laporan →</span>
              </p>
            </div>

            {/* Card 3: Menunggu Konfirmasi */}
            <div
              onClick={() => router.push("/resepsionis/janji?status=menunggu")}
              className="cursor-pointer bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-amber-300 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Menunggu Konfirmasi
                </span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-amber-600 tabular-nums">
                {waitingConfirmation}
              </h2>
              <p className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                <span>Perlu tindakan resepsionis</span>
                <span className="font-semibold text-amber-600">Periksa →</span>
              </p>
            </div>
          </div>
        )}

        {/* Super Admin Control Center Links (PRD 4.12) */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Pengelolaan Operasional Klinik
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/pengguna"
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#5798D7]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">Kelola Pengguna</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ubah peran (role) akun dan nonaktifkan pengguna
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-[#5798D7] flex items-center gap-1">
                Buka Pengguna <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/admin/layanan"
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#5798D7]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15A66A] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">Layanan Klinik</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Atur nama tindakan, durasi (kelipatan 30m), & tarif
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-[#15A66A] flex items-center gap-1">
                Kelola Layanan <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/admin/jadwal-dokter"
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#5798D7]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">Jadwal Dokter</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Atur hari praktik (Senin-Sabtu) dan jam praktik dokter
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-[#7C3AED] flex items-center gap-1">
                Atur Jadwal <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/admin/laporan"
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#5798D7]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">Laporan Bulanan</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Rekap kunjungan selesai per dokter dan per layanan
                </p>
              </div>
              <span className="mt-4 text-xs font-bold text-[#2563EB] flex items-center gap-1">
                Lihat Laporan <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
