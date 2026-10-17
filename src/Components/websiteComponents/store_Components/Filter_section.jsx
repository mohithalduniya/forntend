"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter_section({ items = [], roomTypes = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // =========================================
  // GET SELECTED CATEGORIES FROM URL
  // =========================================

  const selectedCategories = searchParams.getAll("category").filter(Boolean);
  

  // =========================================
  // GET SELECTED ROOMS FROM URL
  // =========================================

  const selectedRooms = searchParams.getAll("room").filter(Boolean);

  // console.log("Selected Categories:", selectedCategories);
  // console.log("Selected Rooms:", selectedRooms);

  // =========================================
  // NORMALIZE CATEGORY NAME
  // =========================================

  const normalizeName = (name) => {
    return String(name || "")
      .trim()
      .toLowerCase();
  };

  // =========================================
  // CATEGORY CHECKBOX
  // =========================================

  const handleCategoryChange = (categoryName) => {
    const value = normalizeName(categoryName);

    // Empty value ko URL mein mat bhejna
    if (!value) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    // Existing categories
    const categories = params.getAll("category").filter(Boolean);

    // =====================================
    // UNCHECK
    // =====================================

    if (categories.includes(value)) {
      const updatedCategories = categories.filter(
        (category) => category !== value,
      );

      // Purane category parameters remove
      params.delete("category");

      // Sirf valid categories dobara add
      updatedCategories.forEach((category) => {
        params.append("category", category);
      });
    }

    // =====================================
    // CHECK
    // =====================================
    else {
      params.append("category", value);
    }

    // =====================================
    // UPDATE URL
    // =====================================

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  // =========================================
  // ROOM CHECKBOX
  // =========================================

  const handleRoomChange = (roomName) => {
    const value = normalizeName(roomName);

    // Empty value ko URL mein mat bhejna
    if (!value) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    // Existing rooms
    const rooms = params.getAll("room").filter(Boolean);

    // =====================================
    // UNCHECK
    // =====================================

    if (rooms.includes(value)) {
      const updatedRooms = rooms.filter((room) => room !== value);

      // Purane room parameters remove
      params.delete("room");

      // Valid rooms dobara add
      updatedRooms.forEach((room) => {
        params.append("room", room);
      });
    }

    // =====================================
    // CHECK
    // =====================================
    else {
      params.append("room", value);
    }

    // =====================================
    // UPDATE URL
    // =====================================

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <aside className="border-4 border-[#F0EBE3] bg-white rounded-2xl p-5 shadow-sm">
      {/* =====================================
          FILTER HEADING
      ====================================== */}

      <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-wider mb-4">
        Filters
      </p>

      {/* =====================================
          CATEGORY
      ====================================== */}

      <div className="border-t border-[#f0ebe6] pt-4">
        <h3 className="text-sm font-medium mb-3 text-[#2C2016]">Category</h3>

        <div className="space-y-2">
          {items.map((cat) => {
            // Database name
            const categoryName = normalizeName(cat.name);

            // Check URL mein selected hai ya nahi
            const isChecked = selectedCategories.includes(categoryName);

            return (
              <label
                key={cat._id}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryChange(cat.name)}
                    className="rounded border-[#D6BFA7] accent-[#8B5E3C] focus:ring-0 cursor-pointer"
                  />

                  <span className="text-[#6b7280] text-xs group-hover:text-[#8B5E3C] transition">
                    {cat.name}
                  </span>
                </div>

                <span className="text-[#9ca3af] text-xs">{cat.count ?? 0}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* =====================================
          ROOM TYPE
      ====================================== */}

      <div className="border-t border-[#f0ebe6] pt-4 mt-5">
        <h3 className="text-sm font-medium mb-3 text-[#2C2016]">Room Type</h3>

        <div className="space-y-2">
          {roomTypes.map((room) => {
            // Database room name
            const roomName = normalizeName(room.name);

            // Check URL mein selected hai ya nahi
            const isChecked = selectedRooms.includes(roomName);

            return (
              <label
                key={room._id}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleRoomChange(room.name)}
                    className="rounded border-[#D6BFA7] accent-[#8B5E3C] focus:ring-0 cursor-pointer"
                  />

                  <span className="text-[#6b7280] text-xs group-hover:text-[#8B5E3C] transition">
                    {room.name}
                  </span>
                </div>

                <span className="text-[#9ca3af] text-xs">
                  {room.count ?? 0}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* =====================================
          PRICE RANGE
      ====================================== */}

      <div className="border-t border-[#f0ebe6] pt-4 mt-5">
        <h3 className="text-sm font-medium mb-3 text-[#2C2016]">Price Range</h3>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full p-2 text-xs rounded-md bg-white border border-[#D6BFA7] focus:outline-none focus:border-[#8B5E3C]"
          />

          <span className="text-xs text-gray-400">-</span>

          <input
            type="number"
            placeholder="Max"
            className="w-full p-2 text-xs rounded-md bg-white border border-[#D6BFA7] focus:outline-none focus:border-[#8B5E3C]"
          />
        </div>
      </div>
    </aside>
  );
}
