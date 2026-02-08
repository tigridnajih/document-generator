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
        <div className={cn("w-full py-8", className)}>
            <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white opacity-90">{title}</h2>
                    {action && <div className="flex items-center gap-3">{action}</div>}
                </div>
                <div className="space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
