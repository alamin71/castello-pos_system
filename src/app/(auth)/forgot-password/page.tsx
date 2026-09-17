"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/mutations/useForgotPassword";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const forgotPassword = useForgotPassword();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    function handleSendOtp() {
        if (!phone.trim()) {
            setError("Please enter your phone number");
            return;
        }
        setError("");
        forgotPassword.mutate(phone, {
            onSuccess: () => {
                router.push(`/forgot-password/otp?phone=${encodeURIComponent(phone)}`);
            },
            onError: (err) => {
                setError(getErrorMessage(err, "Could not send OTP. Please try again."));
            },
        });
    }

    return (
        <AuthCard
            title="Forgot Password?"
            description="Enter your phone number to get an OTP code"
            backHref="/login"
            closeHref="/login"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-white">
                    Phone Number
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    placeholder="Enter phone number"
                    className="h-12"
                />
                {error && <p className="text-xs text-secondary">{error}</p>}
            </div>

            <Button
                onClick={handleSendOtp}
                disabled={forgotPassword.isPending}
                className="h-12 w-full bg-zinc-100 text-base font-semibold text-zinc-900 hover:bg-white"
            >
                {forgotPassword.isPending ? "Sending..." : "Send OTP"}
            </Button>
        </AuthCard>
    );
}
