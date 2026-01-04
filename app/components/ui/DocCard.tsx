"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";
import { DocType } from "@/lib/types";
import { clsx } from "clsx";

interface DocCardProps {
    label: string;
    description: string;
    type: DocType;
    currentType: DocType;
    onSelect: (type: DocType) => void;
    icon?: ReactNode;
}

export function DocCard({
    label,
    description,
    type,
    currentType,
    onSelect,
    icon,
}: DocCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleMouseEnter = () => {
        setIsFocused(true);
    };

    const handleMouseLeave = () => {
        setIsFocused(false);
    };

    const active = currentType === type;

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => onSelect(type)}
            className={clsx(
                "relative overflow-hidden rounded-2xl border p-6 cursor-pointer transition-all duration-300 group select-none",
                "hover:-translate-y-1 hover:border-neutral-700/80",
                active
                    ? "bg-neutral-900/80 border-orange-500/50 shadow-[0_0_50px_-10px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20 scale-[1.02]"
                    : "bg-neutral-900/20 backdrop-blur-md border-neutral-800/40 hover:bg-neutral-900/40 hover:shadow-xl hover:shadow-black/20",
                "shadow-lg shadow-black/10"
            )}
        >
            {/* Gradient border glow effect */}
            {active && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-100 -z-10" />
            )}

            {/* Hover spotlight effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(249,115,22,0.06), transparent 40%)`,
                }}
            />

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                    {icon && (
                        <div className={clsx(
                            "mb-5 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
                            active
                                ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-inner shadow-orange-500/10"
                                : "bg-neutral-800/30 text-neutral-500 border border-neutral-800/50 group-hover:bg-neutral-800/80 group-hover:text-orange-400 group-hover:border-orange-500/20"
                        )}>
                            {icon}
                        </div>
                    )}
                    <h3 className={clsx(
                        "font-semibold text-lg mb-2 transition-colors tracking-tight",
                        active ? "text-white" : "text-neutral-400 group-hover:text-white"
                    )}>
                        {label}
                    </h3>
                    <p className="text-sm text-neutral-600 group-hover:text-neutral-500 transition-colors leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                {active && (
                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-500 animate-[fade-in_0.3s_ease-out]">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_currentColor]" />
                        Selected
                    </div>
                )}
            </div>

            {/* Active state bottom highlight line */}
            {active && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
            )}
        </div>
    );
}

