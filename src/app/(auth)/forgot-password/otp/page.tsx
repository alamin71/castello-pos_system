"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/mutations/useForgotPassword";
import { useVerifyOtp } from "@/hooks/mutations/useVerifyOtp";

const RESEND_SECONDS = 60;

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={null}>
            <VerifyOtpForm />
        </Suspense>
    );
}

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") ?? "";
    const forgotPassword = useForgotPassword();
    const verifyOtp = useVerifyOtp();

    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(RESEND_SECONDS);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function startInterval() {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    useEffect(() => {
        startInterval();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    function handleOtpChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    }

    function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    }

    function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            otpRefs.current[5]?.focus();
        }
    }

    function handleResend() {
        setError("");
        forgotPassword.mutate(phone, {
            onSuccess: () => {
                setOtp(["", "", "", "", "", ""]);
                setCountdown(RESEND_SECONDS);
                otpRefs.current[0]?.focus();
                startInterval();
            },
            onError: (err) => {
                setError(getErrorMessage(err, "Could not resend OTP. Please try again."));
            },
        });
    }

    function handleVerify() {
        const otpValue = otp.join("");
        if (otpValue.length < 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }
        setError("");
        verifyOtp.mutate(
            { phone, otp: otpValue },
            {
                onSuccess: () => {
                    router.push(`/forgot-password/reset?phone=${encodeURIComponent(phone)}`);
                },
                onError: (err) => {
                    setError(getErrorMessage(err, "Invalid code. Please try again."));
                },
            }
        );
    }

    return (
        <AuthCard
            title="OTP Verification"
            description="Enter the OTP code we sent to your phone number"
            backHref="/forgot-password"
            closeHref="/login"
        >
            {phone && <p className="-mt-4 text-center text-sm font-semibold text-white">{phone}</p>}

            <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className="h-14 w-12 rounded-lg border border-white/20 bg-transparent text-center text-xl font-medium text-white outline-none transition-colors focus:border-white"
                    />
                ))}
            </div>
            {error && <p className="text-center text-xs text-secondary">{error}</p>}

            <div className="text-center text-sm">
                <span className="text-white/50">Didn&apos;t get OTP? </span>
                {countdown > 0 ? (
                    <span className="text-white/30">0:{String(countdown).padStart(2, "0")}</span>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={forgotPassword.isPending}
                        className="cursor-pointer font-semibold text-white hover:text-white/70"
                    >
                        Resend
                    </button>
                )}
            </div>

            <Button
                onClick={handleVerify}
                disabled={verifyOtp.isPending}
                className="h-12 w-full bg-zinc-100 text-base font-semibold text-zinc-900 hover:bg-white"
            >
                {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
        </AuthCard>
    );
}
