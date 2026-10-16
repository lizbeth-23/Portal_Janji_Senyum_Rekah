"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function BerandaPasienPage() {
  const router = useRouter();
  const { janjiList, activeUser, getUserById, getLayananById } = useApp();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate brief state loading (PRD 5.4 4-states)
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter appointments for the patient (or show all if super_admin viewing)
  const patientId = activeUser?.id;
  const myJanjiList = janjiList.filter((j) => {
    if (activeUser?.role === "super_admin") return true;
    return j.pasienId === patientId;
  });

  // Sort upcoming by date (non-cancelled / active first)
  const activeUpcoming = myJanjiList
    .filter((j) => j.status !== "dibatalkan" && j.status !== "selesai")
    .sort((a, b) => new Date(`${a.tanggal}T${a.jam}`) - new Date(`${b.tanggal}T${b.jam}`));

  const nearestJanji = activeUpcoming[0] || null;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#5798D7] to-[#366da2] rounded-2xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-sky-100 text-xs font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B9C255]" />
              Selamat Datang di Senyum <span className="text-[#B9C255] font-semibold">Rekah</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Halo, {activeUser?.nama || "Pasien"}! 👋
            </h1>
            <p className="mt-1 text-sky-100 text-sm max-w-xl leading-relaxed">
              Jaga kesehatan gigi dan senyum ceria Anda bersama tim dokter gigi profesional kami.
            </p>
          </div>

          <Link
            href="/janji/baru"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#B9C255] hover:bg-[#A4AD45] text-white font-semibold text-sm shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Buat Janji Temu Baru
          </Link>
        </div>

        {/* Section: Janji Terdekat (PRD 4.2) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5798D7]" />
              Janji Terdekat Anda
            </h2>
            <Link
              href="/janji"
              className="text-xs font-semibold text-[#5798D7] hover:underline flex items-center gap-1"
            >
              Lihat Semua Janji
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingState message="Memeriksa jadwal janji terdekat..." />
          ) : nearestJanji ? (
            // Card Janji Terdekat
            <div
              onClick={() => router.push(`/janji/${nearestJanji.id}`)}
              className="cursor-pointer bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#5798D7]/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    🦷
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#5798D7] transition-colors">
                      {getLayananById(nearestJanji.layananId)?.nama || "Layanan Gigi"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Dokter: <span className="font-medium text-gray-700">{getUserById(nearestJanji.dokterId)?.nama || "drg. Spesialis"}</span>
                    </p>
                  </div>
                </div>

                <StatusBadge status={nearestJanji.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2.5 text-gray-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-[#5798D7]" />
                  <span>
                    Tanggal: <strong className="text-gray-900 tabular-nums">{nearestJanji.tanggal}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-gray-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <Clock className="w-4 h-4 text-[#5798D7]" />
                  <span>
                    Slot Jam: <strong className="text-gray-900 tabular-nums">{nearestJanji.jam} WITA</strong>
                  </span>
                </div>
              </div>

              {nearestJanji.keluhan && (
                <div className="mt-3.5 text-xs text-gray-600">
                  <span className="text-gray-400 font-medium">Keluhan: </span>
                  <span className="italic">"{nearestJanji.keluhan}"</span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-end text-xs font-semibold text-[#5798D7]">
                Klik untuk rincian & batalkan janji →
              </div>
            </div>
          ) : (
            // PRD 4.2: Bila tidak ada, tampil "Belum ada janji"
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Belum ada janji</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Anda belum memiliki janji temu aktif. Buat janji sekarang untuk memeriksa kesehatan gigi Anda.
              </p>
              <div className="mt-5">
                <Link
                  href="/janji/baru"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5798D7] text-white text-xs font-semibold hover:bg-[#4483C2] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tombol Cepat Buat Janji
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Info & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#15A66A] flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Konfirmasi Mudah</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Janji Anda akan langsung dikonfirmasi oleh resepsionis kami tanpa harus menunggu pesan WhatsApp.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Batas Waktu Batal (H-1)</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Pasien dapat membatalkan janji secara mandiri paling lambat sehari sebelum jadwal (H-1).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Catatan Perawatan</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Setelah selesai diperiksa dokter, hasil dan instruksi perawatan dapat langsung dibaca di Riwayat Perawatan.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
