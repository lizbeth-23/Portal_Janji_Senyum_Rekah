"use client";

import React, { useState, useMemo, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import { Users, Search, Phone, Mail, ShieldAlert } from "lucide-react";

export default function DataPasienPage() {
  const { users } = useApp();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Filter only patients (PRD 4.8)
  const patients = useMemo(() => {
    return users.filter((u) => u.role === "pasien");
  }, [users]);

  // Search by name (PRD 4.8: Laras mengetik "Andi" untuk mendapat nomor HP-nya)
  const filteredPatients = useMemo(() => {
    return patients.filter((p) =>
      p.nama.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [patients, search]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Data Kontak Pasien
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Daftar kontak pasien terdaftar untuk keperluan konfirmasi janji dan pemanggilan
            </p>
          </div>

          <div className="text-xs font-semibold text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-200">
            Total: <strong className="text-[#5798D7]">{filteredPatients.length}</strong> pasien
          </div>
        </div>

        {/* PRD 4.8 Notice: Batasan v1: resepsionis tidak bisa membaca catatan perawatan dari halaman mana pun */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Batasan Hak Akses:</strong> Resepsionis hanya memiliki hak akses melihat informasi kontak (Nama, Email, No HP). Catatan perawatan medis dirahasiakan dan tidak dapat dibaca dari halaman mana pun.
          </span>
        </div>

        {/* Search input (PRD 4.8) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pasien (contoh: Andi)..."
              className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <LoadingState message="Memuat kontak pasien..." />
        ) : filteredPatients.length === 0 ? (
          <EmptyState
            title="Pasien Tidak Ditemukan"
            description={`Tidak ada pasien yang cocok dengan pencarian "${search}".`}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Nama Lengkap</th>
                    <th className="py-3.5 px-5">Alamat Email</th>
                    <th className="py-3.5 px-5">Nomor HP</th>
                    <th className="py-3.5 px-5">Status Akun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {filteredPatients.map((pasien) => (
                    <tr key={pasien.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E6F1FA] text-[#5798D7] font-bold text-xs flex items-center justify-center">
                            {pasien.nama.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900">{pasien.nama}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{pasien.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-gray-900 tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#5798D7]" />
                          <span>{pasien.noHp || "-"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            pasien.aktif
                              ? "bg-emerald-50 text-[#15A66A]"
                              : "bg-red-50 text-[#E53935]"
                          }`}
                        >
                          {pasien.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
