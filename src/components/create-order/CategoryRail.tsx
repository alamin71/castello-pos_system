"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/product.types";

export function CategoryRail({
    categories,
    activeId,
    onSelect,
}: {
    categories: Category[];
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
                            <span className="text-base">{category.icon}</span>
                            {category.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
