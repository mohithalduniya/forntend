"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from 'sonner';
import client from "@/utils/helper";

export default function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);

        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpValue = otp.join("");
        const data = {
            otp: otpValue,
            email: email,
        };

        client.post(`api/user/verify-register-otp`, data).then(
            (response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
                    router.push(`/signin`);
                }
            }
        ).catch(
            (error) => {
                toast.error(error.response?.data.message || "Internal Server Error");
            }
        );
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
                            <ShieldCheck
                                size={28}
                                className="text-[#8B5E3C]"
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-[#2C2016]">
                            Verify your email
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            We have sent a 6-digit verification code
                            to your email address.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8"
                    >

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
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(
                                            e.target.value,
                                            index
                                        )
                                    }
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, index)
                                    }
                                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold text-[#2C2016] border border-[#E8E0D5] rounded-lg outline-none focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C]"
                                />
                            ))}
                        </div>

                        {/* Timer */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            Code expires in{" "}
                            <span className="font-semibold text-[#8B5E3C]">
                                03:00
                            </span>
                        </p>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            className="w-full h-12 mt-6 rounded-lg bg-[#2C2016] text-white font-medium hover:bg-[#3b2a1d] transition"
                        >
                            Verify Email
                        </button>

                    </form>

                    {/* Resend */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Didn't receive the code?
                        </p>

                        <button
                            type="button"
                            className="mt-1 text-sm font-medium text-[#8B5E3C] hover:underline"
                        >
                            Resend OTP
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
