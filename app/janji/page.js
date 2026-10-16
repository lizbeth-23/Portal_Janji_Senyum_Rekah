"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import { Calendar, Clock, Plus, ChevronRight, Stethoscope } from "lucide-react";

export default function DaftarJanjiPage() {
  const router = useRouter();
  const { janjiList, activeUser, getUserById, getLayananById } = useApp();

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  // Filter janji milik pasien (atau semua jika super_admin)
  const patientId = activeUser?.id;
  const filteredJanji = janjiList
    .filter((j) => {
      if (activeUser?.role === "super_admin") return true;
      return j.pasienId === patientId;
    })
    .sort((a, b) => new Date(`${a.tanggal}T${a.jam}`) - new Date(`${b.tanggal}T${b.jam}`));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Janji Saya
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Daftar seluruh janji temu Anda di Klinik Gigi Senyum Rekah
            </p>
          </div>

          <Link
            href="/janji/baru"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5798D7] hover:bg-[#4483C2] text-white text-xs md:text-sm font-semibold rounded-xl shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Buat Janji Baru
          </Link>
        </div>

        {/* State Rendering */}
        {loading ? (
          <LoadingState message="Memuat daftar janji Anda..." />
        ) : hasError ? (
          <ErrorState onRetry={() => setHasError(false)} />
        ) : filteredJanji.length === 0 ? (
          <EmptyState
            title="Belum Ada Janji Temu"
            description="Anda belum memiliki daftar janji temu yang terdaftar di klinik kami."
            action={
              <Link
                href="/janji/baru"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5798D7] text-white text-xs font-semibold hover:bg-[#4483C2] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Buat Janji Sekarang
              </Link>
            }
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Tanggal</th>
                    <th className="py-3.5 px-5">Jam</th>
                    <th className="py-3.5 px-5">Dokter</th>
                    <th className="py-3.5 px-5">Layanan</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredJanji.map((janji) => {
                    const dokter = getUserById(janji.dokterId);
                    const layanan = getLayananById(janji.layananId);

                    return (
                      <tr
                        key={janji.id}
                        onClick={() => router.push(`/janji/${janji.id}`)}
                        className="hover:bg-[#E6F1FA]/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-4 px-5 font-semibold text-gray-900 tabular-nums">
                          {janji.tanggal}
                        </td>
                        <td className="py-4 px-5 font-medium text-gray-700 tabular-nums">
                          {janji.jam} WITA
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-semibold text-gray-900 block">
                            {dokter?.nama || "Dokter Gigi"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            Spesialis Gigi
                          </span>
                        </td>
                        <td className="py-4 px-5 font-medium text-gray-700">
                          {layanan?.nama || "Layanan Gigi"}
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge status={janji.status} />
                        </td>
                        <td className="py-4 px-5 text-right">
                          <span className="inline-flex items-center text-xs font-semibold text-[#5798D7] group-hover:translate-x-0.5 transition-transform">
                            Rincian →
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredJanji.map((janji) => {
                const dokter = getUserById(janji.dokterId);
                const layanan = getLayananById(janji.layananId);

                return (
                  <div
                    key={janji.id}
                    onClick={() => router.push(`/janji/${janji.id}`)}
                    className="p-4 hover:bg-[#E6F1FA]/30 cursor-pointer transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">
                          {layanan?.nama || "Layanan Gigi"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {dokter?.nama || "drg."}
                        </p>
                      </div>
                      <StatusBadge status={janji.status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 bg-slate-50 p-2.5 rounded-lg tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#5798D7]" />
                        <span>{janji.tanggal}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#5798D7]" />
                        <span>{janji.jam} WITA</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-400 truncate max-w-[200px]">
                        {janji.keluhan ? `"${janji.keluhan}"` : ""}
                      </span>
                      <span className="font-semibold text-[#5798D7] flex items-center gap-0.5">
                        Lihat <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
