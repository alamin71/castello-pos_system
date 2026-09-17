"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/mutations/useResetPassword";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") ?? "";
    const resetPassword = useResetPassword();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!password || !confirmPassword) {
            setError("Please fill in both password fields");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        resetPassword.mutate(
            { phone, newPassword: password },
            {
                onSuccess: () => {
                    toast.success("Password updated successfully");
                    router.push("/login");
                },
                onError: (err) => {
                    setError(getErrorMessage(err, "Could not reset password. Please try again."));
                },
            }
        );
    }

    return (
        <AuthCard
            title="Set New Password"
            description="Set new password to secure your account"
            backHref="/forgot-password/otp"
            closeHref="/login"
        >
            <div className="flex flex-col gap-2">
                <Label className="text-white">New Password</Label>
                <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter new password"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-white">Confirm New Password</Label>
                <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Re-type new password"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
            </div>

            {error && <p className="-mt-2 text-xs text-secondary">{error}</p>}

            <Button
                onClick={handleSubmit}
                disabled={resetPassword.isPending}
                className="h-12 w-full bg-zinc-100 text-base font-semibold text-zinc-900 hover:bg-white"
            >
                {resetPassword.isPending ? "Saving..." : "Set New Password"}
            </Button>
        </AuthCard>
    );
}
