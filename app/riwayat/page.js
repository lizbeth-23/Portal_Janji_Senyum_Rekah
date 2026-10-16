"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { LoadingState, EmptyState, ErrorState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  ClipboardCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export default function RiwayatPerawatanPage() {
  const { janjiList, catatanList, activeUser, getUserById, getLayananById } = useApp();

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // PRD 4.4: daftar janji berstatus Selesai dengan Tanggal, Dokter, Layanan, Tindakan, dan Catatan dokter, dari yang terbaru. Hanya milik pasien yang masuk.
  const patientId = activeUser?.id;
  const completedJanji = janjiList
    .filter((j) => {
      const isOwner = activeUser?.role === "super_admin" ? true : j.pasienId === patientId;
      return isOwner && j.status === "selesai";
    })
    .sort((a, b) => new Date(`${b.tanggal}T${b.jam}`) - new Date(`${a.tanggal}T${a.jam}`));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Riwayat Perawatan Gigi
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Tindakan medis dan catatan instruksi dokter dari kunjungan yang telah selesai
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#15A66A] text-xs font-semibold self-start sm:self-auto border border-emerald-100">
            <ClipboardCheck className="w-3.5 h-3.5" />
            Rekam Catatan Resmi
          </div>
        </div>

        {/* States Feedback */}
        {loading ? (
          <LoadingState message="Memuat riwayat kunjungan dan catatan medis Anda..." />
        ) : hasError ? (
          <ErrorState onRetry={() => setHasError(false)} />
        ) : completedJanji.length === 0 ? (
          <EmptyState
            title="Belum Ada Riwayat Perawatan"
            description="Anda belum memiliki kunjungan berstatus Selesai. Catatan perawatan akan otomatis muncul di sini setelah Anda diperiksa oleh dokter gigi."
          />
        ) : (
          <div className="space-y-4">
            {completedJanji.map((janji) => {
              const dokter = getUserById(janji.dokterId);
              const layanan = getLayananById(janji.layananId);
              // Find matching catatan in catatan_perawatan (PRD 7.1)
              const catatanMedis = catatanList.find((c) => c.janjiId === janji.id);

              return (
                <div
                  key={janji.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5 hover:border-[#5798D7]/30 transition-all"
                >
                  {/* Top Visit Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center font-bold text-lg">
                        🦷
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          {layanan?.nama || "Perawatan Gigi"}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {dokter?.nama || "drg."}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 tabular-nums">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {janji.tanggal}
                          </span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status="selesai" />
                  </div>

                  {/* Keluhan Semula */}
                  {janji.keluhan && (
                    <div className="text-xs text-gray-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-gray-400 font-semibold block mb-0.5">
                        Keluhan Saat Datang:
                      </span>
                      <p className="italic">"{janji.keluhan}"</p>
                    </div>
                  )}

                  {/* Tindakan dan Catatan Dokter (PRD 4.4) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#E6F1FA]/30 border border-[#E6F1FA]/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#5798D7] mb-2">
                        <Stethoscope className="w-4 h-4" />
                        Tindakan Dokter:
                      </div>
                      <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-medium">
                        {catatanMedis?.tindakan || "Pemeriksaan dan tindakan klinis standar."}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/30 border border-emerald-100/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#15A66A] mb-2">
                        <ClipboardCheck className="w-4 h-4" />
                        Catatan & Anjuran Dokter:
                      </div>
                      <p className="text-xs md:text-sm text-gray-800 leading-relaxed">
                        {catatanMedis?.catatan ||
                          "Jaga kebersihan gigi, sikat gigi rutin 2 kali sehari."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
