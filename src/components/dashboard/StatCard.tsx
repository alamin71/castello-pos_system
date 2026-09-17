import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/types/dashboard.types";

export function StatCard({ label, value, deltaPercent, vsLabel }: StatCardData) {
    const isPositive = deltaPercent >= 0;

    return (
        <div className="flex flex-1 flex-col gap-3 rounded-xl bg-white/5 p-5">
            <div className="flex items-start justify-between">
                <p className="text-2xl font-bold text-white">{value}</p>
                <span
                    className={cn(
                        "flex items-center gap-0.5 text-xs font-semibold",
                        isPositive ? "text-emerald-400" : "text-red-400"
                    )}
                >
                    {isPositive ? (
                        <ArrowUpRight className="size-3.5" />
                    ) : (
                        <ArrowDownRight className="size-3.5" />
                    )}
                    {Math.abs(deltaPercent)}%
                </span>
            </div>
            <p className="text-xs text-white/40">
                vs last period <span className="text-white/60">{vsLabel}</span>
            </p>
            <p className="text-sm text-white/60">{label}</p>
        </div>
    );
}
