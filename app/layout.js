import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  title: "PORTAL JANJI SENYUM REKAH - Klinik Gigi Makassar",
  description: "Aplikasi Janji Temu dan Catatan Perawatan Klinik Gigi Senyum Rekah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#F4F8FC] text-[#1F2937] min-h-screen">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
