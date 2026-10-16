"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserPlus, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DaftarPage() {
  const router = useRouter();
  const { registerWithEmail, loginWithGoogle } = useApp();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    noHp: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations (PRD 4.1):
    // email wajib dan unik, kata sandi minimal 6 karakter, nomor HP hanya angka dan diawali 08.
    if (!form.nama.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!form.noHp.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    if (!/^08\d{8,11}$/.test(form.noHp.trim())) {
      setError("Nomor HP harus berupa angka dan diawali dengan 08 (10-13 digit).");
      return;
    }

    if (!form.password || form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      // Firebase Authentication + Firestore users/{uid} creation (PRD 2.2: peran awal pasien, tanpa password)
      await registerWithEmail(
        form.nama.trim(),
        form.email.trim(),
        form.noHp.trim(),
        form.password
      );
      setSuccess(true);
      setTimeout(() => {
        router.push("/beranda");
      }, 800);
    } catch (err) {
      console.error("Gagal mendaftar:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar. Silakan Masuk atau gunakan email lain.");
      } else if (err.code === "auth/weak-password") {
        setError("Kata sandi terlalu lemah. Minimal 6 karakter.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else {
        setError(err.message || "Gagal membuat akun. Silakan coba kembali.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSubmitting(true);
    try {
      // PRD 4.1 & 2.2: Pengguna Google pertama kali dibuat di users/{uid} dengan noHp kosong dan peran pasien
      await loginWithGoogle();
      router.push("/beranda");
    } catch (err) {
      console.error("Gagal masuk dengan Google:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Gagal masuk dengan akun Google: " + err.message);
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
        <h2 className="text-2xl font-bold text-gray-900">Daftar Pasien Baru</h2>
        <p className="mt-1 text-sm text-gray-500">
          Buat akun untuk memesan janji temu di Klinik Gigi Senyum Rekah
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

          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15A66A] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Pendaftaran berhasil! Mengarahkan ke Beranda...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Andi Pratama"
                className="mt-1 block w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com"
                className="mt-1 block w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={form.noHp}
                onChange={(e) => setForm({ ...form, noHp: e.target.value })}
                placeholder="081234567890"
                className="mt-1 block w-full px-3.5 py-2.5 text-sm tabular-nums bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Hanya angka dan wajib diawali 08
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Kata Sandi <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimal 6 karakter"
                className="mt-1 block w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5798D7]/20 focus:border-[#5798D7] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 bg-[#5798D7] hover:bg-[#4483C2] text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none disabled:opacity-50"
            >
              {submitting ? "Mendaftarkan..." : "Daftar Pasien"}
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

          <div className="mt-6 text-center text-xs text-gray-500">
            Sudah punya akun?{" "}
            <Link
              href="/masuk"
              className="text-[#5798D7] font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
