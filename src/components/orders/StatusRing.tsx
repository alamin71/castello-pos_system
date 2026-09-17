"use client";

import { Hourglass, Flame, ChefHat, Soup, type LucideIcon } from "lucide-react";
import { useElapsedTime } from "@/hooks/useElapsedTime";
import type { OrderStatus } from "@/types/order.types";
import { ORDER_STATUS_LABELS } from "@/types/order.types";

const STATUS_ICON: Record<OrderStatus, LucideIcon> = {
    "order-placed": Hourglass,
    "sent-to-kitchen": Flame,
    preparing: ChefHat,
    prepared: Soup,
    completed: Soup,
    cancelled: Hourglass,
};

const STATUS_PROGRESS: Record<OrderStatus, number> = {
    "order-placed": 20,
    "sent-to-kitchen": 45,
    preparing: 70,
    prepared: 100,
    completed: 100,
    cancelled: 0,
};

export function StatusRing({
    status,
    placedAt,
}: {
    status: OrderStatus;
    placedAt: string;
}) {
    const elapsed = useElapsedTime(placedAt);
    const Icon = STATUS_ICON[status];
    const progress = STATUS_PROGRESS[status];
    const circumference = 2 * Math.PI * 20;
    const dashOffset = circumference * (1 - progress / 100);

    return (
        <div className="flex items-center gap-3">
            <div className="relative flex size-14 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" width="56" height="56">
                    <circle cx="28" cy="28" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                    <circle
                        cx="28"
                        cy="28"
                        r="20"
                        stroke="var(--secondary)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                    />
                </svg>
                <Icon className="size-5 text-secondary" />
            </div>
            <div suppressHydrationWarning>
                <p className="text-sm font-semibold text-white">{elapsed} mins</p>
                <p className="text-xs text-white/50">{ORDER_STATUS_LABELS[status]}</p>
            </div>
        </div>
    );
}
