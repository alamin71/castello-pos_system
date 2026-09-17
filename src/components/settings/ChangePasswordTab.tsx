"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/mutations/useChangePassword";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) return error.response?.data?.message ?? fallback;
    return fallback;
}

export function ChangePasswordTab() {
    const changePassword = useChangePassword();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields");
            return;
        }
        setError("");
        changePassword.mutate(
            { currentPassword, newPassword, confirmPassword },
            {
                onSuccess: () => {
                    toast.success("Password changed successfully");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                },
                onError: (err) => setError(getErrorMessage(err, "Could not change password. Please try again.")),
            }
        );
    }

    return (
        <div className="flex max-w-md flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-white">Current Password</Label>
                <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Enter current password" />
            </div>
            <div className="flex flex-col gap-2">
                <Label className="text-white">New Password</Label>
                <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="Enter new password" />
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

            {error && <p className="text-xs text-secondary">{error}</p>}

            <Button
                onClick={handleSubmit}
                disabled={changePassword.isPending}
                className="h-11 w-full bg-secondary text-white hover:bg-secondary/90"
            >
                {changePassword.isPending ? "Saving..." : "Set New Password"}
            </Button>
        </div>
    );
}
