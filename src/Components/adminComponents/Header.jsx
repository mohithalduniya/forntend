"use client";

import React from "react";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { LuBell, LuStore } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="ml-64 border-b p-5 bg-white">
      <div className="flex justify-between items-center">
        {/* Title Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-xs text-[#62748e]">
            Welcome back, <span className="font-semibold text-gray-700">{user?.name || "Admin"}</span> 👋
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            className="w-72 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 focus:bg-white transition-all"
            placeholder="Search orders, products…"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Visit Store Button */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <LuStore className="text-sm" />
            <span>Storefront</span>
          </Link>

          <div className="w-px h-6 bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center ring-2 ring-teal-500/30 text-white font-bold text-xs uppercase">
              {user?.name ? user.name.slice(0, 1) : "A"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}