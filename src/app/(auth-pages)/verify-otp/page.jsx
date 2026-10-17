import { Suspense } from "react";
import VerifyForm from "./verify-form";

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading...</p>
            </div>
        }>
            <VerifyForm />
        </Suspense>
    );
}
