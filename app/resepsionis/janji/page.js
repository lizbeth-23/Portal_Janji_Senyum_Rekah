"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import { Calendar, Filter, Clock, Search, ChevronRight } from "lucide-react";

function KelolaJanjiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { janjiList, getUserById, getLayananById } = useApp();

  const [loading, setLoading] = useState(true);

  // Read filters from URL query parameters (PRD 4.7)
  const initialStatus = searchParams.get("status") || "semua";
  const initialTanggal = searchParams.get("tanggal") || "";

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [tanggalFilter, setTanggalFilter] = useState(initialTanggal);

  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "semua");
    setTanggalFilter(searchParams.get("tanggal") || "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const updateFilters = (newStatus, newTanggal) => {
    setStatusFilter(newStatus);
    setTanggalFilter(newTanggal);

    const params = new URLSearchParams();
    if (newStatus && newStatus !== "semua") params.set("status", newStatus);
    if (newTanggal) params.set("tanggal", newTanggal);

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/resepsionis/janji${queryStr}`);
  };

  const filteredJanji = useMemo(() => {
    return janjiList
      .filter((j) => {
        if (statusFilter !== "semua" && j.status !== statusFilter) return false;
        if (tanggalFilter && j.tanggal !== tanggalFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(`${a.tanggal}T${a.jam}`) - new Date(`${b.tanggal}T${b.jam}`));
  }, [janjiList, statusFilter, tanggalFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Kelola Janji Temu
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Daftar seluruh janji temu klinik, konfirmasi, jadwal ulang, atau tandai pasien hadir
          </p>
        </div>

        <div className="text-xs font-semibold text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-200">
          Total: <strong className="text-[#5798D7]">{filteredJanji.length}</strong> janji ditemukan
        </div>
      </div>

      {/* Saringan Status dan Tanggal (PRD 4.7: tersimpan di URL) */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Filter className="w-4 h-4 text-[#5798D7]" />
            Saring Status:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "semua", label: "Semua" },
              { id: "menunggu", label: "Menunggu" },
              { id: "dikonfirmasi", label: "Dikonfirmasi" },
              { id: "hadir", label: "Hadir" },
              { id: "selesai", label: "Selesai" },
              { id: "dibatalkan", label: "Dibatalkan" },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => updateFilters(tab.id, tanggalFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-[#5798D7] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Saring Tanggal */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
            Tanggal:
          </label>
          <input
            type="date"
            value={tanggalFilter}
            onChange={(e) => updateFilters(statusFilter, e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5798D7]"
          />
          {tanggalFilter && (
            <button
              onClick={() => updateFilters(statusFilter, "")}
              className="text-xs text-red-500 hover:underline px-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <LoadingState message="Memuat kelola janji temu..." />
      ) : filteredJanji.length === 0 ? (
        <EmptyState
          title="Tidak Ada Janji Temu Sesuai Saringan"
          description="Coba ubah saringan status atau reset saringan tanggal untuk melihat data janji lainnya."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Tanggal</th>
                  <th className="py-3.5 px-5">Jam</th>
                  <th className="py-3.5 px-5">Pasien</th>
                  <th className="py-3.5 px-5">Dokter</th>
                  <th className="py-3.5 px-5">Layanan</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredJanji.map((janji) => {
                  const pasien = getUserById(janji.pasienId);
                  const dokter = getUserById(janji.dokterId);
                  const layanan = getLayananById(janji.layananId);

                  return (
                    <tr
                      key={janji.id}
                      onClick={() => router.push(`/resepsionis/janji/${janji.id}`)}
                      className="hover:bg-[#E6F1FA]/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-5 font-semibold text-gray-900 tabular-nums">
                        {janji.tanggal}
                      </td>
                      <td className="py-4 px-5 font-medium text-gray-700 tabular-nums">
                        {janji.jam} WITA
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-gray-900 block">
                          {pasien?.nama || "Pasien"}
                        </span>
                        <span className="text-[11px] text-gray-400 tabular-nums">
                          {pasien?.noHp || "-"}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-medium text-gray-700">
                        {dokter?.nama || "Dokter"}
                      </td>
                      <td className="py-4 px-5 font-medium text-gray-700">
                        {layanan?.nama || "Layanan"}
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={janji.status} />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-[#5798D7] group-hover:translate-x-0.5 transition-transform">
                          Kelola →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KelolaJanjiPage() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingState message="Memuat halaman..." />}>
        <KelolaJanjiContent />
      </Suspense>
    </AppShell>
  );
}
