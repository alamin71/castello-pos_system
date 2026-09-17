"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import type { ReactNode } from "react";

export function AuthCard({
    title,
    description,
    backHref,
    closeHref,
    children,
}: {
    title: string;
    description: string;
    backHref?: string;
    closeHref?: string;
    children: ReactNode;
}) {
    return (
        <div className="w-full max-w-[560px] rounded-3xl bg-[#1c1c1c] p-8 sm:p-10">
            {(backHref || closeHref) && (
                <div className="mb-6 flex items-center justify-between">
                    {backHref ? (
                        <Link
                            href={backHref}
                            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-sm text-white transition-colors hover:bg-white/15"
                        >
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                    ) : (
                        <span />
                    )}
                    {closeHref && (
                        <Link
                            href={closeHref}
                            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
                        >
                            <X className="size-4" />
                        </Link>
                    )}
                </div>
            )}

            <div className="flex flex-col items-center text-center">
                <Image
                    src="/assets/logo.png"
                    alt="Castello"
                    width={140}
                    height={58}
                    className="h-14 w-auto"
                    priority
                />
                <h1 className="mt-6 text-2xl font-bold text-white">{title}</h1>
                <p className="mt-1.5 text-sm text-white/50">{description}</p>
            </div>

            <div className="mt-8 flex flex-col gap-5">{children}</div>
        </div>
    );
}
