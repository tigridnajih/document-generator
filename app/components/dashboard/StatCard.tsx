"use client";

import { useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string; // e.g., "+12.5%"
}

function CountUp({ value }: { value: number | string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
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
        // Handle string values (like "$4,400") by stripping non-numeric for animation if desired, 
        // or just static display. For this simple version, let's just display string as is.
        // Actually, let's try to parse if it starts with $.
        if (typeof value === "string" && value.startsWith("$")) {
            // We can't easily animate currency without custom logic. 
            // Let's just return static for strings to be safe and simple.
            return <span>{value}</span>;
        }
        return <span>{value}</span>;
    }

    return <span ref={ref}>0</span>;
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-5 rounded-xl flex items-center justify-between group hover:border-neutral-700 hover:shadow-lg hover:shadow-orange-900/10 transition-all duration-300">
            <div className="space-y-1">
                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">{label}</p>
                <p className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                    {/* Handle currency manually if needed or generic CountUp */}
                    <CountUp value={typeof value === "string" && value.includes(",") ? parseInt(value.replace(/[^0-9]/g, "")) : value} />
                    {typeof value === "string" && value.startsWith("$") && <span className="-order-1">$</span>}
                </p>
                {trend && (
                    <p className="text-xs text-green-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {trend}
                    </p>
                )}
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg text-neutral-300 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
}
