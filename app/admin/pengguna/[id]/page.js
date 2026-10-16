"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/StateFeedback";
import { useApp } from "@/context/AppContext";
import {
  User,
  Mail,
  Phone,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  UserX,
  UserCheck,
  Save,
} from "lucide-react";

export default function RincianPenggunaAdminPage() {
  const params = useParams();
  const router = useRouter();
  const {
    users,
    activeUser,
    updateUserRole,
    toggleUserStatus,
  } = useApp();

  const userTarget = useMemo(() => {
    return users.find((u) => u.id === params.id);
  }, [users, params.id]);

  const [selectedRole, setSelectedRole] = useState(userTarget?.role || "pasien");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // "role" | "toggle_status"
    title: "",
    message: "",
    confirmLabel: "",
    confirmVariant: "primary",
  });

  if (!userTarget) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto py-12">
          <EmptyState
            title="Pengguna Tidak Ditemukan"
            description="Akun pengguna dengan ID tersebut tidak ditemukan."
            action={
              <Link
                href="/admin/pengguna"
                className="px-4 py-2 bg-[#5798D7] text-white text-xs font-semibold rounded-xl"
              >
                Kembali ke Kelola Pengguna
              </Link>
            }
          />
        </div>
      </AppShell>
    );
  }

  // PRD 4.13 Validation:
  // "Bu Ratna tidak bisa menonaktifkan atau menurunkan peran akunnya sendiri."
  const isSelf = userTarget.id === activeUser?.id || userTarget.id === "user-ratna";

  const handleRoleChangeSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isSelf && selectedRole !== "super_admin") {
      setErrorMsg("Anda tidak dapat menurunkan peran akun Super Admin Anda sendiri (PRD 4.13).");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      type: "role",
      title: "Ubah Peran Pengguna",
      message: `Ubah peran akun ${userTarget.nama} menjadi "${selectedRole}"? Pengguna akan langsung diarahkan ke halaman perannya saat masuk.`,
      confirmLabel: "Ya, Simpan Peran",
      confirmVariant: "primary",
    });
  };

  const handleToggleStatusClick = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (isSelf) {
      setErrorMsg("Anda tidak dapat menonaktifkan akun Anda sendiri (PRD 4.13).");
      return;
    }

    const nextState = !userTarget.aktif;
    setConfirmDialog({
      isOpen: true,
      type: "toggle_status",
      title: nextState ? "Aktifkan Akun Pengguna" : "Nonaktifkan Akun Pengguna",
      message: nextState
        ? `Aktifkan kembali akun ${userTarget.nama}?`
        : `Nonaktifkan akun ${userTarget.nama}? Akun nonaktif tidak akan bisa lagi membuka halaman portal (PRD 4.13).`,
      confirmLabel: nextState ? "Ya, Aktifkan" : "Ya, Nonaktifkan Akun",
      confirmVariant: nextState ? "success" : "danger",
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === "role") {
      updateUserRole(userTarget.id, selectedRole);
      setSuccessMsg(`Peran ${userTarget.nama} berhasil diubah menjadi "${selectedRole}"!`);
    } else if (confirmDialog.type === "toggle_status") {
      toggleUserStatus(userTarget.id);
      setSuccessMsg(
        userTarget.aktif
          ? `Akun ${userTarget.nama} telah dinonaktifkan.`
          : `Akun ${userTarget.nama} telah diaktifkan kembali.`
      );
    }
    setConfirmDialog({ isOpen: false, type: null });
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link
            href="/admin/pengguna"
            className="hover:text-[#5798D7] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Kelola Pengguna
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{userTarget.nama}</span>
        </div>

        {/* Alerts */}
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

        {/* User Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center font-bold text-xl">
                {userTarget.nama.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{userTarget.nama}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: <span className="font-mono">{userTarget.id}</span>
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                userTarget.aktif
                  ? "bg-emerald-50 text-[#15A66A] border border-emerald-200"
                  : "bg-red-50 text-[#E53935] border border-red-200"
              }`}
            >
              {userTarget.aktif ? "Akun Aktif" : "Akun Nonaktif"}
            </span>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5798D7]" />
                Alamat Email
              </span>
              <p className="font-bold text-gray-900">{userTarget.email}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5798D7]" />
                Nomor Handphone
              </span>
              <p className="font-bold text-gray-900 tabular-nums">
                {userTarget.noHp || "-"}
              </p>
            </div>
          </div>

          {/* Form Ubah Peran (PRD 4.13) */}
          <form onSubmit={handleRoleChangeSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#5798D7]" />
                Ubah Peran (Role Pengguna)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Pilih peran yang diberikan kepada pengguna ini. Nilai resmi sesuai PRD:{" "}
                <code className="text-xs text-[#5798D7] font-mono">
                  pasien, resepsionis, dokter, super_admin
                </code>
              </p>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full text-xs md:text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7]"
              >
                <option value="pasien">pasien (Pasien Klinik)</option>
                <option value="resepsionis">resepsionis (Staf Depan Laras)</option>
                <option value="dokter">dokter (Tenaga Medis drg. Bima / Sinta)</option>
                <option value="super_admin">super_admin (Pemilik Bu Ratna)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#5798D7] hover:bg-[#4483C2] text-white text-xs md:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan Peran
            </button>
          </form>

          {/* Tombol Nonaktifkan Akun (PRD 4.13) */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-800">Status Akses Akun</h4>
              <p className="text-[11px] text-gray-500">
                Nonaktifkan akun untuk mencabut akses portal pengguna ini.
              </p>
            </div>

            <button
              type="button"
              disabled={isSelf}
              onClick={handleToggleStatusClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                userTarget.aktif
                  ? "bg-red-50 text-[#E53935] border border-red-200 hover:bg-red-100"
                  : "bg-emerald-50 text-[#15A66A] border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {userTarget.aktif ? (
                <>
                  <UserX className="w-4 h-4" />
                  Nonaktifkan Akun
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Aktifkan Akun
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Konfirmasi (PRD 5.4) */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          confirmVariant={confirmDialog.confirmVariant}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog({ isOpen: false, type: null })}
        />
      </div>
    </AppShell>
  );
}
