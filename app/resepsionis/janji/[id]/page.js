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
  ArrowLeft,
  CheckCircle,
  XCircle,
  UserCheck,
  RotateCcw,
  AlertCircle,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function RincianKelolaJanjiPage() {
  const params = useParams();
  const router = useRouter();
  const {
    janjiList,
    jadwalDokter,
    slotTerisi,
    getUserById,
    getLayananById,
    confirmJanji,
    rescheduleJanji,
    cancelJanji,
    markHadir,
  } = useApp();

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null, // "konfirmasi" | "hadir" | "batal" | "jadwal_ulang"
    title: "",
    message: "",
    confirmLabel: "",
    confirmVariant: "primary",
  });

  const [alasanBatalInput, setAlasanBatalInput] = useState("");
  const [batalModalOpen, setBatalModalOpen] = useState(false);

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  const janji = useMemo(() => {
    return janjiList.find((j) => j.id === params.id);
  }, [janjiList, params.id]);

  if (!janji) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-12">
          <EmptyState
            title="Janji tidak ditemukan"
            description="ID Janji temu tidak ditemukan dalam database."
            action={
              <Link
                href="/resepsionis/janji"
                className="px-4 py-2 bg-[#5798D7] text-white text-xs font-semibold rounded-xl"
              >
                Kembali ke Kelola Janji
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

  // Validations per PRD 4.7
  const isFinishedOrCancelled =
    janji.status === "selesai" || janji.status === "dibatalkan";

  // Konfirmasi hanya untuk janji Menunggu (PRD 4.7)
  const canConfirm = janji.status === "menunggu";

  // Tandai Hadir hanya untuk janji Dikonfirmasi pada hari ini (PRD 4.7)
  // Context date is "2026-10-15" (or allow today comparison)
  const todayStr = "2026-10-15";
  const canMarkHadir =
    janji.status === "dikonfirmasi" &&
    (janji.tanggal === todayStr ||
      janji.tanggal === new Date().toISOString().split("T")[0]);

  // Jadwal ulang & Batalkan
  const canModify = !isFinishedOrCancelled;

  // Calculate slots for reschedule
  const availableRescheduleSlots = useMemo(() => {
    if (!janji.dokterId || !newDate || !layanan) return [];

    const dateObj = new Date(newDate);
    const dayNames = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
    const dayName = dayNames[dateObj.getDay()];

    const schedule = jadwalDokter.find(
      (j) => j.dokterId === janji.dokterId && j.hari.toLowerCase() === dayName
    );
    if (!schedule) return [];

    const [startH, startM] = schedule.jamMulai.split(":").map(Number);
    const [endH, endM] = schedule.jamSelesai.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const durasi = layanan.durasiMenit || 30;

    const occupied = slotTerisi.filter(
      (s) => s.dokterId === janji.dokterId && s.tanggal === newDate && s.id !== janji.id
    );

    const slots = [];
    for (let time = startMinutes; time + durasi <= endMinutes; time += 30) {
      const h = Math.floor(time / 60);
      const m = time % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      const slotEndMinutes = time + durasi;
      const isColliding = occupied.some((occ) => {
        const [occH, occM] = occ.jam.split(":").map(Number);
        const occStart = occH * 60 + occM;
        const occEnd = occStart + (occ.durasiMenit || 30);
        return time < occEnd && slotEndMinutes > occStart;
      });

      if (!isColliding) {
        slots.push(timeStr);
      }
    }
    return slots;
  }, [janji, newDate, layanan, jadwalDokter, slotTerisi]);

  const handleActionClick = (type) => {
    if (type === "konfirmasi") {
      setDialogState({
        isOpen: true,
        type: "konfirmasi",
        title: "Konfirmasi Janji Pasien",
        message: `Apakah Anda ingin mengonfirmasi janji pasien ${pasien?.nama} pada ${janji.tanggal} pukul ${janji.jam}?`,
        confirmLabel: "Ya, Konfirmasi Janji",
        confirmVariant: "primary",
      });
    } else if (type === "hadir") {
      setDialogState({
        isOpen: true,
        type: "hadir",
        title: "Tandai Pasien Hadir di Klinik",
        message: `Pasien ${pasien?.nama} sudah tiba di klinik? Janji akan diteruskan ke Dasbor Dokter sebagai "Siap Diperiksa".`,
        confirmLabel: "Ya, Tandai Hadir",
        confirmVariant: "success",
      });
    }
  };

  const executeDialogAction = () => {
    if (dialogState.type === "konfirmasi") {
      confirmJanji(janji.id);
    } else if (dialogState.type === "hadir") {
      markHadir(janji.id);
    }
    setDialogState({ isOpen: false, type: null });
  };

  const handleSaveReschedule = () => {
    if (!newDate || !newSlot) {
      setRescheduleError("Pilih tanggal dan slot jam kosong baru.");
      return;
    }
    rescheduleJanji(janji.id, newDate, newSlot);
    setRescheduleModalOpen(false);
    setNewDate("");
    setNewSlot("");
    setRescheduleError("");
  };

  const handleConfirmBatal = () => {
    if (!alasanBatalInput.trim()) return;
    cancelJanji(janji.id, alasanBatalInput.trim());
    setBatalModalOpen(false);
    setAlasanBatalInput("");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link
            href="/resepsionis/janji"
            className="hover:text-[#5798D7] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Kelola Janji
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Kelola Janji #{janji.id}</span>
        </div>

        {/* Card Detail Janji */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Kelola Janji Resepsionis
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                {pasien?.nama || "Pasien"}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Nomor HP: <span className="font-mono text-gray-800 font-semibold">{pasien?.noHp || "-"}</span> | Email: {pasien?.email}
              </p>
            </div>

            <StatusBadge status={janji.status} className="text-sm px-3.5 py-1.5" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5798D7]" />
                Jadwal Janji Temu
              </span>
              <p className="font-bold text-gray-900 text-sm tabular-nums pt-1">
                {janji.tanggal} pukul {janji.jam} WITA
              </p>
              <p className="text-[11px] text-gray-500">
                Layanan: <strong className="text-gray-700">{layanan?.nama}</strong> ({layanan?.durasiMenit} menit)
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
              <p className="text-[11px] text-gray-500">
                Klinik Gigi Senyum Rekah Makassar
              </p>
            </div>
          </div>

          {/* Keluhan */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs md:text-sm">
            <span className="text-gray-400 text-xs font-semibold block mb-1">
              Keluhan Pasien:
            </span>
            <p className="text-gray-800 italic">
              "{janji.keluhan || "Tidak ada keluhan dicatat."}"
            </p>
          </div>

          {/* PRD 2.4 & 4.7 Requirement Notice:
              "Rincian untuk resepsionis tidak menampilkan catatan perawatan." */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              Catatan perawatan medis dirahasiakan dan tidak ditampilkan kepada staf resepsionis (Sesuai PRD Bab 2.4).
            </span>
          </div>

          {/* Alasan Batal bila status dibatalkan */}
          {janji.status === "dibatalkan" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935]">
              <p className="font-bold">Janji Ini Telah Dibatalkan</p>
              <p className="mt-1">
                Alasan: {janji.alasanBatal || "Tidak ada rincian alasan."}
              </p>
            </div>
          )}

          {/* Action Buttons for Resepsionis (PRD 4.7) */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
            {isFinishedOrCancelled ? (
              <span className="text-xs text-gray-400 font-medium italic">
                Janji yang sudah Selesai atau Dibatalkan tidak dapat diubah lagi (PRD 4.7).
              </span>
            ) : (
              <>
                {/* 1. Konfirmasi (hanya janji Menunggu) */}
                {canConfirm && (
                  <button
                    type="button"
                    onClick={() => handleActionClick("konfirmasi")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Konfirmasi Janji
                  </button>
                )}

                {/* 2. Tandai Hadir (hanya janji Dikonfirmasi pada hari ini) */}
                {canMarkHadir && (
                  <button
                    type="button"
                    onClick={() => handleActionClick("hadir")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    Tandai Pasien Hadir
                  </button>
                )}

                {/* 3. Jadwal Ulang */}
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                  Jadwal Ulang
                </button>

                {/* 4. Batalkan (Wajib Alasan) */}
                <button
                  type="button"
                  onClick={() => setBatalModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#E53935] border border-red-200 text-xs font-semibold transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Batalkan Janji
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Konfirmasi Umum (PRD 5.4) */}
        <ConfirmDialog
          isOpen={dialogState.isOpen}
          title={dialogState.title}
          message={dialogState.message}
          confirmLabel={dialogState.confirmLabel}
          confirmVariant={dialogState.confirmVariant}
          onConfirm={executeDialogAction}
          onCancel={() => setDialogState({ isOpen: false, type: null })}
        />

        {/* Modal Batalkan dengan Alasan Wajib (PRD 4.7) */}
        {batalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100">
              <div className="flex items-center gap-3 text-[#E53935] mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-bold text-gray-900">
                  Batalkan Janji Temu
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Sesuai PRD 4.7, resepsionis wajib mengisi alasan pembatalan janji:
              </p>
              <textarea
                required
                rows={3}
                value={alasanBatalInput}
                onChange={(e) => setAlasanBatalInput(e.target.value)}
                placeholder="Contoh: Pasien berhalangan hadir karena dinas ke luar kota..."
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E53935]"
              />
              <div className="mt-5 flex justify-end gap-2.5">
                <button
                  onClick={() => setBatalModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  disabled={!alasanBatalInput.trim()}
                  onClick={handleConfirmBatal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#E53935] hover:bg-red-700 rounded-xl disabled:opacity-50"
                >
                  Ya, Batalkan Janji
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Jadwal Ulang (PRD 4.7 Step 3) */}
        {rescheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Jadwal Ulang Janji Pasien
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Pilih tanggal dan slot jam kosong baru untuk dokter {dokter?.nama}.
                </p>
              </div>

              {rescheduleError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-xs text-red-600">
                  {rescheduleError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tanggal Baru:
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setNewSlot("");
                  }}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pilih Slot Jam Baru:
                </label>
                {!newDate ? (
                  <p className="text-xs text-gray-400 italic">
                    Pilih tanggal terlebih dahulu
                  </p>
                ) : availableRescheduleSlots.length === 0 ? (
                  <p className="text-xs text-amber-600">
                    Tidak ada slot kosong yang tersedia pada hari tersebut.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableRescheduleSlots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewSlot(s)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg border tabular-nums ${
                          newSlot === s
                            ? "bg-[#5798D7] text-white border-[#5798D7]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#5798D7]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  onClick={() => setRescheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  disabled={!newDate || !newSlot}
                  onClick={handleSaveReschedule}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#5798D7] hover:bg-[#4483C2] rounded-xl disabled:opacity-50"
                >
                  Simpan Jadwal Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
