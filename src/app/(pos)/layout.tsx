"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/pos/Sidebar";
import { useAuthStore } from "@/store/auth.store";

export default function PosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const accessToken = useAuthStore((s) => s.accessToken);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);

    useEffect(() => {
        if (hasHydrated && !accessToken) router.replace("/login");
    }, [hasHydrated, accessToken, router]);

    // Wait for the persisted token to load before deciding anything — checking `accessToken`
    // alone here would see its pre-hydration `null` default on a fresh navigation and bounce
    // an already-logged-in user out to /login (which then bounces them back to "/" once the
    // real token loads a tick later).
    if (!hasHydrated || !accessToken) return null;

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
