"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import client from "@/utils/helper";

export default function SignUp() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const data = {
      name,
      email,
      password,
    };

    try {
      setLoading(true);

      const response = await client.post("api/user/register", data);

      if (!response.data.success) {
        toast.error(response.data.message || "Registration failed");
        return;
      }

      toast.success(response.data.message || "Account created successfully");

      const registeredEmail = response.data.email || email;

      router.push(`/verify-otp?email=${encodeURIComponent(registeredEmail)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
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
            <span className="font-light italic text-[#D4A373]">Dream Home</span>{" "}
            Starts Here
          </h2>

          <p className="mb-10 max-w-sm text-sm leading-6 text-gray-400">
            Join 12,000 homeowners who have transformed their living spaces with
            Nestro.
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
            Create your account and start shopping with Nestro.
          </div>
        </section>

        {/* RIGHT FORM */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="mb-7 flex border-b border-[#DED5CA]">
              <Link
                href="/signin"
                className="border-b-2 border-transparent px-5 pb-3 text-sm font-medium text-gray-500 transition hover:text-[#8C5A3C] sm:px-6"
              >
                Sign in
              </Link>

              <button
                type="button"
                className="border-b-2 border-[#8C5A3C] px-5 pb-3 text-sm font-semibold text-[#8C5A3C] sm:px-6"
              >
                Create account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Create your account
              </h2>

              <p className="text-sm leading-6 text-gray-500">
                Join Nestro to discover furniture for your dream home.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-gray-600"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-[#D9D0C5] bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#8C5A3C] focus:ring-1 focus:ring-[#8C5A3C]"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-gray-600"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    minLength={8}
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-medium text-gray-600"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    minLength={8}
                    required
                    className="w-full rounded-lg border border-[#D9D0C5] bg-transparent px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#8C5A3C] focus:ring-1 focus:ring-[#8C5A3C]"
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8C5A3C]"
                  >
                    {showConfirmPassword ? (
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
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-gray-500">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-[#8C5A3C] hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#8C5A3C] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <p className="mt-6 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-[#8C5A3C] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
