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

    useEffect(() => {
        if (!accessToken) router.replace("/login");
    }, [accessToken, router]);

    if (!accessToken) return null;

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
