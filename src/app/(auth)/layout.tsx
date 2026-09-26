"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const accessToken = useAuthStore((s) => s.accessToken);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);

    useEffect(() => {
        if (hasHydrated && accessToken) router.replace("/");
    }, [hasHydrated, accessToken, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
            {children}
        </div>
    );
}
