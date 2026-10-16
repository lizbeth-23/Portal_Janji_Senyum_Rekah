"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#E6F1FA] text-[#5798D7] flex items-center justify-center mx-auto mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold text-[#5798D7] tracking-widest uppercase mb-1">
        Error 404
      </span>
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 text-xs md:text-sm text-gray-500 max-w-md leading-relaxed">
        Maaf, alamat URL yang Anda tuju tidak ditemukan pada sistem Portal Janji Senyum Rekah.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Halaman Sebelumnya
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5798D7] hover:bg-[#4483C2] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda Utama
        </Link>
      </div>
    </div>
  );
}
