"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  Calendar,
  User,
  ArrowLeft,
  FileText,
  Stethoscope,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";

export default function RiwayatPasienDokterPage() {
  const params = useParams();
  const { users, catatanList, janjiList, activeUser, getUserById, getLayananById } = useApp();

  const pasienId = params.id;
  const pasien = getUserById(pasienId);

  // Active doctor context (drg. Bima by default or current user if doctor)
  const currentDoctorId =
    activeUser?.role === "dokter" ? activeUser.id : "user-bima";

  const currentDoctor = getUserById(currentDoctorId);

  // PRD 4.11 & 2.4:
  // "berisi catatan perawatan Andi yang pernah ditulis drg. Bima: Tanggal, Layanan, Tindakan, Catatan. Bila ID diganti dengan pasien yang belum pernah ia tangani, tampil 'Pasien tidak ditemukan'."
  const catatanPasienOlehDokter = useMemo(() => {
    return catatanList.filter((c) => {
      const matchPatient = c.pasienId === pasienId;
      // Super admin can inspect all or match doctor
      const matchDoctor =
        activeUser?.role === "super_admin" ? true : c.dokterId === currentDoctorId;
      return matchPatient && matchDoctor;
    });
  }, [catatanList, pasienId, currentDoctorId, activeUser]);

  // If patient has never been treated by this doctor (PRD 4.11)
  if (!pasien || catatanPasienOlehDokter.length === 0) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-12">
          <EmptyState
            title="Pasien tidak ditemukan"
            description="Pasien ini belum pernah Anda tangani sebelumnya, atau Anda tidak memiliki akses untuk melihat riwayat perawatan pasien ini (PRD Bab 4.11)."
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
          <span className="text-gray-800 font-semibold">
            Riwayat Pasien: {pasien.nama}
          </span>
        </div>

        {/* Patient Profile Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center font-bold text-xl">
              {pasien.nama.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{pasien.nama}</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Nomor Kontak: <span className="font-mono text-gray-800 font-semibold">{pasien.noHp || "-"}</span> | Email: {pasien.email}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-semibold text-gray-400 block uppercase tracking-wider">
              Ditangani Oleh
            </span>
            <span className="text-xs font-bold text-[#5798D7]">
              {currentDoctor?.nama || "drg."}
            </span>
          </div>
        </div>

        {/* Notice of access restriction (PRD 2.4) */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-600 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#5798D7] shrink-0" />
          <span>
            Hanya menampilkan catatan perawatan yang pernah ditulis oleh Anda untuk pasien ini (Sesuai PRD Bab 2.4 & 4.11).
          </span>
        </div>

        {/* Medical History Records (PRD 4.11: Tanggal, Layanan, Tindakan, Catatan) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#5798D7]" />
            Daftar Tindakan Perawatan Sebelumnya
          </h2>

          {catatanPasienOlehDokter.map((record) => {
            const janji = janjiList.find((j) => j.id === record.janjiId);
            const layanan = getLayananById(janji?.layananId);

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">
                      {layanan?.nama || "Perawatan Gigi"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-[#5798D7]" />
                    <span>Tanggal: <strong>{janji?.tanggal || "Selesai"}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                  <div className="p-4 rounded-xl bg-[#E6F1FA]/40 border border-[#E6F1FA]">
                    <span className="font-bold text-[#5798D7] block text-xs mb-1">
                      Tindakan:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {record.tindakan}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-gray-600 block text-xs mb-1">
                      Catatan Dokter:
                    </span>
                    <p className="text-gray-800">
                      {record.catatan}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
