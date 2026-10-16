"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";

export default function LayananAdminPage() {
  const { layanan, addLayanan, toggleLayanan } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [durasiMenit, setDurasiMenit] = useState(30);
  const [harga, setHarga] = useState("");
  const [aktif, setAktif] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim()) {
      setErrorMsg("Nama layanan wajib diisi.");
      return;
    }

    const durasi = Number(durasiMenit);
    // PRD 4.14: "Validasi: durasi kelipatan 30 menit."
    if (!durasi || durasi <= 0 || durasi % 30 !== 0) {
      setErrorMsg("Durasi wajib kelipatan 30 menit (contoh: 30, 60, 90 menit).");
      return;
    }

    const hargaNum = Number(harga);
    if (isNaN(hargaNum) || hargaNum < 0) {
      setErrorMsg("Harga layanan harus berupa angka positif.");
      return;
    }

    addLayanan({
      nama: nama.trim(),
      durasiMenit: durasi,
      harga: hargaNum,
      aktif,
    });

    setSuccessMsg(`Layanan "${nama.trim()}" berhasil ditambahkan dan langsung aktif!`);
    setModalOpen(false);
    setNama("");
    setDurasiMenit(30);
    setHarga("");
    setAktif(true);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#5798D7]" />
              Kelola Layanan Klinik
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Atur daftar tindakan medis gigi, estimasi durasi waktu, dan tarif pelayanan
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
            Tambah Layanan Baru
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15A66A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PRD 4.14 Rule Notice */}
        <div className="p-3.5 rounded-xl bg-[#E6F1FA]/70 border border-[#5798D7]/30 text-xs text-[#5798D7] flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            <strong>Ketentuan PRD 4.14:</strong> Durasi layanan wajib kelipatan 30 menit. Layanan yang pernah dipakai janji tidak dihapus, cukup dinonaktifkan statusnya.
          </span>
        </div>

        {/* Data Table */}
        {loading ? (
          <LoadingState message="Memuat daftar layanan..." />
        ) : layanan.length === 0 ? (
          <EmptyState
            title="Belum Ada Layanan"
            description="Tambahkan layanan klinik gigi pertama Anda."
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Nama Layanan</th>
                    <th className="py-3.5 px-5">Durasi Waktu</th>
                    <th className="py-3.5 px-5">Tarif Biaya</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {layanan.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-bold text-gray-900 block">
                          {item.nama}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          ID: {item.id}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-semibold text-gray-700 tabular-nums">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-gray-700">
                          {item.durasiMenit} Menit
                        </span>
                      </td>

                      <td className="py-4 px-5 font-bold text-[#5798D7] tabular-nums">
                        Rp {item.harga.toLocaleString("id-ID")}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.aktif
                              ? "bg-emerald-50 text-[#15A66A] border border-emerald-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {item.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => toggleLayanan(item.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            item.aktif
                              ? "bg-red-50 text-[#E53935] hover:bg-red-100"
                              : "bg-emerald-50 text-[#15A66A] hover:bg-emerald-100"
                          }`}
                        >
                          {item.aktif ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Tambah Layanan (PRD 4.14) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Tambah Layanan Gigi Baru
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan informasi tindakan medis dan tarif resmi klinik
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
                    Nama Layanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Cabut Gigi"
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Durasi (Menit) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={durasiMenit}
                    onChange={(e) => setDurasiMenit(Number(e.target.value))}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white"
                  >
                    <option value={30}>30 Menit</option>
                    <option value={60}>60 Menit (1 Jam)</option>
                    <option value={90}>90 Menit (1.5 Jam)</option>
                    <option value={120}>120 Menit (2 Jam)</option>
                  </select>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Validasi PRD: Harus kelipatan 30 menit.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Harga (Rupiah) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10000}
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 250000"
                    className="w-full text-xs tabular-nums bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="aktifCheckbox"
                    checked={aktif}
                    onChange={(e) => setAktif(e.target.checked)}
                    className="w-4 h-4 text-[#5798D7] rounded focus:ring-[#5798D7]"
                  />
                  <label
                    htmlFor="aktifCheckbox"
                    className="text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    Aktifkan langsung untuk dipilih di Buat Janji
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
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
                    Simpan Layanan
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
