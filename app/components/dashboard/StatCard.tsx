"use client";

import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    className?: string;
}

function CountUp({ value }: { value: number | string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 2500, bounce: 0 });
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && typeof value === "number") {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current && typeof value === "number") {
                ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
            }
        });
    }, [springValue, value]);

    if (typeof value !== "number") {
        return <span>{value}</span>;
    }

    return <span ref={ref}>0</span>;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 rounded-2xl flex items-start justify-between group hover:border-orange-500/20 hover:bg-neutral-900/60 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.1)]",
            className
        )}>
            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="space-y-4 relative z-10">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 group-hover:text-neutral-400 transition-colors">
                        {label}
                    </p>
                    <p className="text-3xl sm:text-4xl font-semibold tracking-tighter text-white flex items-baseline gap-1">
                        {typeof value === "string" && value.startsWith("$") && (
                            <span className="text-xl sm:text-2xl text-neutral-500 font-normal mr-0.5">$</span>
                        )}
                        <CountUp value={typeof value === "string" && value.includes(",") ? parseInt(value.replace(/[^0-9]/g, "")) : value} />
                    </p>
                </div>

                {trend && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-medium text-emerald-400 tracking-wide">{trend}</span>
                    </div>
                )}
            </div>

            <div className="p-3 bg-neutral-800/30 rounded-xl text-neutral-400 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all duration-300 relative z-10 border border-neutral-700/30 group-hover:border-orange-500/20">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            </div>
        </div>
    );
}
