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
    trendType?: 'up' | 'down' | 'neutral';
    className?: string;
    prefix?: string;
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
                // Use 2 decimal places if it's not a whole number or if it's specifically for 'Average'
                const decimals = latest % 1 === 0 ? 0 : 2;
                ref.current.textContent = Intl.NumberFormat('en-IN', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                }).format(latest);
            }
        });
    }, [springValue, value]);

    if (typeof value !== "number") {
        return <span>{value}</span>;
    }

    return <span ref={ref}>0</span>;
}

export function StatCard({ label, value, icon: Icon, trend, trendType = 'up', className, prefix }: StatCardProps) {
    const trendConfig = {
        // ... (existing trendConfig)
        up: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            dot: "bg-emerald-500",
            ping: "bg-emerald-400",
            text: "text-emerald-400"
        },
        down: {
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            dot: "bg-rose-500",
            ping: "bg-rose-400",
            text: "text-rose-400"
        },
        neutral: {
            bg: "bg-neutral-500/10",
            border: "border-neutral-500/20",
            dot: "bg-neutral-500",
            ping: "bg-neutral-400",
            text: "text-neutral-400"
        }
    }[trendType];

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
                        {prefix && (
                            <span className="text-xl sm:text-2xl text-neutral-500 font-normal mr-0.5">{prefix}</span>
                        )}
                        <CountUp value={value} />
                    </p>
                </div>

                {trend && (
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full border", trendConfig.bg, trendConfig.border)}>
                        <span className="relative flex h-1.5 w-1.5">
                            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", trendConfig.ping)}></span>
                            <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", trendConfig.dot)}></span>
                        </span>
                        <span className={cn("text-[10px] font-medium tracking-wide", trendConfig.text)}>{trend}</span>
                    </div>
                )}
            </div>

            <div className="p-3 bg-neutral-800/30 rounded-xl text-neutral-400 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all duration-300 relative z-10 border border-neutral-700/30 group-hover:border-orange-500/20">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
            </div>
        </div>
    );
}
