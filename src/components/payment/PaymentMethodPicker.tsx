"use client";

import { Banknote, CreditCard } from "lucide-react";
import type { ReactNode } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PaymentMethodId } from "@/types/order.types";

const METHODS: { id: PaymentMethodId; label: string; icon: ReactNode }[] = [
    { id: "cash", label: "Cash", icon: <Banknote className="size-4" /> },
    { id: "card", label: "Card Pay", icon: <CreditCard className="size-4" /> },
];

export function PaymentMethodPicker({
    value,
    onChange,
}: {
    value: PaymentMethodId;
    onChange: (value: PaymentMethodId) => void;
}) {
    return (
        <RadioGroup
            value={value}
            onValueChange={(v) => onChange(v as PaymentMethodId)}
            className="grid grid-cols-2 gap-3"
        >
            {METHODS.map((method) => (
                <Label
                    key={method.id}
                    htmlFor={`payment-${method.id}`}
                    className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm font-medium text-white transition-colors",
                        value === method.id ? "border-secondary" : "border-white/15 hover:border-white/30"
                    )}
                >
                    <span className="flex items-center gap-2">
                        {method.icon}
                        {method.label}
                    </span>
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                </Label>
            ))}
        </RadioGroup>
    );
}
