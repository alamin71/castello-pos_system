"use client";

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TOTAL_SALES } from "@/lib/mock/dashboard.mock";

function formatKr(value: number | string | undefined) {
    if (typeof value !== "number") return "";
    return `${value.toLocaleString("en-US")} kr.`;
}

export function TotalSalesChart() {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TOTAL_SALES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                        tickFormatter={(v) => `${(v / 100000).toFixed(0)},00,000 kr.`}
                        width={90}
                    />
                    <Tooltip
                        formatter={(value) => formatKr(value as number)}
                        contentStyle={{
                            background: "#1c1c1c",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            color: "#fff",
                        }}
                        labelFormatter={() => ""}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={2}
                        fill="url(#salesFill)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#fff", stroke: "#141414", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
