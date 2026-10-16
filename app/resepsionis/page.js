"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { LoadingState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

export default function DasborResepsionisPage() {
  const router = useRouter();
  const { janjiList, users, getUserById, getLayananById } = useApp();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Doctors list (2 doctors: drg. Bima & drg. Sinta)
  const doctors = useMemo(() => {
    return users.filter((u) => u.role === "dokter");
  }, [users]);

  // Appointments today (let's use today's date "2026-10-15" from PRD seed context)
  const todayStr = "2026-10-15";

  // Menunggu konfirmasi count (PRD 4.6)
  const waitingConfirmationList = useMemo(() => {
    return janjiList.filter((j) => j.status === "menunggu");
  }, [janjiList]);

  const waitingCount = waitingConfirmationList.length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Dasbor Resepsionis
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Pantau janji temu hari ini dan konfirmasi kehadiran pasien di klinik
            </p>
          </div>

          <Link
            href="/resepsionis/janji"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5798D7] hover:bg-[#4483C2] text-white text-xs md:text-sm font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <ClipboardList className="w-4 h-4" />
            Buka Kelola Semua Janji
          </Link>
        </div>

        {/* PRD 4.6: Kartu Menunggu Konfirmasi */}
        <div
          onClick={() => router.push("/resepsionis/janji?status=menunggu")}
          className="cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-2xl group-hover:scale-105 transition-transform">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">
                Menunggu Konfirmasi Resepsionis (PRD 4.6)
              </p>
              <h2 className="text-3xl font-extrabold tabular-nums tracking-tight mt-0.5">
                {waitingCount} <span className="text-sm font-medium text-amber-100">Janji</span>
              </h2>
              <p className="text-xs text-amber-100/90 mt-1">
                Klik angka ini untuk membuka Kelola Janji dengan saringan Menunggu →
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors">
            Periksa Sekarang <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* PRD 4.6: Janji Hari Ini: Satu Kolom per Dokter */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5798D7]" />
              Janji Hari Ini ({todayStr})
            </h2>
            <span className="text-xs text-gray-400">
              Satu kolom per dokter gigi praktek
            </span>
          </div>

          {loading ? (
            <LoadingState message="Memuat jadwal dokter hari ini..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map((doc) => {
                const docAppointments = janjiList
                  .filter((j) => j.dokterId === doc.id && j.tanggal === todayStr)
                  .sort((a, b) => a.jam.localeCompare(b.jam));

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                  >
                    {/* Doctor Header */}
                    <div className="p-5 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center font-bold">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">
                            {doc.nama}
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            Praktik Hari Ini
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700 tabular-nums">
                        {docAppointments.length} Pasien
                      </span>
                    </div>

                    {/* Appointments List for this doctor */}
                    <div className="p-4 flex-1 space-y-3">
                      {docAppointments.length === 0 ? (
                        <div className="py-8 text-center text-xs text-gray-400">
                          Tidak ada janji hari ini untuk {doc.nama}.
                        </div>
                      ) : (
                        docAppointments.map((j) => {
                          const pasien = getUserById(j.pasienId);
                          const layanan = getLayananById(j.layananId);

                          return (
                            <div
                              key={j.id}
                              onClick={() => router.push(`/resepsionis/janji/${j.id}`)}
                              className="p-3.5 rounded-xl border border-gray-100 hover:border-[#5798D7]/30 hover:bg-[#E6F1FA]/20 cursor-pointer transition-all space-y-2 group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#5798D7] tabular-nums bg-[#E6F1FA] px-2 py-0.5 rounded-md">
                                  {j.jam} WITA
                                </span>
                                <StatusBadge status={j.status} />
                              </div>

                              <div className="flex items-baseline justify-between text-xs">
                                <div>
                                  <span className="font-bold text-gray-900 group-hover:text-[#5798D7] transition-colors">
                                    {pasien?.nama || "Pasien"}
                                  </span>
                                  <span className="text-gray-500 block text-[11px]">
                                    {layanan?.nama || "Layanan"}
                                  </span>
                                </div>
                                <span className="text-[11px] text-gray-400 font-semibold group-hover:text-[#5798D7]">
                                  Kelola →
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
