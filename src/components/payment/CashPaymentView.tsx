"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCashSuggestions } from "@/lib/cashSuggestions";

export function CashPaymentView({
    total,
    onBack,
    onSubmit,
}: {
    total: number;
    onBack: () => void;
    onSubmit: (received: number) => void;
}) {
    const suggestions = getCashSuggestions(total);
    const [received, setReceived] = useState(suggestions[suggestions.length - 1]);
    const change = Math.max(received - total, 0);

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-8 py-5">
                <button
                    onClick={onBack}
                    className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10"
                >
                    <ArrowLeft className="size-4" />
                </button>
                <h1 className="text-xl font-bold text-white">Cash Payment</h1>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-8">
                <div className="text-center">
                    <p className="text-4xl font-bold text-white">{total.toLocaleString()} kr.</p>
                    <p className="mt-1 text-sm text-white/50">Total Bill</p>
                </div>

                <div className="flex gap-3">
                    <div className="rounded-lg bg-white/5 px-5 py-3 text-sm text-white">
                        Received <span className="ml-1 font-semibold">{received.toLocaleString()} kr.</span>
                    </div>
                    <div className="rounded-lg bg-white/5 px-5 py-3 text-sm text-white">
                        Change <span className="ml-1 font-semibold text-secondary">{change.toLocaleString()} kr.</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    {suggestions.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => setReceived(amount)}
                            className={cn(
                                "rounded-lg border px-5 py-3 text-sm font-semibold text-white transition-colors",
                                received === amount
                                    ? "border-secondary"
                                    : "border-white/15 hover:border-white/30"
                            )}
                        >
                            {amount.toLocaleString()} kr.
                        </button>
                    ))}
                </div>

                <Button
                    onClick={() => onSubmit(received)}
                    className="h-12 w-72 bg-secondary text-base font-semibold text-white hover:bg-secondary/90"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}
