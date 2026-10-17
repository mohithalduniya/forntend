"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  MdAdminPanelSettings,
  MdOutlineDiscount,
  MdOutlineDashboard,
  MdCategory,
} from "react-icons/md";
import { TfiMenu } from "react-icons/tfi";
import { IoBedOutline } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Sidebar Open/Collapse State
  const [isCollapsed, setIsCollapsed] = useState(false);


  // Menu items list with corresponding routes
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <MdOutlineDashboard /> },
    { name: "Category", path: "/admin/category", icon: <MdCategory /> },
    { name: "Products", path: "/admin/product", icon: <MdOutlineDiscount /> },
    { name: "Rooms", path: "/admin/rooms", icon: <IoBedOutline /> },
    { name: "Colors", path: "/admin/colors", icon: <IoIosColorPalette /> },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#0d1b2a] py-5 z-50 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? "w-20" : "w-[256px]"
      }`}
    >
      <div>
        {/* Header / Logo Section */}
        <div className="flex justify-between items-center px-4 pb-4 border-b border-[#62748e]">
          <div className="flex gap-3 items-center overflow-hidden">
            <MdAdminPanelSettings className="text-white text-3xl shrink-0" />
            {!isCollapsed && (
              <div className="text-white whitespace-nowrap">
                <p className="font-semibold leading-tight">Admin Panel</p>
                <p className="text-xs text-[#00d6c1]">Pro Dashboard</p>
              </div>
            )}
          </div>
          {/* Toggle Sidebar Collapse */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#00d6c1] hover:text-white transition cursor-pointer p-1"
          >
            <TfiMenu className="text-xl" />
          </button>
        </div>

        {/* Main Menu Label */}
        {!isCollapsed && (
          <div className="text-[#62748e] text-xs font-semibold uppercase tracking-wider px-4 mt-5 mb-2">
            Main menu
          </div>
        )}

        {/* Navigation Items */}
        <div className="space-y-1 px-2 mt-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`group flex items-center gap-4 px-3 py-2.5 rounded-xl transition duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#192735] text-[#00d6c1]"
                    : "text-gray-300 hover:bg-[#192735] hover:text-white"
                }`}
                title={isCollapsed ? item.name : ""}
              >
                <div
                  className={`p-2 rounded-lg text-xl transition duration-200 ${
                    isActive
                      ? "bg-[#25323f] text-[#00d6c1]"
                      : "group-hover:bg-[#25323f]"
                  }`}
                >
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* System Section */}
        {!isCollapsed && (
          <div className="text-[#62748e] text-xs font-semibold uppercase tracking-wider px-4 mt-6 mb-2">
            System
          </div>
        )}

        <div className="px-2 mt-2">
          <div
            onClick={() => handleNavigation("/settings")}
            className={`group flex items-center gap-4 px-3 py-2.5 rounded-xl transition duration-200 cursor-pointer ${
              pathname === "/settings"
                ? "bg-[#192735] text-[#00d6c1]"
                : "text-gray-300 hover:bg-[#192735] hover:text-white"
            }`}
            title={isCollapsed ? "Settings" : ""}
          >
            <div className="p-2 rounded-lg text-xl group-hover:bg-[#25323f]">
              <FiSettings />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                Settings
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User Profile / Logout Footer */}
      <div className="px-3 pt-4 border-t border-[#62748e]">
        <div className="flex items-center gap-3 p-2 rounded-xl text-white">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
            {user?.name ? user.name.slice(0, 1) : "A"}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">{user?.role || "Administrator"}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={async () => {
                await logout();
                router.push("/admin/login");
              }}
              title="Sign Out"
              className="text-gray-400 hover:text-rose-400 transition cursor-pointer p-1"
            >
              <FiLogOut className="text-base" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

