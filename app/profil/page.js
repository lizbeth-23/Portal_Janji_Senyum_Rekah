"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";

export default function ProfilPage() {
  const { activeUser, updateProfil } = useApp();

  const [nama, setNama] = useState(activeUser?.nama || "");
  const [noHp, setNoHp] = useState(activeUser?.noHp || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (activeUser) {
      setNama(activeUser.nama || "");
      setNoHp(activeUser.noHp || "");
    }
  }, [activeUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nama.trim()) {
      setErrorMsg("Nama tidak boleh kosong.");
      return;
    }

    if (noHp.trim() && !/^08\d{8,11}$/.test(noHp.trim())) {
      setErrorMsg("Nomor HP harus diawali 08 dan hanya angka (10-13 digit).");
      return;
    }

    updateProfil(activeUser.id, {
      nama: nama.trim(),
      noHp: noHp.trim(),
    });

    setSuccessMsg("Profil berhasil diperbarui!");
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Profil Pengguna
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Kelola data informasi akun Anda di Portal Janji Senyum Rekah
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15A66A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
          {/* Avatar & Role Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5798D7] to-[#B9C255] text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {activeUser?.nama ? activeUser.nama.charAt(0) : "U"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{activeUser?.nama}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F1FA] text-[#5798D7] border border-[#E6F1FA] capitalize">
                  {activeUser?.role || "pasien"}
                </span>
                <span className="text-xs text-gray-400">
                  Status: {activeUser?.aktif ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Nama (bisa diubah) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#5798D7]" />
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            {/* Nomor HP (bisa diubah) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5798D7]" />
                Nomor HP <span className="text-gray-400 font-normal">(format 08...)</span>
              </label>
              <input
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="081234567890"
                className="w-full text-xs md:text-sm tabular-nums bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            {/* Email (PRD 4.5: tidak bisa diubah dari halaman ini) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Alamat Email (Terkunci)
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Tidak dapat diubah
                </span>
              </label>
              <input
                type="email"
                disabled
                value={activeUser?.email || ""}
                className="w-full text-xs md:text-sm bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 cursor-not-allowed select-none"
              />
            </div>

            {/* Peran (PRD 4.5: tidak bisa diubah dari halaman ini) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  Peran Akun (Role)
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hanya diubah Super Admin
                </span>
              </label>
              <input
                type="text"
                disabled
                value={activeUser?.role || "pasien"}
                className="w-full text-xs md:text-sm bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 capitalize cursor-not-allowed select-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#5798D7] hover:bg-[#4483C2] text-white text-xs md:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
