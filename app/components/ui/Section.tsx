import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
    title: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}

export function Section({ title, children, action, className }: SectionProps) {
    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white">{title}</h2>
                {action}
            </div>
            <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-6 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-sm">
                {children}
            </div>
        </div>
    );
}
