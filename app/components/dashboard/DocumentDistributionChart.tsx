"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

export function DocumentDistributionChart({ data }: DocumentDistributionChartProps) {
    return (
        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-500 min-h-[300px] flex flex-col">
            <div className="space-y-1 mb-4">
                <h3 className="text-neutral-200 text-sm font-semibold tracking-tight">
                    Distribution
                </h3>
                <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-medium">Document type split</p>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
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

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] text-neutral-400 font-medium capitalize">{entry.name}s</span>
                        <span className="text-[10px] text-neutral-600 font-mono">{entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
