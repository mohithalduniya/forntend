"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import client from "@/utils/helper";
import { useAuth } from "@/context/AuthContext";

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;
    const data = {
      email: form.email.value.trim(),
      password: form.password.value,
    };

    try {
      setLoading(true);

      const response = await client.post("/api/user/login", data);

      if (!response.data.success) {
        toast.error(response.data.message || "Login failed");
        return;
      }

      // Save user & token in context and localStorage
      login(response.data.user, response.data.token);
      toast.success(response.data.message || "Login successful");

      // Redirect based on role or search parameter
      const userRole = response.data.user?.role;
      if (userRole === "admin" || userRole === "superAdmin") {
        router.push("/admin");
      } else if (redirectParam) {
        router.push(redirectParam);
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to sign in. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="min-h-screen bg-[#F9F6F0] font-sans text-[#2C221E]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        {/* LEFT BANNER */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#2A201C] px-6 py-12 text-center text-white sm:px-12 lg:px-16 lg:py-16">
          <Link href="/" className="mb-10">
            <h1 className="text-2xl font-bold tracking-[5px]">
              NESTRO<span className="text-[#D4A373]">.</span>
            </h1>
          </Link>

          <div className="mb-8 flex h-28 w-36 items-center justify-center rounded-2xl border border-[#4A3B34] bg-[#3D302A] shadow-inner">
            <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-[#5A483E]">
              <ShieldCheck size={38} className="text-[#D4A373]" />
            </div>
          </div>

          <h2 className="mb-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">
            Your{" "}
            <span className="font-light italic text-[#D4A373]">
              Dream Home
            </span>{" "}
            Starts Here
          </h2>

          <p className="mb-10 max-w-sm text-sm leading-6 text-gray-400">
            Join 12,000 homeowners who have transformed their
            living spaces with Nestro.
          </p>

          <div className="w-full max-w-sm space-y-4 text-left text-xs leading-5 text-gray-300">
            {[
              "Free delivery + white glove assembly on all orders",
              "Earn reward points on every purchase",
              "Members-only prices & early access",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="shrink-0 rounded-lg bg-[#3A2D27] p-2 text-[#D4A373]">
                  <Check size={15} />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 hidden items-center gap-2 text-xs text-gray-400 sm:flex">
            <ShieldCheck size={15} className="text-[#D4A373]" />
            A comfortable shopping experience, from start to finish.
          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-10 lg:px-12 lg:py-16">
          <div className="w-full max-w-md">

            {/* Tabs */}
            <div className="mb-8 flex border-b border-[#DED5CA]">
              <button
                type="button"
                className="border-b-2 border-[#8C5A3C] px-5 pb-3 text-sm font-semibold text-[#8C5A3C] sm:px-6"
              >
                Sign in
              </button>

              <Link
                href="/signup"
                className="border-b-2 border-transparent px-5 pb-3 text-sm font-medium text-gray-500 transition hover:text-[#8C5A3C] sm:px-6"
              >
                Create account
              </Link>
            </div>

            <div className="mb-7">
              <h2 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome back
              </h2>
              <p className="text-sm leading-6 text-gray-500">
                Sign in to your Nestro account to continue.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-gray-600"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-[#D9D0C5] bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#8C5A3C] focus:ring-1 focus:ring-[#8C5A3C]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-gray-600"
                  >
                    Password
                  </label>

                  <Link
                    href="/contact"
                    className="text-xs text-[#8C5A3C] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-[#D9D0C5] bg-transparent px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#8C5A3C] focus:ring-1 focus:ring-[#8C5A3C]"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8C5A3C]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8C5A3C] py-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#72482F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7 text-center">
              <div className="absolute left-0 right-0 top-1/2 border-t border-[#DED5CA]" />
              <span className="relative bg-[#F9F6F0] px-3 text-xs text-gray-400">
                or continue with
              </span>
            </div>

            {/* Social UI */}
            <div className="space-y-3">
              <button
                type="button"
                disabled
                title="Google sign-in is not configured yet"
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#D9D0C5] bg-white py-3 text-sm font-medium text-gray-500 opacity-80"
              >
                <span className="font-bold text-[#4285F4]">G</span>
                Continue with Google
              </button>

              <button
                type="button"
                disabled
                title="Apple sign-in is not configured yet"
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-[#D9D0C5] bg-white py-3 text-sm font-medium text-gray-500 opacity-80"
              >
                <span className="font-semibold text-black">●</span>
                Continue with Apple
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#8C5A3C] hover:underline"
              >
                Create one free
              </Link>
            </p>

            <div className="mt-4 pt-4 border-t border-[#DED5CA] text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#8C5A3C] hover:text-[#5e3122] font-semibold bg-[#f0e8df] px-3.5 py-1.5 rounded-full transition"
              >
                <ShieldAlert size={13} />
                Store Staff? Sign in to Admin Portal &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}