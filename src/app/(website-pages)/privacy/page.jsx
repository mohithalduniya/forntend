import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - NESTRO",
  description: "Privacy policy and data protection at Nestro.",
};

export default function PrivacyPage() {
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
              <Lock size={14} /> Security & Transparency
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2C2016]">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: January 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                1. Information We Collect
              </h2>
              <p>
                When you create an account, browse Nestro, or complete a checkout, we collect essential personal details such as your name, email address, delivery addresses, and phone number to fulfill orders smoothly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                2. How We Protect Your Data
              </h2>
              <p>
                Your privacy is paramount. We never sell your personal data to third parties. We use industry-standard encryption for authentication and transactions, and your payment details are handled via secure payment gateways.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#2C2016] mb-2">
                3. Your Rights
              </h2>
              <p>
                You can access, modify, or delete your profile information at any time from your Account Profile dashboard. If you need assistance with data inquiries, contact us at hello@nestro.in.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
