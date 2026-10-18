import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions - NESTRO",
  description: "Terms and conditions for shopping at Nestro.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C221E] py-12 px-6 md:px-16 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C5A3C] hover:underline mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="bg-white border border-[#EBE3DC] rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EBE1] text-[#8C5A3C] rounded-full text-xs font-semibold mb-3">
              <Shield size={14} /> Legal Documentation
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2C2016]">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: January 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using NESTRO, you accept and agree to be bound by the terms and provisions of this agreement. All purchases made through this site are subject to acceptance by Nestro.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                2. Products & Pricing
              </h2>
              <p>
                We strive for absolute accuracy in displaying materials, textures, dimensions, and prices. Prices for our handcrafted pieces are subject to change without notice. All prices are listed in Indian Rupees (INR) inclusive of applicable taxes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                3. Shipping & Delivery
              </h2>
              <p>
                We provide premium delivery across India. Free delivery and white-glove assembly are available for qualifying orders. Delivery schedules are estimates and may vary based on customization and logistics.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                4. Warranty & Support
              </h2>
              <p>
                All hardwood furniture comes with our 5-year structural warranty. For any inquiries regarding warranty claims or assembly assistance, reach out directly via our Contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
