"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  PlusCircle,
  FileText,
  User,
  Users,
  Clock,
  Activity,
  ClipboardList,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Sparkles,
  BarChart3,
  Stethoscope,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { activeUser, setActiveUser, users } = useApp();

  // Collapsible for Janji Saya (PRD 3.1: "Modul dengan panah = bisa buka-tutup")
  const [janjiOpen, setJanjiOpen] = useState(true);

  // Group menus by PRD 3.1
  const pasienMenu = [
    { label: "Beranda", href: "/beranda", icon: Home },
    {
      label: "Janji Saya",
      icon: Calendar,
      isGroup: true,
      isOpen: janjiOpen,
      toggle: () => setJanjiOpen(!janjiOpen),
      subItems: [
        { label: "Daftar Janji", href: "/janji" },
        { label: "Buat Janji", href: "/janji/baru" },
      ],
    },
    { label: "Riwayat Perawatan", href: "/riwayat", icon: FileText },
    { label: "Profil", href: "/profil", icon: User },
  ];

  const resepsionisMenu = [
    { label: "Dasbor Resepsionis", href: "/resepsionis", icon: ClipboardList },
    { label: "Kelola Janji", href: "/resepsionis/janji", icon: Calendar },
    { label: "Data Pasien", href: "/resepsionis/pasien", icon: Users },
    { label: "Profil", href: "/profil", icon: User },
  ];

  const dokterMenu = [
    { label: "Dasbor Dokter", href: "/dokter", icon: Stethoscope },
    { label: "Profil", href: "/profil", icon: User },
  ];

  const adminMenu = [
    { label: "Dasbor Admin", href: "/admin", icon: ShieldCheck },
    { label: "Kelola Pengguna", href: "/admin/pengguna", icon: Users },
    { label: "Layanan", href: "/admin/layanan", icon: Activity },
    { label: "Jadwal Dokter", href: "/admin/jadwal-dokter", icon: Clock },
    { label: "Laporan", href: "/admin/laporan", icon: BarChart3 },
  ];

  const role = activeUser?.role || "tamu";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Clinic Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5798D7] to-[#B9C255] flex items-center justify-center text-white shadow-sm font-bold text-lg">
            🦷
          </div>
          <div>
            <span className="font-bold text-sm text-gray-900 tracking-tight block">
              SENYUM <span className="text-[#B9C255]">REKAH</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium block">
              Klinik Gigi Makassar
            </span>
          </div>
        </Link>
      </div>

      {/* Role View Switcher (Helper for testing all roles without page guard in this phase) */}
      <div className="p-3 bg-[#E6F1FA]/40 border-b border-gray-100">
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Simulasi Akun (PRD)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B9C255] text-white font-bold uppercase shadow-xs">
            {role}
          </span>
        </div>
        <select
          value={activeUser?.id || ""}
          onChange={(e) => {
            const u = users.find((item) => item.id === e.target.value);
            setActiveUser(u || null);
          }}
          className="w-full text-xs bg-white border border-gray-200 rounded-md py-1.5 px-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5798D7]"
        >
          <option value="">-- Belum Masuk (Tamu) --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nama} ({u.role})
            </option>
          ))}
        </select>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Pasien Section */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu Pasien
          </div>
          <div className="space-y-1">
            {pasienMenu.map((item, idx) => {
              if (item.isGroup) {
                const isGroupActive = item.subItems.some((s) => pathname === s.href);
                return (
                  <div key={idx} className="space-y-1">
                    <button
                      onClick={item.toggle}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isGroupActive
                          ? "text-[#5798D7] bg-[#E6F1FA] font-semibold"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 text-[#5798D7]" />
                        <span>{item.label}</span>
                      </div>
                      {item.isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                    {item.isOpen && (
                      <div className="pl-8 space-y-1">
                        {item.subItems.map((sub, sIdx) => {
                          const isActive = pathname === sub.href;
                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={onClose}
                              className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${
                                isActive
                                  ? "bg-[#5798D7] text-white font-medium shadow-sm"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#5798D7] text-white font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Resepsionis Section */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu Resepsionis
          </div>
          <div className="space-y-1">
            {resepsionisMenu.map((item, idx) => {
              if (item.label === "Profil") return null; // already shown
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#5798D7] text-white font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dokter Section */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu Dokter
          </div>
          <div className="space-y-1">
            {dokterMenu.map((item, idx) => {
              if (item.label === "Profil") return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#5798D7] text-white font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Super Admin Section */}
        <div>
          <div className="px-3 mb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu Super Admin
          </div>
          <div className="space-y-1">
            {adminMenu.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#5798D7] text-white font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer info */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-[11px] text-gray-500">
        <p className="font-medium text-gray-700">Senyum Rekah v1.0</p>
        <p className="text-[10px]">janji.senyumrekah.id</p>
      </div>
    </aside>
  );
}
