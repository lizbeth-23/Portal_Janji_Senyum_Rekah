"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  syncUserProfile,
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logoutUser,
} from "@/lib/authService";
import {
  INITIAL_USERS,
  INITIAL_LAYANAN,
  INITIAL_JADWAL_DOKTER,
  INITIAL_JANJI,
  INITIAL_CATATAN,
  INITIAL_SLOT_TERISI,
} from "@/lib/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [layanan, setLayanan] = useState(INITIAL_LAYANAN);
  const [jadwalDokter, setJadwalDokter] = useState(INITIAL_JADWAL_DOKTER);
  const [janjiList, setJanjiList] = useState(INITIAL_JANJI);
  const [catatanList, setCatatanList] = useState(INITIAL_CATATAN);
  const [slotTerisi, setSlotTerisi] = useState(INITIAL_SLOT_TERISI);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authProfile, setAuthProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Active user (prioritize real Firestore auth profile if logged in, otherwise simulated fallback)
  const [activeUser, setActiveUser] = useState(null);

  // 1. Listen to Firebase Authentication & sync with users/{uid}
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setLoadingAuth(true);
      if (user) {
        setFirebaseUser(user);
        try {
          // PRD requirement: cek users/{uid}. Bila belum ada, buat dengan role "pasien". Bila ada, jangan ubah.
          const profile = await syncUserProfile(user);
          setAuthProfile(profile);
          setActiveUser(profile);
        } catch (err) {
          console.error("Gagal sinkronisasi profil Firestore users/{uid}:", err);
        }
      } else {
        setFirebaseUser(null);
        setAuthProfile(null);
        setActiveUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Realtime listener for Firestore collections
  useEffect(() => {
    try {
      // a. users collection
      const unsubUsers = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setUsers(data);
            // If active user exists in snapshot, keep it fresh
            if (firebaseUser) {
              const current = data.find((u) => u.id === firebaseUser.uid);
              if (current) {
                setAuthProfile(current);
                setActiveUser(current);
              }
            }
          }
        },
        (error) => console.warn("Firestore users listener error:", error.message)
      );

      // b. layanan collection
      const unsubLayanan = onSnapshot(
        collection(db, "layanan"),
        (snapshot) => {
          if (!snapshot.empty) {
            setLayanan(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore layanan listener error:", error.message)
      );

      // c. jadwal_dokter collection
      const unsubJadwal = onSnapshot(
        collection(db, "jadwal_dokter"),
        (snapshot) => {
          if (!snapshot.empty) {
            setJadwalDokter(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore jadwal_dokter listener error:", error.message)
      );

      // d. janji_temu collection
      const unsubJanji = onSnapshot(
        collection(db, "janji_temu"),
        (snapshot) => {
          if (!snapshot.empty) {
            setJanjiList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore janji_temu listener error:", error.message)
      );

      // e. catatan_perawatan collection
      const unsubCatatan = onSnapshot(
        collection(db, "catatan_perawatan"),
        (snapshot) => {
          if (!snapshot.empty) {
            setCatatanList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore catatan_perawatan listener error:", error.message)
      );

      // f. slot_terisi collection
      const unsubSlots = onSnapshot(
        collection(db, "slot_terisi"),
        (snapshot) => {
          if (!snapshot.empty) {
            setSlotTerisi(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore slot_terisi listener error:", error.message)
      );

      return () => {
        unsubUsers();
        unsubLayanan();
        unsubJadwal();
        unsubJanji();
        unsubCatatan();
        unsubSlots();
      };
    } catch (e) {
      console.warn("Could not attach Firestore listeners, continuing with local state:", e);
    }
  }, [firebaseUser]);

  // Actions writing to Firestore & state
  const addJanji = async (newJanjiData) => {
    const id = `janji-${Date.now()}`;
    const newJanji = {
      pasienId: newJanjiData.pasienId || activeUser.id,
      dokterId: newJanjiData.dokterId,
      layananId: newJanjiData.layananId,
      tanggal: newJanjiData.tanggal,
      jam: newJanjiData.jam,
      keluhan: newJanjiData.keluhan,
      status: "menunggu",
      alasanBatal: "",
      dibuatPada: new Date().toISOString(),
    };

    const targetLayanan = layanan.find((l) => l.id === newJanjiData.layananId);
    const newSlot = {
      dokterId: newJanjiData.dokterId,
      tanggal: newJanjiData.tanggal,
      jam: newJanjiData.jam,
      durasiMenit: targetLayanan ? targetLayanan.durasiMenit : 30,
    };

    try {
      await setDoc(doc(db, "janji_temu", id), {
        ...newJanji,
        dibuatPada: serverTimestamp(),
      });
      await setDoc(doc(db, "slot_terisi", id), newSlot);
    } catch (e) {
      console.error("Firestore write failed, updating local state:", e);
    }

    setJanjiList((prev) => [{ id, ...newJanji }, ...prev]);
    setSlotTerisi((prev) => [{ id, ...newSlot }, ...prev]);
    return id;
  };

  const cancelJanji = async (janjiId, alasan = "") => {
    try {
      await updateDoc(doc(db, "janji_temu", janjiId), {
        status: "dibatalkan",
        alasanBatal: alasan,
      });
      await deleteDoc(doc(db, "slot_terisi", janjiId));
    } catch (e) {
      console.error("Firestore cancel failed:", e);
    }

    setJanjiList((prev) =>
      prev.map((j) =>
        j.id === janjiId
          ? { ...j, status: "dibatalkan", alasanBatal: alasan || j.alasanBatal }
          : j
      )
    );
    setSlotTerisi((prev) => prev.filter((s) => s.id !== janjiId));
  };

  const confirmJanji = async (janjiId) => {
    try {
      await updateDoc(doc(db, "janji_temu", janjiId), { status: "dikonfirmasi" });
    } catch (e) {
      console.error("Firestore confirm failed:", e);
    }
    setJanjiList((prev) =>
      prev.map((j) => (j.id === janjiId ? { ...j, status: "dikonfirmasi" } : j))
    );
  };

  const rescheduleJanji = async (janjiId, newTanggal, newJam) => {
    try {
      await updateDoc(doc(db, "janji_temu", janjiId), {
        tanggal: newTanggal,
        jam: newJam,
        status: "dikonfirmasi",
      });
      await updateDoc(doc(db, "slot_terisi", janjiId), {
        tanggal: newTanggal,
        jam: newJam,
      });
    } catch (e) {
      console.error("Firestore reschedule failed:", e);
    }

    setJanjiList((prev) =>
      prev.map((j) =>
        j.id === janjiId
          ? { ...j, tanggal: newTanggal, jam: newJam, status: "dikonfirmasi" }
          : j
      )
    );
    setSlotTerisi((prev) =>
      prev.map((s) =>
        s.id === janjiId ? { ...s, tanggal: newTanggal, jam: newJam } : s
      )
    );
  };

  const markHadir = async (janjiId) => {
    try {
      await updateDoc(doc(db, "janji_temu", janjiId), { status: "hadir" });
    } catch (e) {
      console.error("Firestore markHadir failed:", e);
    }
    setJanjiList((prev) =>
      prev.map((j) => (j.id === janjiId ? { ...j, status: "hadir" } : j))
    );
  };

  const completePemeriksaan = async (janjiId, tindakan, catatan) => {
    const targetJanji = janjiList.find((j) => j.id === janjiId);
    if (!targetJanji) return;

    const catatanId = `catatan-${Date.now()}`;
    const newCatatan = {
      janjiId,
      pasienId: targetJanji.pasienId,
      dokterId: targetJanji.dokterId,
      tindakan,
      catatan,
      dibuatPada: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "catatan_perawatan", catatanId), {
        ...newCatatan,
        dibuatPada: serverTimestamp(),
      });
      await updateDoc(doc(db, "janji_temu", janjiId), { status: "selesai" });
      await deleteDoc(doc(db, "slot_terisi", janjiId));
    } catch (e) {
      console.error("Firestore completePemeriksaan failed:", e);
    }

    setCatatanList((prev) => [{ id: catatanId, ...newCatatan }, ...prev]);
    setJanjiList((prev) =>
      prev.map((j) => (j.id === janjiId ? { ...j, status: "selesai" } : j))
    );
    setSlotTerisi((prev) => prev.filter((s) => s.id !== janjiId));
  };

  const updateProfil = async (userId, updatedFields) => {
    try {
      await updateDoc(doc(db, "users", userId), updatedFields);
    } catch (e) {
      console.error("Firestore updateProfil failed:", e);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedFields } : u))
    );
    if (activeUser?.id === userId) {
      setActiveUser((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
    } catch (e) {
      console.error("Firestore updateUserRole failed:", e);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (activeUser?.id === userId) {
      setActiveUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  const toggleUserStatus = async (userId) => {
    const user = users.find((u) => u.id === userId);
    const newStatus = user ? !user.aktif : true;
    try {
      await updateDoc(doc(db, "users", userId), { aktif: newStatus });
    } catch (e) {
      console.error("Firestore toggleUserStatus failed:", e);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, aktif: newStatus } : u))
    );
  };

  const addLayanan = async (layananData) => {
    const id = `layanan-${Date.now()}`;
    const newLayanan = {
      nama: layananData.nama,
      durasiMenit: Number(layananData.durasiMenit),
      harga: Number(layananData.harga),
      aktif: layananData.aktif ?? true,
    };
    try {
      await setDoc(doc(db, "layanan", id), newLayanan);
    } catch (e) {
      console.error("Firestore addLayanan failed:", e);
    }
    setLayanan((prev) => [...prev, { id, ...newLayanan }]);
  };

  const toggleLayanan = async (id) => {
    const lay = layanan.find((l) => l.id === id);
    const newAktif = lay ? !lay.aktif : true;
    try {
      await updateDoc(doc(db, "layanan", id), { aktif: newAktif });
    } catch (e) {
      console.error("Firestore toggleLayanan failed:", e);
    }
    setLayanan((prev) =>
      prev.map((l) => (l.id === id ? { ...l, aktif: newAktif } : l))
    );
  };

  const addJadwalDokter = async (jadwalData) => {
    const id = `jadwal-${Date.now()}`;
    const newJadwal = {
      dokterId: jadwalData.dokterId,
      hari: jadwalData.hari.toLowerCase(),
      jamMulai: jadwalData.jamMulai,
      jamSelesai: jadwalData.jamSelesai,
    };
    try {
      await setDoc(doc(db, "jadwal_dokter", id), newJadwal);
    } catch (e) {
      console.error("Firestore addJadwalDokter failed:", e);
    }
    setJadwalDokter((prev) => [...prev, { id, ...newJadwal }]);
  };

  // Lookups
  const getUserById = (id) => users.find((u) => u.id === id);
  const getDokterById = (id) => users.find((u) => u.id === id && u.role === "dokter");
  const getLayananById = (id) => layanan.find((l) => l.id === id);

  return (
    <AppContext.Provider
      value={{
        users,
        layanan,
        jadwalDokter,
        janjiList,
        catatanList,
        slotTerisi,
        activeUser,
        setActiveUser,
        firebaseUser,
        authProfile,
        loadingAuth,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        logoutUser,
        addJanji,
        cancelJanji,
        confirmJanji,
        rescheduleJanji,
        markHadir,
        completePemeriksaan,
        updateProfil,
        updateUserRole,
        toggleUserStatus,
        addLayanan,
        toggleLayanan,
        addJadwalDokter,
        getUserById,
        getDokterById,
        getLayananById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
