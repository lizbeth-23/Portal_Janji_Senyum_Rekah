"use client";

import React, { useState, useMemo, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Clock,
  Plus,
  Stethoscope,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function JadwalDokterAdminPage() {
  const { users, jadwalDokter, addJadwalDokter } = useApp();

  const dokterList = useMemo(() => {
    return users.filter((u) => u.role === "dokter");
  }, [users]);

  const [selectedDokterId, setSelectedDokterId] = useState(
    dokterList[0]?.id || "user-bima"
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [hari, setHari] = useState("senin");
  const [jamMulai, setJamMulai] = useState("09:00");
  const [jamSelesai, setJamSelesai] = useState("15:00");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const selectedDokter = dokterList.find((d) => d.id === selectedDokterId);

  // Doctor's current schedules
  const currentSchedules = useMemo(() => {
    const dayOrder = {
      senin: 1,
      selasa: 2,
      rabu: 3,
      kamis: 4,
      jumat: 5,
      sabtu: 6,
    };
    return jadwalDokter
      .filter((j) => j.dokterId === selectedDokterId)
      .sort((a, b) => (dayOrder[a.hari] || 99) - (dayOrder[b.hari] || 99));
  }, [jadwalDokter, selectedDokterId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validations (PRD 4.15):
    // "hari hanya Senin sampai Sabtu. Jam selesai setelah jam mulai. Satu dokter satu jadwal per hari."
    const allowedDays = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
    if (!allowedDays.includes(hari.toLowerCase())) {
      setErrorMsg("Hari praktik hanya boleh Senin sampai Sabtu (Klinik libur Minggu).");
      return;
    }

    if (jamSelesai <= jamMulai) {
      setErrorMsg("Jam selesai harus setelah jam mulai praktik.");
      return;
    }

    const alreadyScheduled = jadwalDokter.some(
      (j) =>
        j.dokterId === selectedDokterId &&
        j.hari.toLowerCase() === hari.toLowerCase()
    );
    if (alreadyScheduled) {
      setErrorMsg(`Dokter ${selectedDokter?.nama} sudah memiliki jadwal praktik pada hari ${hari}. Satu dokter hanya boleh satu jadwal per hari.`);
      return;
    }

    addJadwalDokter({
      dokterId: selectedDokterId,
      hari: hari.toLowerCase(),
      jamMulai,
      jamSelesai,
    });

    setSuccessMsg(`Jadwal hari ${hari} (${jamMulai} - ${jamSelesai}) untuk ${selectedDokter?.nama} berhasil disimpan! Pasien dapat langsung memilih hari ini.`);
    setModalOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#5798D7]" />
              Kelola Jadwal Dokter
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Atur hari dan jam operasional praktik dokter gigi (Senin - Sabtu)
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5798D7] hover:bg-[#4483C2] text-white text-xs md:text-sm font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Hari Praktik
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15A66A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Doctor Selector Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500">Pilih Dokter Gigi:</span>
          <div className="flex flex-wrap gap-2">
            {dokterList.map((doc) => {
              const active = selectedDokterId === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDokterId(doc.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#5798D7] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {doc.nama}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedules Grid / Table */}
        {loading ? (
          <LoadingState message="Memuat jadwal praktik dokter..." />
        ) : currentSchedules.length === 0 ? (
          <EmptyState
            title="Belum Ada Jadwal Praktik"
            description={`Dokter ${selectedDokter?.nama} belum memiliki jadwal praktik tersimpan.`}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Hari Praktik: {selectedDokter?.nama}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Slot jam janji pasien akan otomatis dihitung dari rentang jam mulai hingga selesai.
                </p>
              </div>
              <span className="text-xs font-bold text-[#5798D7] bg-[#E6F1FA] px-2.5 py-1 rounded-lg">
                {currentSchedules.length} Hari Aktif
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Hari Praktik</th>
                    <th className="py-3.5 px-5">Jam Mulai</th>
                    <th className="py-3.5 px-5">Jam Selesai</th>
                    <th className="py-3.5 px-5">Status Ketersediaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {currentSchedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-bold text-gray-900 capitalize block">
                          {sch.hari}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-semibold text-gray-800 tabular-nums">
                        {sch.jamMulai} WITA
                      </td>

                      <td className="py-4 px-5 font-semibold text-gray-800 tabular-nums">
                        {sch.jamSelesai} WITA
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#15A66A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15A66A]" />
                          Dapat Dipilih Pasien
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Tambah Hari Praktik (PRD 4.15) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Tambah Hari Praktik Dokter
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Atur hari kerja untuk <strong>{selectedDokter?.nama}</strong>
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pilih Hari Praktik <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={hari}
                    onChange={(e) => setHari(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white capitalize"
                  >
                    <option value="senin">Senin</option>
                    <option value="selasa">Selasa</option>
                    <option value="rabu">Rabu</option>
                    <option value="kamis">Kamis</option>
                    <option value="jumat">Jumat</option>
                    <option value="sabtu">Sabtu</option>
                  </select>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Validasi PRD: Hari hanya Senin sampai Sabtu.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Jam Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      placeholder="09:00"
                      className="w-full text-xs tabular-nums bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Jam Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={jamSelesai}
                      onChange={(e) => setJamSelesai(e.target.value)}
                      placeholder="15:00"
                      className="w-full text-xs tabular-nums bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#5798D7] hover:bg-[#4483C2] rounded-xl shadow-sm"
                  >
                    Simpan Jadwal Praktik
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
