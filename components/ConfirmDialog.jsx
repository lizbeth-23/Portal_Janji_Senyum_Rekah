"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Konfirmasi Aksi",
  message = "Apakah Anda yakin ingin melanjutkan aksi ini?",
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  confirmVariant = "primary", // primary, danger, warning, success
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const btnClasses = {
    primary: "bg-[#5798D7] hover:bg-[#4483C2] text-white",
    danger: "bg-[#E53935] hover:bg-red-700 text-white",
    warning: "bg-[#F59E0B] hover:bg-amber-600 text-white",
    success: "bg-[#15A66A] hover:bg-emerald-700 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-[#E6F1FA] text-[#5798D7] shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
              btnClasses[confirmVariant] || btnClasses.primary
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
