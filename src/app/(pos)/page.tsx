"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopBar } from "@/components/pos/TopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrderSummaryCard } from "@/components/dashboard/OrderSummaryCard";
import { PlatformDonutChart } from "@/components/dashboard/PlatformDonutChart";
import { TotalSalesChart } from "@/components/dashboard/TotalSalesChart";
import { STAT_CARDS, ORDER_SUMMARY_CARDS } from "@/lib/mock/dashboard.mock";

const RANGE_OPTIONS = ["This Week", "Today", "Yesterday"] as const;

export default function OverviewPage() {
    const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>("Today");

    return (
        <div>
            <TopBar />

            <div className="px-8 pb-10">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {RANGE_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => setRange(option)}
                                className={cn(
                                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                                    range === option
                                        ? "border-white bg-transparent text-white"
                                        : "border-transparent bg-white/5 text-white/60 hover:text-white"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                        <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60 hover:text-white">
                            <Calendar className="size-4" />
                            Start date - end date
                        </button>
                    </div>
                    <p className="text-sm font-medium text-white">13 Jan, 2026</p>
                </div>

                <h2 className="mb-4 text-lg font-bold text-white">Overview</h2>
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STAT_CARDS.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {ORDER_SUMMARY_CARDS.map((card) => (
                                <OrderSummaryCard key={card.label} {...card} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>
                        <div className="rounded-xl bg-white/5 p-6">
                            <PlatformDonutChart />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">Total Sales</h2>
                            <p className="mt-1 text-2xl font-bold text-white">
                                2,932,262 kr.
                                <span className="ml-2 text-xs font-semibold text-red-400">-42%</span>
                            </p>
                            <p className="text-xs text-white/40">
                                vs last period <span className="text-white/60">5,046,250 kr.</span>
                            </p>
                        </div>
                        <button className="rounded-lg bg-white/5 px-4 py-2 text-sm text-white">
                            This Month
                        </button>
                    </div>
                    <div className="rounded-xl bg-white/5 p-6">
                        <TotalSalesChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
