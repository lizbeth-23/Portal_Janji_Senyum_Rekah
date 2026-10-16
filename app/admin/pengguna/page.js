"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import { Users, Search, ChevronRight, Shield, Mail } from "lucide-react";

export default function KelolaPenggunaPage() {
  const router = useRouter();
  const { users } = useApp();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.nama.toLowerCase().includes(search.toLowerCase().trim()) ||
        u.email.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [users, search]);

  const getRoleBadge = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-emerald-50 text-[#15A66A] border-emerald-200";
      case "dokter":
        return "bg-purple-50 text-[#7C3AED] border-purple-200";
      case "resepsionis":
        return "bg-blue-50 text-[#2563EB] border-blue-200";
      case "pasien":
      default:
        return "bg-[#E6F1FA] text-[#5798D7] border-[#5798D7]/30";
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-[#5798D7]" />
              Kelola Pengguna
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Daftar seluruh akun pengguna sistem, ubah hak peran atau status akun
            </p>
          </div>

          <div className="text-xs font-semibold text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-200">
            Total: <strong className="text-[#5798D7]">{filteredUsers.length}</strong> pengguna
          </div>
        </div>

        {/* Search Bar (PRD 4.13) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email pengguna..."
              className="w-full text-xs md:text-sm bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <LoadingState message="Memuat daftar pengguna..." />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="Pengguna Tidak Ditemukan"
            description={`Tidak ada akun yang cocok dengan kata kunci "${search}".`}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Nama</th>
                    <th className="py-3.5 px-5">Email</th>
                    <th className="py-3.5 px-5">Peran (Role)</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => router.push(`/admin/pengguna/${u.id}`)}
                      className="hover:bg-[#E6F1FA]/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-[#5798D7] font-bold text-xs flex items-center justify-center">
                            {u.nama.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 group-hover:text-[#5798D7] transition-colors block">
                              {u.nama}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              HP: {u.noHp || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-gray-600">
                        {u.email}
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getRoleBadge(
                            u.role
                          )}`}
                        >
                          {u.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.aktif
                              ? "bg-emerald-50 text-[#15A66A]"
                              : "bg-red-50 text-[#E53935]"
                          }`}
                        >
                          {u.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-[#5798D7] group-hover:translate-x-0.5 transition-transform">
                          Ubah Peran →
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
