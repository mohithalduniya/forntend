"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import client from "@/utils/helper";

const OTP_LENGTH = 6;
const OTP_VALID_SECONDS = 5 * 60; // matches backend OTP validity
const RESEND_COOLDOWN_SECONDS = 30; // matches backend resend cooldown

const formatTime = (total) => {
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
};

export default function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [expiresIn, setExpiresIn] = useState(OTP_VALID_SECONDS);
    const [resendIn, setResendIn] = useState(RESEND_COOLDOWN_SECONDS);
    const inputRefs = useRef([]);

    // Without an email there is nothing to verify: send the user back to signup
    useEffect(() => {
        if (!email) router.replace("/signup");
    }, [email, router]);

    // One ticking interval drives both the expiry and the resend countdowns
    useEffect(() => {
        const timer = setInterval(() => {
            setExpiresIn((v) => (v > 0 ? v - 1 : 0));
            setResendIn((v) => (v > 0 ? v - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const digits = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);
        if (!digits) return;
        e.preventDefault();
        const next = Array(OTP_LENGTH).fill("");
        digits.split("").forEach((d, i) => (next[i] = d));
        setOtp(next);
        inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    };

    const otpValue = otp.join("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (otpValue.length !== OTP_LENGTH) {
            toast.error("Please enter the 6-digit code");
            return;
        }

        try {
            setLoading(true);
            const response = await client.post("api/user/verify-register-otp", {
                otp: otpValue,
                email,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                router.push("/signin");
            } else {
                toast.error(response.data.message || "Verification failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resending || resendIn > 0) return;

        try {
            setResending(true);
            const response = await client.post("api/user/resend-register-otp", {
                email,
            });
            toast.success(response.data.message || "OTP resent successfully");
            setOtp(Array(OTP_LENGTH).fill(""));
            setExpiresIn(OTP_VALID_SECONDS);
            setResendIn(RESEND_COOLDOWN_SECONDS);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-[4px] text-[#2C2016]">
                        NESTRO
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Secure account verification
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-[#E8E0D5] rounded-2xl p-7 shadow-sm">

                    {/* Icon */}
                    <div className="flex justify-center mb-5">
                        <div className="w-14 h-14 rounded-full bg-[#F5EEE8] flex items-center justify-center">
                            <ShieldCheck size={28} className="text-[#8B5E3C]" />
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-[#2C2016]">
                            Verify your email
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            We have sent a 6-digit verification code to{" "}
                            <span className="font-medium text-[#2C2016] break-all">
                                {email || "your email address"}
                            </span>
                            .
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8">

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        inputRefs.current[index] = element;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete={index === 0 ? "one-time-code" : "off"}
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold text-[#2C2016] border border-[#E8E0D5] rounded-lg outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                                />
                            ))}
                        </div>

                        {/* Timer */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            {expiresIn > 0 ? (
                                <>
                                    Code expires in{" "}
                                    <span className="font-semibold text-[#8B5E3C]">
                                        {formatTime(expiresIn)}
                                    </span>
                                </>
                            ) : (
                                <span className="font-semibold text-red-600">
                                    Code expired. Please resend OTP.
                                </span>
                            )}
                        </p>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={loading || otpValue.length !== OTP_LENGTH || expiresIn === 0}
                            className="w-full h-12 mt-6 rounded-lg bg-[#2C2016] text-white font-medium hover:bg-[#3b2a1d] transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>

                    </form>

                    {/* Resend */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Didn&apos;t receive the code?
                        </p>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending || resendIn > 0}
                            className="mt-1 text-sm font-medium text-[#8B5E3C] hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
                        >
                            {resending
                                ? "Sending..."
                                : resendIn > 0
                                  ? `Resend OTP in ${resendIn}s`
                                  : "Resend OTP"}
                        </button>
                    </div>

                    {/* Back */}
                    <div className="flex justify-center mt-6">
                        <Link
                            href="/signup"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B5E3C]"
                        >
                            <ArrowLeft size={16} />
                            Back to Sign Up
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
