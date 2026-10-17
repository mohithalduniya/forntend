import React from "react";
import { FaInstagram, FaYoutube, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#171008] text-[#817C77] px-6 sm:px-10 lg:px-20 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-[#FAF7F4] uppercase tracking-[3px] text-sm mb-3 font-semibold">
            Nestro.
          </h2>

          <p className="text-[12px] leading-relaxed max-w-sm mb-6">
            Curated furniture for thoughtful homes. Crafted with intention, made
            to endure.
          </p>

          <div className="flex w-full max-w-sm">
            <input
              type="email"
              placeholder="Your email address"
              className="
                flex-1
                min-w-0
                bg-[#29231D]
                border border-[#4A4138] 
                rounded-l-md
                px-4 py-2.5
                text-[12px]
                text-white
                outline-none
                placeholder:text-[#817C77]
                focus:border-[#95613C]
              "
            />

            <button
              className="
                bg-[#95613C]
                text-white
                text-[12px]
                font-medium
                px-5
                rounded-r-md
                hover:bg-[#A97048]
                transition
              "
            >
              Subscribe
            </button>
          </div>
        </div>

        <div>
          <h3 className="uppercase tracking-[3px] text-[10px] text-[#C6A27E] mb-5 font-semibold">
            Company
          </h3>

          <div className="flex flex-col gap-3 text-[12px]">
            <a href="#" className="hover:text-[#FAF7F4] transition">
              Our Story
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Sustainability
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Showrooms
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Careers
            </a>
          </div>
        </div>

        <div>
          <h3 className="uppercase tracking-[3px] text-[10px] text-[#C6A27E] mb-5 font-semibold">
            Support
          </h3>

          <div className="flex flex-col gap-3 text-[12px]">
            <a href="#" className="hover:text-[#FAF7F4] transition">
              Track Order
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Returns & Exchange
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Assembly Help
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Contact Us
            </a>
          </div>
        </div>

        <div>
          <h3 className="uppercase tracking-[3px] text-[10px] text-[#C6A27E] mb-5 font-semibold">
            Follow Us
          </h3>

          <div className="flex flex-col gap-3 text-[12px] mb-6">
            <a href="#" className="hover:text-[#FAF7F4] transition">
              Instagram
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Pinterest
            </a>

            <a href="#" className="hover:text-[#FAF7F4] transition">
              Houzz
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="
                w-8 h-8
                rounded-full
                border border-[#4A4138]
                flex items-center justify-center
                hover:border-[#95613C]
                hover:text-[#C6A27E]
                transition
              "
            >
              <FaInstagram size={14} />
            </a>

            <a
              href="#"
              className="
                w-8 h-8
                rounded-full
                border border-[#4A4138]
                flex items-center justify-center
                hover:border-[#95613C]
                hover:text-[#C6A27E]
                transition
              "
            >
              <FaPinterest size={14} />
            </a>

            <a
              href="#"
              className="
                w-8 h-8
                rounded-full
                border border-[#4A4138]
                flex items-center justify-center
                hover:border-[#95613C]
                hover:text-[#C6A27E]
                transition
              "
            >
              <FaYoutube size={14} />
            </a>
          </div>
        </div>
      </div>

      <div
        className="
          border-t border-[#302820]
          mt-12 pt-6
          flex flex-col md:flex-row
          justify-between items-center
          gap-4
          text-[11px]
        "
      >
        <p>© 2026 Nestro. All rights reserved.</p>

        <div className="flex gap-6">
          <a href="#" className="hover:text-[#FAF7F4] transition">
            Privacy
          </a>

          <a href="#" className="hover:text-[#FAF7F4] transition">
            Terms
          </a>

          <a href="#" className="hover:text-[#FAF7F4] transition">
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
