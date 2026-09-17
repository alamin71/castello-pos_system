"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogin } from "@/hooks/mutations/useLogin";

function getErrorMessage(error: unknown, fallback: string) {
    if (isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }
    return fallback;
}

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const login = useLogin();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!identifier.trim() || !password.trim()) {
            setError("Please enter your user ID / phone number and password");
            return;
        }
        setError("");
        login.mutate(
            { identifier, password },
            {
                onSuccess: (data) => {
                    setAuth(data.accessToken, data.refreshToken, data.user);
                    toast.success("Signed in successfully");
                    router.push("/");
                },
                onError: (err) => {
                    setError(getErrorMessage(err, "Could not sign in. Please try again."));
                },
            }
        );
    }

    return (
        <AuthCard
            title="Sign In"
            description="Enter your user ID or phone number & password to sign in"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="identifier" className="text-white">
                    User ID or Phone Number
                </Label>
                <Input
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter user ID or phone number"
                    className="h-12"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-white">
                    Password
                </Label>
                <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
            </div>

            {error && <p className="-mt-2 text-xs text-secondary">{error}</p>}

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white">
                    <Checkbox
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    Remember Me
                </label>
                <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-white hover:text-white/70"
                >
                    Forgot Password?
                </a>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={login.isPending}
                className="h-12 w-full bg-zinc-100 text-base font-semibold text-zinc-900 hover:bg-white"
            >
                {login.isPending ? "Signing in..." : "Sign In"}
            </Button>
        </AuthCard>
    );
}
