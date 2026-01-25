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
        <div className={cn("w-full py-2", className)}>
            <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white opacity-90">{title}</h2>
                    {action && <div className="flex items-center gap-3">{action}</div>}
                </div>
                <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-6 space-y-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] backdrop-blur-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
