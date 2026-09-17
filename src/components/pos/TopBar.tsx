"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";

function formatClock(date: Date) {
    const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    const day = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    return `${time}  ${day}`;
}

export function TopBar({ rightAction }: { rightAction?: ReactNode }) {
    const user = useAuthStore((s) => s.user);
    const [now, setNow] = useState<Date>(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3.5 py-2 text-sm text-white">
                    <MapPin className="size-4 text-white/60" />
                    {user?.branch?.name ?? "—"}
                </div>
                <div
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-3.5 py-2 text-sm text-white"
                    suppressHydrationWarning
                >
                    <Clock className="size-4 text-white/60" />
                    {formatClock(now)}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {rightAction}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs text-white/50">{user?.userId ?? "—"}</p>
                        <p className="text-sm font-semibold text-white">{user?.name ?? "Guest"}</p>
                    </div>
                    <Avatar size="lg">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
