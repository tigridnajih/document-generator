"use strict";

import { useMemo } from "react";
import { TimeRange } from "@/lib/mock-dashboard-data";

interface AnalyticsChartProps {
    data: number[];
    timeRange: TimeRange;
    color: string;
}

export function AnalyticsChart({ data, timeRange, color }: AnalyticsChartProps) {
    const maxVal = Math.max(...data, 1);

    // Generate labels based on time range
    const labels = useMemo(() => {
        if (timeRange === "Daily") return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        if (timeRange === "Weekly") return ["Week 1", "Week 2", "Week 3", "Week 4"];
        if (timeRange === "Monthly") return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]; // truncated for demo
        return ["2021", "2022", "2023", "2024"];
    }, [timeRange]);

    return (
        <div className="w-full h-64 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col justify-end relative overflow-hidden">

            {/* Grid lines */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-20">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-px bg-neutral-500" />
                ))}
            </div>

            <div className="relative z-10 flex items-end justify-between gap-2 h-40 w-full px-2">
                {data.map((val, idx) => {
                    // Normalize height (min 10% for visibility)
                    const heightPct = Math.max((val / maxVal) * 100, 10);

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                            {/* Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 pointer-events-none">
                                {val} docs
                            </div>

                            {/* Bar */}
                            <div
                                className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out hover:brightness-125 ${color}`}
                                style={{ height: `${heightPct}%` }}
                            />

                            {/* Label */}
                            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                                {labels[idx] || idx + 1}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
