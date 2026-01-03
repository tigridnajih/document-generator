"use strict";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: "Generated" | "Sent";
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                status === "Generated"
                    ? "bg-neutral-900/50 text-neutral-400 border-neutral-700"
                    : "bg-orange-500/10 text-orange-400 border-orange-500/20",
                className
            )}
        >
            {status}
        </span>
    );
}
