"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  User,
  Activity,
  ArrowLeft,
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function RincianJanjiPasienPage() {
  const params = useParams();
  const router = useRouter();
  const { janjiList, activeUser, getUserById, getLayananById, cancelJanji } = useApp();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const janji = useMemo(() => {
    return janjiList.find((j) => j.id === params.id);
  }, [janjiList, params.id]);

  // Validate ownership (PRD 4.3.2: Bila ID diganti dengan janji orang lain, tampil "Janji tidak ditemukan")
  const isValidOwner = useMemo(() => {
    if (!janji) return false;
    if (activeUser?.role === "super_admin") return true; // Super admin can view
    return janji.pasienId === activeUser?.id;
  }, [janji, activeUser]);

  // Cancellation rule: PRD 4.3.2
  // "Pasien hanya bisa membatalkan janji Menunggu atau Dikonfirmasi, paling lambat H-1. Pada hari janji tombol Batalkan tidak tampil."
  const canCancel = useMemo(() => {
    if (!janji) return false;
    if (janji.status !== "menunggu" && janji.status !== "dikonfirmasi") return false;

    // Compare appointment date with today (must be at least tomorrow / H-1)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const apptDate = new Date(janji.tanggal);
    apptDate.setHours(0, 0, 0, 0);

    // If apptDate <= today, it's today or past, button must not appear
    return apptDate > today;
  }, [janji]);

  if (!janji || !isValidOwner) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-12">
          <EmptyState
            title="Janji tidak ditemukan"
            description="Janji yang Anda cari tidak ada atau Anda tidak memiliki akses untuk melihat janji pasien lain."
            action={
              <Link
                href="/janji"
                className="px-4 py-2 bg-[#5798D7] text-white text-xs font-semibold rounded-xl hover:bg-[#4483C2] transition-colors"
              >
                Kembali ke Janji Saya
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const dokter = getUserById(janji.dokterId);
  const pasien = getUserById(janji.pasienId);
  const layanan = getLayananById(janji.layananId);

  const handleConfirmCancel = () => {
    cancelJanji(janji.id, "Dibatalkan oleh pasien sendiri melalui portal.");
    setConfirmOpen(false);
    setSuccessMsg("Janji temu berhasil dibatalkan. Slot jam kini kembali kosong.");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/janji" className="hover:text-[#5798D7] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Janji
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Rincian Janji #{janji.id}</span>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15A66A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-medium text-gray-400 block uppercase tracking-wider">
                Rincian Janji Temu
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                {layanan?.nama || "Pemeriksaan Gigi"}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                ID Janji: <span className="font-mono text-gray-700">{janji.id}</span>
              </p>
            </div>

            <StatusBadge status={janji.status} className="text-sm px-3.5 py-1.5" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs md:text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5798D7]" />
                Tanggal & Jam
              </span>
              <p className="font-bold text-gray-900 text-sm tabular-nums pt-1">
                {janji.tanggal} pukul {janji.jam} WITA
              </p>
              <p className="text-[11px] text-gray-500">
                Durasi estimasi: {layanan?.durasiMenit || 30} menit
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#5798D7]" />
                Dokter Pemeriksa
              </span>
              <p className="font-bold text-gray-900 text-sm pt-1">
                {dokter?.nama || "Dokter Gigi"}
              </p>
              <p className="text-[11px] text-gray-500">Klinik Gigi Senyum Rekah</p>
            </div>
          </div>

          {/* Keluhan */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs md:text-sm">
            <span className="text-gray-400 text-xs font-semibold block mb-1">
              Keluhan Pasien:
            </span>
            <p className="text-gray-800 italic leading-relaxed">
              "{janji.keluhan || "Tidak ada keluhan khusus yang dicatat."}"
            </p>
          </div>

          {/* PRD 4.3.2: Bila dibatalkan resepsionis, alasannya ikut tampil */}
          {janji.status === "dibatalkan" && janji.alasanBatal && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Alasan Pembatalan:</p>
                <p className="mt-0.5">{janji.alasanBatal}</p>
              </div>
            </div>
          )}

          {/* Biaya info */}
          {layanan && (
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#E6F1FA]/50 border border-[#E6F1FA] text-xs">
              <span className="text-gray-600">Perkiraan Biaya Perawatan:</span>
              <span className="font-bold text-[#5798D7] tabular-nums text-sm">
                Rp {layanan.harga.toLocaleString("id-ID")}
              </span>
            </div>
          )}

          {/* Action: Batalkan Janji (PRD 4.3.2) */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-gray-400">
              * Pembatalan mandiri hanya berlaku hingga H-1 sebelum tanggal janji.
            </div>

            {canCancel && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#E53935] border border-red-200 text-xs font-semibold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Batalkan Janji Ini
              </button>
            )}
          </div>
        </div>

        {/* Modal Konfirmasi Pembatalan (PRD 5.4) */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Batalkan Janji Temu?"
          message="Apakah Anda yakin ingin membatalkan janji temu ini? Slot jam yang telah Anda pesan akan dibebaskan kembali untuk pasien lain."
          confirmLabel="Ya, Batalkan Janji"
          cancelLabel="Kembali"
          confirmVariant="danger"
          onConfirm={handleConfirmCancel}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </AppShell>
  );
}
