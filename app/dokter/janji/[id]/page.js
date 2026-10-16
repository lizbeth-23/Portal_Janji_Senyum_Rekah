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
  Stethoscope,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  ClipboardList,
} from "lucide-react";

export default function PemeriksaanDokterPage() {
  const params = useParams();
  const router = useRouter();
  const {
    janjiList,
    catatanList,
    activeUser,
    getUserById,
    getLayananById,
    completePemeriksaan,
  } = useApp();

  const [tindakan, setTindakan] = useState("");
  const [catatan, setCatatan] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const janji = useMemo(() => {
    return janjiList.find((j) => j.id === params.id);
  }, [janjiList, params.id]);

  // Existing medical note if already examined
  const existingCatatan = useMemo(() => {
    if (!janji) return null;
    return catatanList.find((c) => c.janjiId === janji.id);
  }, [janji, catatanList]);

  // PRD 4.10 Validation:
  // "hanya janji milik dokter itu yang berstatus Hadir yang bisa diisi. Bila ID diganti dengan janji dokter lain, tampil 'Janji tidak ditemukan'."
  const isDoctorValid = useMemo(() => {
    if (!janji) return false;
    // If super admin or matching doctorId
    if (activeUser?.role === "super_admin") return true;
    if (activeUser?.role === "dokter" && janji.dokterId !== activeUser.id) {
      return false; // Not this doctor's appointment
    }
    return true;
  }, [janji, activeUser]);

  if (!janji || !isDoctorValid) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-12">
          <EmptyState
            title="Janji tidak ditemukan"
            description="Janji temu tidak ditemukan atau Anda tidak berwenang memeriksa janji dokter lain (PRD 4.10)."
            action={
              <Link
                href="/dokter"
                className="px-4 py-2 bg-[#5798D7] text-white text-xs font-semibold rounded-xl"
              >
                Kembali ke Dasbor Dokter
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  const pasien = getUserById(janji.pasienId);
  const dokter = getUserById(janji.dokterId);
  const layanan = getLayananById(janji.layananId);

  // Can doctor fill examination?
  // Only when status is 'hadir' and not already completed (PRD 4.10)
  const canFillExam = janji.status === "hadir" && !existingCatatan;

  const handleValidateAndOpenConfirm = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!tindakan.trim()) {
      setErrorMsg("Tindakan medis wajib diisi.");
      return;
    }

    if (!catatan.trim()) {
      setErrorMsg("Catatan instruksi dokter wajib diisi.");
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    completePemeriksaan(janji.id, tindakan.trim(), catatan.trim());
    setConfirmOpen(false);
    setSuccessMsg(
      "Pemeriksaan berhasil diselesaikan! Catatan perawatan tersimpan dan pasien dapat membacanya langsung di Riwayat Perawatan."
    );
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/dokter" className="hover:text-[#5798D7] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dasbor Dokter
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Pemeriksaan #{janji.id}</span>
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
              <span className="text-xs font-semibold text-[#5798D7] uppercase tracking-wider block">
                Pemeriksaan Klinis Pasien
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                {pasien?.nama || "Pasien"}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Dokter Pemeriksa: <strong>{dokter?.nama}</strong> | Layanan: {layanan?.nama}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={janji.status} className="text-sm px-3.5 py-1.5" />

              {/* PRD 4.10: Link ke Riwayat Pasien */}
              <Link
                href={`/dokter/pasien/${janji.pasienId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6F1FA] hover:bg-[#E6F1FA] text-[#5798D7] text-xs font-semibold transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Lihat riwayat pasien
              </Link>
            </div>
          </div>

          {/* Info Pasien & Keluhan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5798D7]" />
                Jadwal Kunjungan
              </span>
              <p className="font-bold text-gray-900 tabular-nums pt-0.5">
                {janji.tanggal} pukul {janji.jam} WITA
              </p>
              <p className="text-[11px] text-gray-500">
                Layanan: {layanan?.nama} ({layanan?.durasiMenit} menit)
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#5798D7]" />
                Keluhan Pasien
              </span>
              <p className="font-medium text-gray-800 italic pt-0.5">
                "{janji.keluhan || "Tidak ada keluhan spesifik."}"
              </p>
            </div>
          </div>

          {/* Form Pemeriksaan atau Tampilan Catatan Selesai */}
          {janji.status === "selesai" || existingCatatan ? (
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#15A66A]">
                <CheckCircle2 className="w-4 h-4" />
                Pemeriksaan Telah Selesai Ditangani
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 block mb-1">
                  Tindakan yang Diberikan:
                </span>
                <p className="text-xs md:text-sm text-gray-900 bg-white p-3 rounded-xl border border-emerald-100 font-medium">
                  {existingCatatan?.tindakan || "Tindakan klinis telah dilakukan."}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 block mb-1">
                  Catatan & Instruksi Pasien:
                </span>
                <p className="text-xs md:text-sm text-gray-900 bg-white p-3 rounded-xl border border-emerald-100">
                  {existingCatatan?.catatan || "Instruksi dokter telah disampaikan."}
                </p>
              </div>
            </div>
          ) : !canFillExam ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Pemeriksaan hanya dapat diisi jika pasien telah tiba di klinik dan berstatus{" "}
                <strong>Hadir (Siap diperiksa)</strong> (PRD 4.10). Status janji saat ini:{" "}
                <strong>{janji.status}</strong>.
              </span>
            </div>
          ) : (
            // Form Pengisian Pemeriksaan (PRD 4.10 Step 3)
            <form onSubmit={handleValidateAndOpenConfirm} className="space-y-5 pt-2">
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#5798D7]" />
                  Formulir Tindakan Medis & Catatan Dokter
                </h3>
                <p className="text-xs text-gray-500">
                  Isi tindakan perawatan yang telah dilakukan serta instruksi pasca tindakan untuk pasien.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Tindakan (PRD 4.10) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tindakan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tindakan}
                  onChange={(e) => setTindakan(e.target.value)}
                  placeholder="Contoh: Tambal gigi dengan komposit..."
                  className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
                />
              </div>

              {/* Catatan (PRD 4.10) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Catatan Pasien <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Hindari makanan keras dan minuman terlalu dingin selama 24 jam..."
                  className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
                />
              </div>

              {/* Button: Tandai Selesai (PRD 4.10) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#15A66A] hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Tandai Selesai & Simpan Catatan Perawatan
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Konfirmasi Dokter Selesai (PRD 5.4) */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Tandai Pemeriksaan Selesai?"
          message="Apakah Anda yakin ingin menyelesaikan pemeriksaan untuk pasien ini? Catatan perawatan akan disimpan dan pasien dapat langsung membaca hasilnya."
          confirmLabel="Ya, Selesaikan Pemeriksaan"
          confirmVariant="success"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </AppShell>
  );
}
