import { fetchroom } from "@/api/room";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ShopRoom() {
  const response = await fetchroom();

  const rooms = response?.data || [];

  return (
    <section className="px-5 sm:px-10 lg:px-20 py-8">
      {/* Section Heading */}
      <div className="mb-6">
        <p className="text-[#5E3122] text-[12px] font-semibold tracking-wider uppercase">
          CURATED BY SPACE
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-1">
          Shop by Room
        </h2>
      </div>

      {/* Empty State */}
      {rooms.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No rooms available.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-5">
          {rooms.map((room, index) => {
            /*
              First room = Large card
              Remaining rooms = Small cards
            */

            const isFirstRoom = index === 0;

            return (
              <Link
                href={`/store?room=${encodeURIComponent(room.name)}`}
                key={room._id || room.id || room.name}
                className={
                  isFirstRoom
                    ? "lg:col-span-2 relative h-75 sm:h-100 lg:h-96.25 overflow-hidden rounded-3xl group"
                    : "lg:col-span-1 relative h-50 sm:h-62.5 lg:h-46.25 overflow-hidden rounded-3xl group"
                }
              >
                {/* Image */}
                <img
                  src={room.image}
                  alt={room.name || "Room"}
                  sizes={
                    isFirstRoom
                      ? "(max-width: 1024px) 100vw, 40vw"
                      : "(max-width: 640px) 100vw, 25vw"
                  }
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />

                {/* Content */}
                <div className="absolute bottom-4 left-4 z-10 text-white">
                  <p className="text-sm sm:text-base font-medium drop-shadow-md">
                    {room.name}
                  </p>

                  <p className="text-[10px] sm:text-[12px] drop-shadow-md">
                    {room.productCount || 0} pieces
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
