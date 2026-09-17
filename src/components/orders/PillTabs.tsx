"use client";

import { cn } from "@/lib/utils";

export interface PillTabOption<T extends string> {
    value: T;
    label: string;
    count: number;
}

export function PillTabs<T extends string>({
    options,
    value,
    onChange,
    variant = "default",
}: {
    options: PillTabOption<T>[];
    value: T;
    onChange: (value: T) => void;
    variant?: "default" | "outline";
}) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 rounded-lg p-1",
                variant === "default" ? "bg-white/5" : "gap-3 bg-transparent p-0"
            )}
        >
            {options.map((option) => {
                const isActive = option.value === value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                            variant === "default"
                                ? isActive
                                    ? "bg-white text-zinc-900"
                                    : "text-white/60 hover:text-white"
                                : isActive
                                    ? "border border-white text-white"
                                    : "border border-transparent text-white/60 hover:text-white"
                        )}
                    >
                        {option.label}
                        <span
                            className={cn(
                                "rounded-full px-1.5 text-xs",
                                isActive && variant === "default"
                                    ? "bg-zinc-900/10 text-zinc-900"
                                    : "bg-white/10 text-white/60"
                            )}
                        >
                            {option.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
