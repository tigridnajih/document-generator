"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface DocumentDistributionChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ["#f97316", "#10b981", "#3b82f6"];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-3 rounded-lg shadow-xl shadow-black/50">
                <p className="text-neutral-400 text-xs mb-1 font-medium tracking-wide uppercase">{payload[0].name}</p>
                <p className="text-white font-bold font-mono text-lg">
                    {payload[0].value} Documents
                </p>
            </div>
        );
    }
    return null;
};

export function DocumentDistributionChart({ data, className }: DocumentDistributionChartProps & { className?: string }) {
    return (
        <div className={cn(
            "bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-500 flex flex-col h-full",
            className
        )}>
            <div className="space-y-0.5 mb-2">
                <h3 className="text-neutral-200 text-sm font-semibold tracking-tight">
                    Distribution
                </h3>
                <p className="text-neutral-500 text-[9px] uppercase tracking-wider font-medium">Type split</p>
            </div>

            <div className="flex flex-row items-center gap-6 flex-1">
                <div className="flex-1 h-[140px] min-w-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-3 min-w-[120px]">
                    {data.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between group/legend">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-[10px] text-neutral-400 font-medium capitalize group-hover/legend:text-neutral-200 transition-colors">{entry.name}s</span>
                            </div>
                            <span className="text-[10px] text-neutral-600 font-mono group-hover/legend:text-neutral-400 transition-colors">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
