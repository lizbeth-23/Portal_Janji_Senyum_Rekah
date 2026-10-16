"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { LoadingState, EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Stethoscope,
  Clock,
  User,
  Sparkles,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";

export default function DasborDokterPage() {
  const router = useRouter();
  const { janjiList, users, activeUser, getUserById, getLayananById } = useApp();

  const [loading, setLoading] = useState(true);

  // Doctors list for quick switching/testing
  const dokterList = useMemo(() => {
    return users.filter((u) => u.role === "dokter");
  }, [users]);

  // Default to currently logged in doctor or drg. Bima
  const [currentDoctorId, setCurrentDoctorId] = useState(
    activeUser?.role === "dokter" ? activeUser.id : "user-bima"
  );

  useEffect(() => {
    if (activeUser?.role === "dokter") {
      setCurrentDoctorId(activeUser.id);
    }
  }, [activeUser]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const todayStr = "2026-10-15"; // Seed date context

  // PRD 4.9: "Perilaku otomatis: hanya janji dengan dokterId miliknya yang tampil. Janji drg. Sinta tidak terlihat oleh drg. Bima."
  const todayAppointments = useMemo(() => {
    return janjiList
      .filter((j) => j.dokterId === currentDoctorId && j.tanggal === todayStr)
      .sort((a, b) => a.jam.localeCompare(b.jam));
  }, [janjiList, currentDoctorId, todayStr]);

  const activeDoctor = getUserById(currentDoctorId);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header & Doctor Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#5798D7]" />
              Dasbor Pemeriksaan Dokter
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Jadwal pasien hari ini ({todayStr}) untuk pemeriksaan dan pengisian tindakan klinis
            </p>
          </div>

          {/* Perspective doctor selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-2 rounded-xl border border-gray-200 shadow-sm text-xs">
            <span className="text-gray-400 font-semibold">Pilih Dokter:</span>
            <select
              value={currentDoctorId}
              onChange={(e) => setCurrentDoctorId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 font-bold text-[#5798D7] focus:outline-none"
            >
              {dokterList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PRD 4.9 Notice: isolation of doctor appointments */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span>
              Sedang menampilkan antrean <strong>{activeDoctor?.nama}</strong>. Janji dokter lain tidak ditampilkan di dasbor ini (PRD 4.9).
            </span>
          </div>
          <span className="font-bold tabular-nums text-[#7C3AED]">
            {todayAppointments.filter((j) => j.status === "hadir").length} Siap Diperiksa
          </span>
        </div>

        {/* Table of Today's appointments (PRD 4.9) */}
        {loading ? (
          <LoadingState message="Memuat jadwal pasien hari ini..." />
        ) : todayAppointments.length === 0 ? (
          <EmptyState
            title="Tidak Ada Jadwal Pasien Hari Ini"
            description={`Tidak ada pasien yang terjadwal untuk ${activeDoctor?.nama} pada tanggal ${todayStr}.`}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Jam</th>
                    <th className="py-3.5 px-5">Pasien</th>
                    <th className="py-3.5 px-5">Layanan</th>
                    <th className="py-3.5 px-5">Keluhan Pasien</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {todayAppointments.map((janji) => {
                    const pasien = getUserById(janji.pasienId);
                    const layanan = getLayananById(janji.layananId);
                    const isHadir = janji.status === "hadir";

                    return (
                      <tr
                        key={janji.id}
                        onClick={() => router.push(`/dokter/janji/${janji.id}`)}
                        className={`cursor-pointer transition-colors ${
                          isHadir
                            ? "bg-purple-50/40 hover:bg-purple-50/80 font-medium"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-4 px-5 font-bold text-[#5798D7] tabular-nums">
                          {janji.jam} WITA
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-bold text-gray-900 block">
                            {pasien?.nama || "Pasien"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            ID: {pasien?.id}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-semibold text-gray-700">
                          {layanan?.nama || "Pemeriksaan Gigi"}
                        </td>
                        <td className="py-4 px-5 max-w-xs text-gray-600 truncate italic">
                          "{janji.keluhan || "-"}"
                        </td>
                        <td className="py-4 px-5">
                          {/* PRD 4.9: Janji Hadir ditandai “Siap diperiksa” */}
                          {isHadir ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#7C3AED] text-white shadow-sm animate-pulse">
                              <Sparkles className="w-3.5 h-3.5" />
                              Siap diperiksa
                            </span>
                          ) : (
                            <StatusBadge status={janji.status} />
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold ${
                              isHadir
                                ? "text-[#7C3AED] underline"
                                : "text-[#5798D7]"
                            }`}
                          >
                            {isHadir ? "Mulai Periksa →" : "Detail →"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
