import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

/**
 * Memastikan profil pengguna ada di dokumen users/{uid}.
 * Sesuai PRD 2.2 & 7.1:
 * - Cek dokumen users/{uid}
 * - Bila belum ada: buat dokumen dengan peran awal "pasien" (PRD 2.2), tanpa kata sandi
 * - Bila sudah ada: JANGAN DIUBAH (agar peran dan data tidak tertimpa)
 */
export async function syncUserProfile(user, additionalData = {}) {
  if (!user || !user.uid) return null;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Dokumen sudah ada: kembalikan data yang ada, JANGAN DIUBAH
    const existingData = userSnap.data();
    return {
      uid: user.uid,
      id: user.uid,
      ...existingData,
    };
  }

  // Dokumen belum ada: buat profil baru peran awal "pasien" sesuai PRD 2.2 & 7.1
  const newProfile = {
    nama: additionalData.nama || user.displayName || user.email?.split("@")[0] || "Pasien",
    email: user.email || "",
    noHp: additionalData.noHp || "", // Dari form /daftar atau kosong bila via Google
    role: "pasien", // PRD 2.2: Peran awal setiap akun baru adalah pasien
    aktif: true,
    dibuatPada: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);

  return {
    uid: user.uid,
    id: user.uid,
    ...newProfile,
  };
}

/**
 * Mendaftar akun baru dengan Email & Password
 */
export async function registerWithEmail(nama, email, noHp, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Buat dokumen users/{uid} dengan nama & noHp dari form
  const profile = await syncUserProfile(user, { nama, noHp });
  return { user, profile };
}

/**
 * Masuk dengan Email & Password
 */
export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Cek dan ambil profil users/{uid}
  const profile = await syncUserProfile(user);
  return { user, profile };
}

/**
 * Masuk dengan Akun Google
 */
export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Cek dan ambil/buat profil users/{uid}
  const profile = await syncUserProfile(user);
  return { user, profile };
}

/**
 * Keluar (Logout)
 */
export async function logoutUser() {
  await signOut(auth);
}
