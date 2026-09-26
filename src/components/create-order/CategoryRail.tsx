"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CategoryRailItem {
    id: string;
    name: string;
    image?: string;
    icon?: ReactNode;
}

export function CategoryRail({
    categories,
    activeId,
    onSelect,
}: {
    categories: CategoryRailItem[];
    activeId: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="w-48 shrink-0">
            <p className="mb-3 px-2 text-sm font-semibold text-white/60">Categories</p>
            <div className="flex flex-col gap-1">
                {categories.map((category) => {
                    const isActive = category.id === activeId;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className={cn(
                                "flex items-center gap-3 rounded-l-lg border-r-2 px-3 py-2.5 text-left text-sm font-medium transition-colors",
                                isActive
                                    ? "border-secondary bg-white/5 text-white"
                                    : "border-transparent text-white/60 hover:text-white"
                            )}
                        >
                            {category.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={category.image} alt="" className="size-5 shrink-0 rounded object-cover" />
                            ) : (
                                category.icon
                            )}
                            <span className="truncate">{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
