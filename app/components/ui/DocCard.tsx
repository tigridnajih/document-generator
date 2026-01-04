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
                "relative overflow-hidden rounded-2xl border p-6 cursor-pointer transition-all duration-300 group",
                "hover:scale-[1.02] hover:-translate-y-1",
                active
                    ? "bg-gradient-to-br from-neutral-900 to-neutral-950 border-orange-500/50 shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]"
                    : "bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border-neutral-800 hover:border-neutral-700",
                "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)]"
            )}
        >
            {/* Gradient border glow effect */}
            {active && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-500/20 blur-xl -z-10" />
            )}

            {/* Hover spotlight effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(249,115,22,0.15), transparent 40%)`,
                }}
            />

            <div className="relative z-10">
                {icon && (
                    <div className={clsx(
                        "mb-4 transition-all duration-300",
                        active
                            ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                            : "text-neutral-500 group-hover:text-orange-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(249,115,22,0.3)]"
                    )}>
                        {icon}
                    </div>
                )}
                <h3 className={clsx(
                    "font-semibold text-lg mb-2 transition-colors",
                    active ? "text-orange-500" : "text-neutral-200 group-hover:text-white"
                )}>
                    {label}
                </h3>
                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    {description}
                </p>
            </div>

            {/* Active state overlay */}
            {active && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
            )}
        </div>
    );
}
