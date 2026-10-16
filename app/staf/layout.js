import React from "react";
import ResepsionisRouteGuard from "@/components/ResepsionisRouteGuard";

export const metadata = {
  title: "Staf Depan · Portal Janji Senyum Rekah",
  description: "Modul pengelolaan janji temu dan data pasien staf depan klinik gigi",
};

export default function StafLayout({ children }) {
  return <ResepsionisRouteGuard>{children}</ResepsionisRouteGuard>;
}
