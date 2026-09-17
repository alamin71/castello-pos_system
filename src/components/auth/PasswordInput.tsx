"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PasswordInput({
    value,
    onChange,
    placeholder,
    onKeyDown,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                type={visible ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="h-12 pr-11"
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-white/50 hover:text-white"
                tabIndex={-1}
            >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}
