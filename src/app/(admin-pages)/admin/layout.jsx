"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/Components/adminComponents/Header";
import Sidebar from "@/Components/adminComponents/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "";

  // If on admin login page, bypass the admin authentication guard
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  // If auth is loading, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-400">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }


  // If not logged in or not an admin, show Access Denied guard
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center px-4 font-sans text-white">
        <div className="max-w-md w-full bg-[#192735] border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-500/20">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            You must be logged in with an administrator account to access the Nestro Management Panel.
          </p>

          <div className="space-y-3">
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition"
            >
              Sign In to Admin Panel <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center w-full py-2.5 px-4 bg-transparent border border-gray-700 hover:border-gray-600 text-gray-300 rounded-xl text-sm transition"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin User
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="ml-64 p-6 min-h-[calc(100vh-80px)]">{children}</main>
      </div>
    </div>
  );
}
