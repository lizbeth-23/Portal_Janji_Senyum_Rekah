"use client";

import React from "react";

export default function StatusBadge({ status, className = "" }) {
  const normStatus = (status || "").toLowerCase();

  const statusConfig = {
    menunggu: {
      label: "Menunggu",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-[#F59E0B]",
    },
    dikonfirmasi: {
      label: "Dikonfirmasi",
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-[#2563EB]",
    },
    hadir: {
      label: "Hadir (Siap Diperiksa)",
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      dot: "bg-[#7C3AED]",
    },
    selesai: {
      label: "Selesai",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-[#15A66A]",
    },
    dibatalkan: {
      label: "Dibatalkan",
      bg: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-[#E53935]",
    },
  };

  const config = statusConfig[normStatus] || {
    label: status,
    bg: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tabular-nums ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
