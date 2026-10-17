"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdAdminPanelSettings,
  MdLockOutline,
  MdOutlineEmail,
} from "react-icons/md";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import client from "@/utils/helper";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@nestro.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter admin email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await client.post("/api/user/admin/login", {
        email: email.trim(),
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Admin login failed");
        return;
      }

      // Store in auth context and localStorage
      login(response.data.user, response.data.token);

      toast.success(response.data.message || "Admin signed in successfully");
      router.push("/admin");
    } catch (error) {
      console.error("Admin Login Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to authenticate as administrator"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-4 font-sans text-gray-100">
      <div className="w-full max-w-md">
        {/* Brand / Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/5">
            <MdAdminPanelSettings className="text-teal-400 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            NESTRO<span className="text-teal-400">.</span> ADMIN
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">
            Management & Control Center
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#142334] border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">
              Administrator Sign In
            </h2>
            <p className="text-xs text-gray-400">
              Enter your authorized staff credentials to continue.
            </p>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="mb-6 p-3 rounded-xl bg-teal-950/40 border border-teal-700/40 text-xs text-teal-300 flex items-start gap-2.5">
            <ShieldCheck size={16} className="shrink-0 mt-0.5 text-teal-400" />
            <div>
              <p className="font-semibold text-teal-200">Default Admin Account</p>
              <p className="text-[11px] text-teal-400 mt-0.5">
                Email: <span className="font-mono text-white">admin@nestro.com</span> | Pass:{" "}
                <span className="font-mono text-white">admin123</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <MdOutlineEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nestro.com"
                  required
                  className="w-full bg-[#1b2c40] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <MdLockOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  className="w-full bg-[#1b2c40] border border-gray-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Customer login link */}
          <div className="mt-6 pt-5 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-400">
              Looking for customer account?{" "}
              <Link
                href="/signin"
                className="text-teal-400 hover:text-teal-300 font-medium underline-offset-2 hover:underline"
              >
                Go to User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
