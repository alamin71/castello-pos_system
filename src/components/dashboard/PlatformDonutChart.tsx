"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PLATFORM_BREAKDOWN, PLATFORM_TOTAL } from "@/lib/mock/dashboard.mock";

export function PlatformDonutChart() {
    return (
        <div className="flex items-center gap-6">
            <div className="relative size-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={PLATFORM_BREAKDOWN}
                            dataKey="count"
                            nameKey="platform"
                            innerRadius={52}
                            outerRadius={76}
                            paddingAngle={3}
                            stroke="none"
                        >
                            {PLATFORM_BREAKDOWN.map((entry) => (
                                <Cell key={entry.platform} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{PLATFORM_TOTAL}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {PLATFORM_BREAKDOWN.map((entry) => (
                    <div key={entry.platform} className="flex items-center gap-2">
                        <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <div>
                            <p className="text-sm font-semibold text-white">
                                {entry.count} <span className="font-normal text-white/50">{entry.amount}</span>
                            </p>
                            <p className="text-xs text-white/40">{entry.platform}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
