"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { LogIn, AlertCircle, ArrowRight } from "lucide-react";

export default function MasukPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle, logoutUser, users, setActiveUser } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirection handler per PRD 4.1
  const redirectByRole = (profile) => {
    if (!profile) {
      router.push("/beranda");
      return;
    }

    // PRD 4.1: Akun nonaktif melihat pesan “Akun Anda dinonaktifkan. Hubungi klinik.”
    if (!profile.aktif) {
      logoutUser();
      setError("Akun Anda dinonaktifkan. Hubungi klinik.");
      return;
    }

    if (profile.role === "pasien") {
      router.push("/beranda");
    } else if (profile.role === "resepsionis") {
      router.push("/resepsionis");
    } else if (profile.role === "dokter") {
      router.push("/dokter");
    } else if (profile.role === "super_admin") {
      router.push("/admin");
    } else {
      router.push("/beranda");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      // Masuk via Firebase Authentication + membaca profil users/{uid}
      const { profile } = await loginWithEmail(email.trim(), password);
      redirectByRole(profile);
    } catch (err) {
      console.error("Gagal masuk:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Email atau kata sandi salah. Silakan periksa kembali.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError(err.message || "Gagal masuk ke akun.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSubmitting(true);
    try {
      // Masuk via Google + otomatis buat/cek dokumen users/{uid}
      const { profile } = await loginWithGoogle();
      redirectByRole(profile);
    } catch (err) {
      console.error("Gagal masuk dengan Google:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Gagal masuk dengan Google: " + err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5798D7] to-[#B9C255] flex items-center justify-center text-white text-xl shadow-md">
            🦷
          </div>
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">
            SENYUM <span className="text-[#B9C255]">REKAH</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h2>
        <p className="mt-1 text-sm text-gray-500">
          Akses portal sesuai peran Anda di Klinik Gigi Senyum Rekah
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#E53935] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="mt-1 block w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                className="mt-1 block w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 bg-[#5798D7] hover:bg-[#4483C2] text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none disabled:opacity-50"
            >
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-5 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400">atau</span>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Google
            </button>
          </div>

          {/* Quick Role Tester Shortcuts */}
          <div className="mt-8 pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              Simulasi Cepat Masuk per Peran (PRD 2.1):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.id === "user-andi");
                  if (u) {
                    setActiveUser(u);
                    redirectByRole(u);
                  }
                }}
                className="p-2 text-left rounded-lg border border-[#E6F1FA] bg-[#E6F1FA]/40 hover:bg-[#E6F1FA] text-[#5798D7] transition-colors"
              >
                <span className="font-semibold block">Andi (Pasien)</span>
                <span className="text-[10px] text-gray-500">→ /beranda</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.id === "user-laras");
                  if (u) {
                    setActiveUser(u);
                    redirectByRole(u);
                  }
                }}
                className="p-2 text-left rounded-lg border border-blue-100 bg-blue-50/40 hover:bg-blue-100 text-[#2563EB] transition-colors"
              >
                <span className="font-semibold block">Laras (Resepsionis)</span>
                <span className="text-[10px] text-gray-500">→ /resepsionis</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.id === "user-bima");
                  if (u) {
                    setActiveUser(u);
                    redirectByRole(u);
                  }
                }}
                className="p-2 text-left rounded-lg border border-purple-100 bg-purple-50/40 hover:bg-purple-100 text-[#7C3AED] transition-colors"
              >
                <span className="font-semibold block">drg. Bima (Dokter)</span>
                <span className="text-[10px] text-gray-500">→ /dokter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = users.find((x) => x.id === "user-ratna");
                  if (u) {
                    setActiveUser(u);
                    redirectByRole(u);
                  }
                }}
                className="p-2 text-left rounded-lg border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-100 text-[#15A66A] transition-colors"
              >
                <span className="font-semibold block">Bu Ratna (Super Admin)</span>
                <span className="text-[10px] text-gray-500">→ /admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/daftar"
              className="text-[#5798D7] font-semibold hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
