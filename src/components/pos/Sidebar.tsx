"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Receipt, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const NAV_ITEMS = [
    { href: "/", label: "Overview", icon: LayoutGrid },
    { href: "/orders", label: "Orders", icon: Receipt },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const clearAuth = useAuthStore((s) => s.clearAuth);

    function handleLogout() {
        clearAuth();
        router.push("/login");
    }

    return (
        <aside className="flex h-screen w-52 shrink-0 flex-col border-r border-white/10 bg-[#141414] px-4 py-6">
            <Link href="/" className="mb-8 flex items-center px-1">
                <Image
                    src="/assets/logo.png"
                    alt="Castello"
                    width={116}
                    height={48}
                    className="h-8 w-auto"
                />
            </Link>

            <nav className="flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-zinc-100 text-zinc-900"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="size-4.5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
                <LogOut className="size-4.5" />
                Logout
            </button>
        </aside>
    );
}
