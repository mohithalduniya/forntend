"use client";
import React from "react";
import { Phone, Mail, Clock, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C221E] py-12 px-6 md:px-16 font-sans">
      <div className="max-w-6xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-[#8C5A3C] font-semibold">Get In Touch</span>
        <h1 className="text-3xl md:text-4xl font-serif mt-1 mb-2">We'd love to hear from you</h1>
        <p className="text-xs text-gray-500">Whether it's a question, a custom order, or just a love note — we're here.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4 text-xs">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#F9F6F0] text-[#8C5A3C] rounded-lg"><Phone size={16} /></div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Phone</p>
                <p className="font-medium">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#F9F6F0] text-[#8C5A3C] rounded-lg"><Mail size={16} /></div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Email</p>
                <p className="font-medium">hello@Nestro.in</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#F9F6F0] text-[#8C5A3C] rounded-lg"><Clock size={16} /></div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Hours</p>
                <p className="font-medium">Mon – Sat, 10am – 7pm IST</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-[#F9F6F0] text-[#8C5A3C] rounded-lg"><MapPin size={16} /></div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold">Flagship Showroom</p>
                <p className="font-medium">MI Road, Jaipur, Rajasthan</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2A201C] text-white p-12 rounded-2xl flex flex-col items-center justify-center text-center">
            <MapPin size={24} className="text-[#D4A373] mb-2" />
            <p className="text-xs font-medium">View on Google Maps</p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-3">Showrooms</p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="font-semibold">Jaipur</p>
                <p className="text-[10px] text-gray-400">MI Road, near Ajmeri Gate</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="font-semibold">Mumbai</p>
                <p className="text-[10px] text-gray-400">Bandra West, Linking Road</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="font-semibold">Bangalore</p>
                <p className="text-[10px] text-gray-400">Indiranagar, 100ft Road</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-medium mb-1">Send us a message</h3>
          <p className="text-xs text-gray-400 mb-6">We typically respond within 24 hours.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you! Your message has been sent. We will reply within 24 hours.");
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">First Name</label>
                <input type="text" defaultValue="Rahul" className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F9F6F0]/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Last Name</label>
                <input type="text" defaultValue="Khanna" className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F9F6F0]/50 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Email</label>
              <input type="email" defaultValue="rahul@email.com" className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F9F6F0]/50 focus:outline-none" />
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Subject</label>
              <select className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F9F6F0]/50 focus:outline-none text-gray-700">
                <option>General Enquiry</option>
                <option>Order Support</option>
                <option>Custom Furniture</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Message</label>
              <textarea rows={4} placeholder="Tell us how we can help..." className="w-full p-2.5 rounded-lg border border-gray-200 bg-[#F9F6F0]/50 focus:outline-none"></textarea>
            </div>

            <button type="submit" className="w-full py-3 bg-[#8C5A3C] text-white rounded-lg font-medium hover:bg-[#72482F] transition-all flex items-center justify-center gap-2">
              Send Message <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}