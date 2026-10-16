"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Info,
  ArrowLeft,
} from "lucide-react";

export default function BuatJanjiPage() {
  const router = useRouter();
  const {
    users,
    layanan,
    jadwalDokter,
    slotTerisi,
    addJanji,
    activeUser,
  } = useApp();

  // Active services only (PRD 4.3.1)
  const activeLayananList = useMemo(() => {
    return layanan.filter((l) => l.aktif);
  }, [layanan]);

  // Doctors list
  const dokterList = useMemo(() => {
    return users.filter((u) => u.role === "dokter" && u.aktif);
  }, [users]);

  // Form State
  const [selectedLayananId, setSelectedLayananId] = useState("");
  const [selectedDokterId, setSelectedDokterId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Selected Service details
  const selectedLayanan = useMemo(() => {
    return layanan.find((l) => l.id === selectedLayananId);
  }, [layanan, selectedLayananId]);

  // Practice days of chosen doctor
  const doctorPracticeDays = useMemo(() => {
    if (!selectedDokterId) return [];
    return jadwalDokter
      .filter((j) => j.dokterId === selectedDokterId)
      .map((j) => j.hari.toLowerCase());
  }, [jadwalDokter, selectedDokterId]);

  // Calculate available time slots for the doctor on chosen date (PRD 4.3.1)
  const availableSlots = useMemo(() => {
    if (!selectedDokterId || !selectedDate || !selectedLayanan) return [];

    // Check day of the week
    const dateObj = new Date(selectedDate);
    const dayNames = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
    const dayName = dayNames[dateObj.getDay()];

    const schedule = jadwalDokter.find(
      (j) => j.dokterId === selectedDokterId && j.hari.toLowerCase() === dayName
    );

    if (!schedule) return [];

    // Parse jamMulai and jamSelesai
    const [startH, startM] = schedule.jamMulai.split(":").map(Number);
    const [endH, endM] = schedule.jamSelesai.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const serviceDuration = selectedLayanan.durasiMenit || 30;

    // Slots already occupied for this doctor on this date (from slot_terisi)
    const occupiedForDoctor = slotTerisi.filter(
      (s) => s.dokterId === selectedDokterId && s.tanggal === selectedDate
    );

    const slots = [];
    for (let time = startMinutes; time + serviceDuration <= endMinutes; time += 30) {
      const h = Math.floor(time / 60);
      const m = time % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

      // Check collision
      const slotEndMinutes = time + serviceDuration;
      const isColliding = occupiedForDoctor.some((occ) => {
        const [occH, occM] = occ.jam.split(":").map(Number);
        const occStart = occH * 60 + occM;
        const occEnd = occStart + (occ.durasiMenit || 30);
        // Overlap condition
        return time < occEnd && slotEndMinutes > occStart;
      });

      if (!isColliding) {
        slots.push(timeStr);
      }
    }

    return slots;
  }, [selectedDokterId, selectedDate, selectedLayanan, jadwalDokter, slotTerisi]);

  // Tomorrow date string for minimum date validation (PRD 4.3.1: "tanggal paling cepat besok")
  const minDateStr = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedLayananId) {
      setErrorMsg("Silakan pilih Layanan.");
      return;
    }
    if (!selectedDokterId) {
      setErrorMsg("Silakan pilih Dokter Gigi.");
      return;
    }
    if (!selectedDate) {
      setErrorMsg("Silakan pilih Tanggal Janji.");
      return;
    }
    if (selectedDate < minDateStr) {
      setErrorMsg("Tanggal janji paling cepat adalah besok.");
      return;
    }
    if (!selectedSlot) {
      setErrorMsg("Silakan pilih Slot Jam yang masih kosong.");
      return;
    }
    if (!keluhan.trim()) {
      setErrorMsg("Keluhan wajib diisi.");
      return;
    }

    // Check if slot was taken in the meantime (PRD 4.3.1)
    const alreadyTaken = slotTerisi.some(
      (s) =>
        s.dokterId === selectedDokterId &&
        s.tanggal === selectedDate &&
        s.jam === selectedSlot
    );
    if (alreadyTaken) {
      setErrorMsg("Slot ini baru saja terisi. Pilih jam lain.");
      return;
    }

    setSubmitting(true);
    const newId = addJanji({
      pasienId: activeUser?.id,
      dokterId: selectedDokterId,
      layananId: selectedLayananId,
      tanggal: selectedDate,
      jam: selectedSlot,
      keluhan: keluhan.trim(),
    });

    // Bring patient to appointment detail page (PRD 4.3.1 step 6)
    router.push(`/janji/${newId}`);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/janji" className="hover:text-[#5798D7] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Janji Saya
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Buat Janji Baru</span>
        </div>

        {/* Page Title */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F1FA] text-[#5798D7] text-xs font-semibold mb-3">
            <Calendar className="w-4 h-4" />
            Formulir Pemesanan Janji Temu
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Pesan Jadwal Perawatan Gigi
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Slot jam disusun setiap 30 menit dari jam praktik dokter dan otomatis menghitung durasi layanan.
          </p>

          {errorMsg && (
            <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Perhatian</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* 1. Pilih Layanan (PRD 4.3.1 Step 2) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Pilih Layanan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedLayananId}
                onChange={(e) => {
                  setSelectedLayananId(e.target.value);
                  setSelectedSlot("");
                }}
                className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              >
                <option value="">-- Pilih Layanan Gigi (Hanya Aktif) --</option>
                {activeLayananList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} — {item.durasiMenit} Menit (Rp {item.harga.toLocaleString("id-ID")})
                  </option>
                ))}
              </select>
              {selectedLayanan && (
                <div className="mt-2 text-[11px] text-[#5798D7] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Durasi estimasi: <strong>{selectedLayanan.durasiMenit} menit</strong> | Biaya:{" "}
                  <strong>Rp {selectedLayanan.harga.toLocaleString("id-ID")}</strong>
                </div>
              )}
            </div>

            {/* 2. Pilih Dokter (PRD 4.3.1 Step 3) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Pilih Dokter Gigi <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedDokterId}
                onChange={(e) => {
                  setSelectedDokterId(e.target.value);
                  setSelectedDate("");
                  setSelectedSlot("");
                }}
                className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              >
                <option value="">-- Pilih Dokter Gigi --</option>
                {dokterList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.nama} (Spesialis Gigi)
                  </option>
                ))}
              </select>
              {selectedDokterId && doctorPracticeDays.length > 0 && (
                <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Hari praktik dokter:{" "}
                  <span className="font-semibold capitalize text-gray-700">
                    {doctorPracticeDays.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* 3. Pilih Tanggal (PRD 4.3.1 Step 3 - minimal besok) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Pilih Tanggal Janji <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                min={minDateStr}
                value={selectedDate}
                disabled={!selectedDokterId}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot("");
                }}
                className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Validasi PRD: Tanggal paling cepat besok ({minDateStr}).
              </span>
            </div>

            {/* 4. Slot Jam Kosong (PRD 4.3.1 Step 4) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Pilih Slot Jam yang Masih Kosong <span className="text-red-500">*</span>
              </label>

              {!selectedDokterId || !selectedDate ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-gray-200 text-center text-xs text-gray-400">
                  Pilih dokter dan tanggal terlebih dahulu untuk melihat ketersediaan slot jam.
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Tidak ada slot kosong yang tersedia pada hari tersebut, atau dokter tidak memiliki jadwal praktik. Silakan pilih hari atau dokter lain.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border tabular-nums transition-all ${
                          isSelected
                            ? "bg-[#5798D7] text-white border-[#5798D7] shadow-sm scale-105"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#5798D7] hover:text-[#5798D7]"
                        }`}
                      >
                        {slot} WITA
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Keluhan Pasien (PRD 4.3.1 Step 5) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Keluhan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Contoh: Gigi geraham kiri ngilu saat mengunyah makanan keras..."
                className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-6 bg-[#5798D7] hover:bg-[#4483C2] text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                {submitting ? "Menyimpan Janji..." : "Kirim & Buat Janji Temu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
