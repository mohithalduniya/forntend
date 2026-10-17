"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/Components/websiteComponents/Header";
import Footer from "@/Components/websiteComponents/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname() || "";

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/verify-otp";

  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      {!isAdminRoute && !isAuthRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </AuthProvider>
  );
}
