"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { LoadingState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  BarChart3,
  Calendar,
  Stethoscope,
  Activity,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

function LaporanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { janjiList, users, layanan } = useApp();

  const [loading, setLoading] = useState(true);

  // Month selector from URL or default to "2026-10" (PRD 4.16)
  const initialMonth = searchParams.get("bulan") || "2026-10";
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  useEffect(() => {
    setSelectedMonth(searchParams.get("bulan") || "2026-10");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleMonthChange = (e) => {
    const newM = e.target.value;
    setSelectedMonth(newM);
    router.replace(`/admin/laporan?bulan=${newM}`);
  };

  // Doctors list
  const dokterList = useMemo(() => {
    return users.filter((u) => u.role === "dokter");
  }, [users]);

  // PRD 4.16: "kunjungan dihitung dari janji berstatus Selesai. Bulan yang dipilih tersimpan di alamat halaman."
  const finishedVisitsThisMonth = useMemo(() => {
    return janjiList.filter((j) => {
      return j.status === "selesai" && j.tanggal.startsWith(selectedMonth);
    });
  }, [janjiList, selectedMonth]);

  // 1. Table 1: Kunjungan per Dokter
  const visitsPerDokter = useMemo(() => {
    return dokterList.map((doc) => {
      const count = finishedVisitsThisMonth.filter((j) => j.dokterId === doc.id).length;
      return {
        ...doc,
        totalKunjungan: count,
      };
    });
  }, [dokterList, finishedVisitsThisMonth]);

  // 2. Table 2: Kunjungan per Layanan
  const visitsPerLayanan = useMemo(() => {
    return layanan.map((lay) => {
      const count = finishedVisitsThisMonth.filter((j) => j.layananId === lay.id).length;
      return {
        ...lay,
        totalKunjungan: count,
      };
    });
  }, [layanan, finishedVisitsThisMonth]);

  // Month name formatting in Indonesian
  const monthLabel = useMemo(() => {
    try {
      const [year, month] = selectedMonth.split("-");
      const d = new Date(Number(year), Number(month) - 1, 1);
      return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    } catch {
      return selectedMonth;
    }
  }, [selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#5798D7]" />
            Laporan Kunjungan Klinik Gigi
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Rekapitulasi jumlah pasien selesai diperiksa per dokter dan per layanan per bulan
          </p>
        </div>

        {/* Month Selector (PRD 4.16: tersimpan di URL) */}
        <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[#5798D7]" />
          <span className="text-xs font-semibold text-gray-700">Pilih Periode:</span>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="text-xs font-bold text-[#5798D7] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none"
          >
            <option value="2026-10">Oktober 2026</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">Agustus 2026</option>
            <option value="2026-11">November 2026</option>
          </select>
        </div>
      </div>

      {/* Overview Stat Card */}
      <div className="bg-gradient-to-r from-[#5798D7] to-[#366da2] rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider block">
            Total Kunjungan Pasien Selesai
          </span>
          <h2 className="text-3xl font-extrabold tabular-nums mt-1">
            {finishedVisitsThisMonth.length}{" "}
            <span className="text-sm font-medium text-sky-100">Kunjungan</span>
          </h2>
          <p className="text-xs text-sky-100 mt-1">
            Periode: <strong>{monthLabel}</strong>
          </p>
        </div>

        <div className="text-[11px] text-sky-100/90 bg-white/10 p-3 rounded-xl border border-white/20 max-w-xs">
          * Perhitungan otomatis ditarik dari seluruh janji temu dengan status{" "}
          <strong>Selesai</strong> (PRD 4.16).
        </div>
      </div>

      {/* PRD 4.16: Batasan v1 */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-500">
        <strong>Batasan PRD v1 (Bab 4.16 & 9):</strong> Ekspor Excel/PDF serta perhitungan pendapatan tarif tidak termasuk dalam ruang lingkup v1.
      </div>

      {loading ? (
        <LoadingState message="Menghitung rekapitulasi kunjungan..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TABEL 1: Kunjungan per Dokter (PRD 4.16) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Tabel 1: Kunjungan per Dokter
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Bulan {monthLabel}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-gray-500">
                Dokter Gigi
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Nama Dokter</th>
                    <th className="py-3 px-5">Email</th>
                    <th className="py-3 px-5 text-right">Jumlah Kunjungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {visitsPerDokter.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-5">
                        <span className="font-bold text-gray-900 block">
                          {doc.nama}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Spesialis Gigi
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-500 text-xs">
                        {doc.email}
                      </td>
                      <td className="py-4 px-5 text-right font-extrabold text-[#5798D7] tabular-nums text-sm">
                        {doc.totalKunjungan} Pasien
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL 2: Kunjungan per Layanan (PRD 4.16) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#15A66A] flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Tabel 2: Kunjungan per Layanan
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Bulan {monthLabel}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-gray-500">
                Tindakan Medis
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Nama Layanan</th>
                    <th className="py-3 px-5">Durasi</th>
                    <th className="py-3 px-5 text-right">Jumlah Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {visitsPerLayanan.map((lay) => (
                    <tr key={lay.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-5">
                        <span className="font-bold text-gray-900 block">
                          {lay.nama}
                        </span>
                        <span className="text-[11px] text-gray-400 tabular-nums">
                          Tarif: Rp {lay.harga.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 text-xs tabular-nums">
                        {lay.durasiMenit} Menit
                      </td>
                      <td className="py-4 px-5 text-right font-extrabold text-[#15A66A] tabular-nums text-sm">
                        {lay.totalKunjungan} Kali
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LaporanPage() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingState message="Memuat laporan klinik..." />}>
        <LaporanContent />
      </Suspense>
    </AppShell>
  );
}
