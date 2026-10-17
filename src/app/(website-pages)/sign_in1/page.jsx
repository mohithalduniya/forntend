"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Search, ShoppingBag, User, Check, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col justify-between font-sans text-[#2C221E]">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Banner */}
        <div className="bg-[#2A201C] text-white p-8 lg:p-16 flex flex-col justify-center items-center text-center relative">
          <div className="mb-8">
            <h1 className="text-2xl tracking-widest font-bold">NESTRO.</h1>
          </div>
          <div className="w-32 h-24 bg-[#3D302A] rounded-xl flex items-center justify-center mb-8 border border-[#4A3B34] shadow-inner">
            <div className="w-20 h-12 bg-[#5A483E] rounded-lg"></div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-serif mb-4">
            Your <span className="italic font-light text-[#D4A373]">Dream Home</span> Starts Here
          </h2>
          <p className="text-gray-400 max-w-sm mb-12 text-sm">
            Join 12,000 homeowners who've transformed their living spaces with Nestro.
          </p>

          <div className="space-y-4 text-left w-full max-w-xs text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3A2D27] rounded-lg text-[#D4A373]"><Check size={14} /></div>
              <span>Free delivery + white glove assembly on all orders</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3A2D27] rounded-lg text-[#D4A373]"><Check size={14} /></div>
              <span>Earn reward points on every purchase</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#3A2D27] rounded-lg text-[#D4A373]"><Check size={14} /></div>
              <span>Members-only prices & early access</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center max-w-lg mx-auto w-full">
          <div className="flex border-b border-gray-300 mb-8">
            <button
              onClick={() => setActiveTab("signin")}
              className={`pb-3 pr-6 font-medium text-sm border-b-2 transition-all ${
                activeTab === "signin"
                  ? "border-[#8C5A3C] text-[#8C5A3C]"
                  : "border-transparent text-gray-500"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setActiveTab("sign up")}
              className={`pb-3 px-6 font-medium text-sm border-b-2 transition-all ${
                activeTab === "signup"
                  ? "border-[#8C5A3C] text-[#8C5A3C]"
                  : "border-transparent text-gray-500"
              }`}
            >
              Create account
            </button>
          </div>

          <h3 className="text-2xl font-semibold mb-1">Welcome back</h3>
          <p className="text-xs text-gray-500 mb-6">Sign in to your Nestro account to continue.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email address</label>
              <input
                type="email"
                defaultValue="rahul@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-transparent text-sm focus:outline-none focus:border-[#8C5A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-transparent text-sm focus:outline-none focus:border-[#8C5A3C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-xs text-gray-500 hover:text-[#8C5A3C]">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8C5A3C] text-white text-sm rounded-lg font-medium hover:bg-[#72482F] transition-all shadow-sm"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 text-center text-xs text-gray-400 relative">
            <span className="bg-[#F9F6F0] px-3 relative z-10">or continue with</span>
            <div className="absolute top-1/2 left-0 right-0 border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all bg-white">
              Continue with Google
            </button>
            <button className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all bg-white">
              Continue with Apple
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            Don't have an account? <a href="#" className="text-[#8C5A3C] font-medium">Create one free</a>
          </p>
        </div>
      </div>
    </div>
  );
}