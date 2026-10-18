"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoIosArrowRoundForward,
  IoIosArrowDropright,
  IoIosArrowDropleft,
} from "react-icons/io";

export default function Slideshow() {
  return (
    <section className="px-5 sm:px-10 lg:px-20 py-8 scroll-smooth" >
      <div className="relative h-105 w-full overflow-hidden rounded-2xl md:h-125 lg:h-100">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=1400&q=80"
          alt="Fashion"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-8 text-white md:px-12 lg:px-14">
            {/* Small Heading */}
            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-white/80 md:text-xs">
            New Arrivals
            </p>

            {/* Heading */}
            <h1 className="text-4xl font-light leading-[1.05] md:text-5xl lg:text-6xl">
              Gather Around 
              <br />
              <span className="italic text-white/90">Good Wood</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-md text-sm leading-6 text-white/75 md:text-base">
            Scandinavian-inspired furniture for modern living. Curated pieces that endure seasons.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/store"
                className="flex items-center gap-3 rounded-md bg-[#a96f42] px-6 py-3 text-xs tracking-wider text-white transition hover:bg-[#8e5a35] md:text-sm"
              >
                Shop Collection
                <IoIosArrowRoundForward className="text-xl" />
              </Link>

              <Link
                href="/about"
                className="rounded-md border border-white/30 bg-white/5 px-6 py-3 text-xs tracking-wider text-white backdrop-blur-sm transition hover:bg-white/10 md:text-sm"
              >
                View Lookbook
              </Link>
            </div>
          </div>
        </div>

        {/* Previous Arrow */}
        <button className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:left-5 md:h-10 md:w-10">
          <IoIosArrowDropleft className="text-2xl" />
        </button>

        {/* Next Arrow */}
        <button className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-5 md:h-10 md:w-10">
          <IoIosArrowDropright className="text-2xl" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-7 left-8 flex items-center gap-2 md:left-12">
          .
        </div>
      </div>
    </section>
  );
}
