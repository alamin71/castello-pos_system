import { User } from "lucide-react";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    return parts
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
}

export function ProfileAvatar({
    image,
    name,
    size = "lg",
    className,
}: {
    image?: string;
    name?: string;
    size?: "sm" | "lg";
    className?: string;
}) {
    const dimension = size === "lg" ? "size-20" : "size-10";

    if (image) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={image} alt={name ?? "Profile"} className={cn(dimension, "rounded-full object-cover", className)} />;
    }

    return (
        <div
            className={cn(
                dimension,
                "flex items-center justify-center rounded-full bg-secondary/15 text-secondary",
                size === "lg" ? "text-xl font-semibold" : "text-sm font-semibold",
                className
            )}
        >
            {name ? getInitials(name) : <User className="size-1/2" />}
        </div>
    );
}
