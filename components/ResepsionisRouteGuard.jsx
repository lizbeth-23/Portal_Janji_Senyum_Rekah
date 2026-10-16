"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldAlert, Home, LogOut, ArrowRight, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";

/**
 * Normalisasi dan verifikasi role yang diizinkan mengakses modul resepsionis / staf.
 * Yang boleh membuka: role "[staf depan]" dan "super_admin" (termasuk variasi "resepsionis").
 */
export function isStaffAllowed(role) {
  if (!role) return false;
  const normalized = String(role).toLowerCase().trim().replace(/[-_]/g, " ");
  return (
    normalized === "staf depan" ||
    normalized === "staf" ||
    normalized === "resepsionis" ||
    normalized === "super admin" ||
    normalized === "superadmin" ||
    normalized === "admin"
  );
}

export default function ResepsionisRouteGuard({ children }) {
  const router = useRouter();
  const { firebaseUser, authProfile, activeUser, loadingAuth, logoutUser } = useApp();

  // Pengguna aktif yang diidentifikasi dari sesi Firebase auth users/{uid} atau simulasi
  const currentUser = authProfile || activeUser || (firebaseUser ? { role: "pasien" } : null);

  // 1. Pengguna yang belum masuk diarahkan ke /masuk (dijalankan setelah loading selesai)
  useEffect(() => {
    if (!loadingAuth && !currentUser) {
      router.replace("/masuk");
    }
  }, [loadingAuth, currentUser, router]);

  // 2. Selama role belum selesai dibaca dari users/{uid}, tampilkan layar Memuat... dan jangan memutuskan apa pun
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-[#5798D7] animate-spin" />
        </div>
        <h2 className="text-base font-bold text-gray-800">Memuat...</h2>
        <p className="text-xs text-gray-500 mt-1">
          Memeriksa hak akses dan membaca data pengguna dari sistem...
        </p>
      </div>
    );
  }

  // 3. Jika belum masuk dan sedang dialihkan ke /masuk
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#5798D7] animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-700">Mengarahkan ke halaman Masuk...</p>
      </div>
    );
  }

  // 4. Periksa kecocokan role: hanya [staf depan] dan super_admin yang boleh membuka
  const userRole = currentUser.role || "";
  const allowed = isStaffAllowed(userRole);

  // 5. Peran lain melihat halaman Akses Ditolak
  if (!allowed) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            403 · Akses Ditolak
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Akses Ditolak
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
            Halaman ini hanya dapat dibuka oleh role <span className="font-semibold text-gray-800">staf depan</span> dan <span className="font-semibold text-gray-800">super_admin</span>.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
            <span>Peran akun Anda saat ini:</span>
            <span className="font-bold text-gray-800 uppercase px-2.5 py-0.5 rounded-full bg-white border border-gray-200 shadow-xs">
              {userRole || "Tidak Diketahui"}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            {userRole === "pasien" && (
              <Link
                href="/beranda"
                className="w-full py-2.5 px-4 bg-[#5798D7] hover:bg-[#4483C2] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Beranda Pasien</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {userRole === "dokter" && (
              <Link
                href="/dokter"
                className="w-full py-2.5 px-4 bg-[#5798D7] hover:bg-[#4483C2] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Dasbor Dokter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Utama</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await logoutUser();
                router.push("/masuk");
              }}
              className="w-full py-2 px-4 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar / Ganti Akun</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Role [staf depan] atau super_admin: izinkan konten dibuka
  return <>{children}</>;
}
