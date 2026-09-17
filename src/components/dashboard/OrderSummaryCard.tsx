import type { OrderSummaryCardData } from "@/types/dashboard.types";

export function OrderSummaryCard({ label, sublabel, count, amount }: OrderSummaryCardData) {
    return (
        <div className="flex flex-col gap-2 rounded-xl bg-white/5 p-4">
            <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-white">
                    {String(count).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-white">{amount}</span>
            </div>
            <div>
                <p className="text-sm text-white">{label}</p>
                <p className="text-xs text-white/40">{sublabel}</p>
            </div>
        </div>
    );
}
