"use client";
import React from "react";
import { Leaf, Award, Heart } from "lucide-react";

export default function aboutPage() {
  const team = [
    { initials: "AK", name: "Aarav Kumar", role: "Founder & CEO" },
    { initials: "SM", name: "Sanya Mehta", role: "Head of Design" },
    { initials: "VR", name: "Vikram Rao", role: "Chief Craftsman" },
    { initials: "PJ", name: "Preet Joshi", role: "Customer Experience" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C221E] py-12 px-6 md:px-16 font-sans">
      {/* Hero Banner */}
      <div className="w-full mx-auto bg-[#2A201C] text-white rounded-3xl p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif mb-4 leading-tight">
            Furniture crafted with{" "}
            <span className="italic text-[#D4A373]">purpose</span>
          </h1>
          <p className="text-xs text-gray-300 leading-relaxed">
            Founded in 2018, Nestro was born from a belief that beautiful
            furniture shouldn't be a luxury. We work directly with master
            craftsmen across India and Scandinavia to bring you pieces that are
            honest in material, thoughtful in design, and built to outlast
            trends.
          </p>
        </div>
        <div className="w-full h-64 bg-[#3D302A] rounded-2xl border border-[#4A3B34] overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=1400&q=80"
            alt="page main image"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-200 text-center mb-12">
        <div>
          <h3 className="text-2xl font-bold">12K+</h3>
          <p className="text-[11px] text-gray-500">Homes transformed</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">280+</h3>
          <p className="text-[11px] text-gray-500">Curated products</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">8</h3>
          <p className="text-[11px] text-gray-500">Showrooms across India</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">4.9★</h3>
          <p className="text-[11px] text-gray-500">Average rating</p>
        </div>
      </div>

      {/* Values Section */}
      <div className="w-full mx-auto mb-16">
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-wider">
          What drives us
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <Leaf size={20} className="text-[#8C5A3C] mb-3" />
            <h4 className="text-sm font-semibold mb-2">Sustainable Craft</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We source responsibly — FSC-certified woods, natural fibres, and
              local artisans. Furniture that's good for your home and the
              planet.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <Award size={20} className="text-[#8C5A3C] mb-3" />
            <h4 className="text-sm font-semibold mb-2">
              Uncompromising Quality
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every piece passes a 23-point quality check before it reaches your
              home. We back it with a 5-year warranty.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <Heart size={20} className="text-[#8C5A3C] mb-3" />
            <h4 className="text-sm font-semibold mb-2">Design with Soul</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We don't chase trends. We design furniture that ages gracefully
              and belongs in every chapter of your life.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="w-full mx-auto">
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">
          The people behind Nestro
        </p>
        <h3 className="text-2xl font-serif mb-6">Our Team</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden text-center p-6"
            >
              <div className="w-20 h-20 bg-[#F4EBE1] text-[#8C5A3C] font-semibold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
                {member.initials}
              </div>
              <h5 className="text-xs font-bold text-gray-800">{member.name}</h5>
              <p className="text-[10px] text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
