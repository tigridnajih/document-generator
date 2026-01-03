"use strict";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string; // e.g., "+12.5%"
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-sm text-neutral-400">{label}</p>
                <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
                {trend && (
                    <p className="text-xs text-green-400 font-mono">{trend}</p>
                )}
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg text-neutral-300">
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
}
