"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User, LogIn, UserPlus } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function TopBar({ onOpenSidebar }) {
  const router = useRouter();
  const { activeUser, firebaseUser, logoutUser } = useApp();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/masuk");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#5798D7] text-white flex items-center justify-between px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg text-white/90 hover:bg-white/10 md:hidden focus:outline-none"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm md:text-base font-bold tracking-wide">
            PORTAL JANJI SENYUM <span className="text-[#B9C255]">REKAH</span>
          </h1>
          <p className="text-[11px] text-sky-100 hidden sm:block">
            Klinik Gigi Makassar · janji.senyumrekah.id
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Nama dan peran dibaca dari users/{uid} (PRD Tahap 3) */}
        {activeUser ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profil"
              className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/15 hover:bg-white/25 transition-colors border border-white/20 text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#B9C255] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {activeUser.nama ? activeUser.nama.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-semibold block leading-tight">
                  {activeUser.nama || "Pengguna"}
                </span>
                <span className="text-[10px] text-sky-200 capitalize font-medium">
                  Peran: {activeUser.role || "pasien"}
                </span>
              </div>
            </Link>

            {/* Tombol Keluar (Logout) */}
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar dari akun"
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/masuk"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="text-xs px-3 py-1.5 rounded-lg bg-[#B9C255] hover:bg-[#A4AD45] text-white font-semibold shadow-xs transition-colors"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
