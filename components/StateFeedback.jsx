"use client";

import React from "react";
import { Loader2, AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export function LoadingState({ message = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-8 h-8 text-[#5798D7] animate-spin mb-3" />
      <p className="text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "Belum Ada Data",
  description = "Saat ini belum ada data yang dapat ditampilkan.",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Inbox className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Gagal memuat data dari sistem. Silakan coba kembali.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-red-50/50 rounded-xl border border-red-100">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#E53935] mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5798D7] hover:bg-[#4483C2] rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
