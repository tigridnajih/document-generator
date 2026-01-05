"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { cn } from "@/lib/utils";

interface InteractiveBarChartProps {
    data: { name: string; value: number }[];
    label?: string;
    yAxisFormatter?: (value: number) => string;
    tooltipFormatter?: (value: number) => string;
    className?: string;
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-3 rounded-lg shadow-xl shadow-black/50">
                <p className="text-neutral-400 text-xs mb-1 font-medium tracking-wide uppercase">{label}</p>
                <p className="text-white font-bold font-mono text-lg">
                    {formatter ? formatter(payload[0].value) : `₹${Number(payload[0].value).toLocaleString()}`}
                </p>
            </div>
        );
    }
    return null;
};

export function InteractiveBarChart({
    data,
    label = "Document Velocity",
    yAxisFormatter = (value) => `₹${value >= 1000 ? `${value / 1000}k` : value}`,
    tooltipFormatter,
    className
}: InteractiveBarChartProps) {
    return (
        <div className={cn(
            "w-full h-[400px] bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-500 flex flex-col",
            className
        )}>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="space-y-1">
                    <h3 className="text-neutral-200 text-lg font-semibold tracking-tight">
                        {label}
                    </h3>
                    <p className="text-neutral-500 text-xs uppercase tracking-wider font-medium">Last 30 Days Activity</p>
                </div>
                {/* Optional: Add a subtle action or indicator here */}
            </div>

            <div className="w-full flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#f97316" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="barHover" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                                <stop offset="100%" stopColor="#f97316" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} opacity={0.4} />
                        <XAxis
                            dataKey="name"
                            stroke="#525252"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={20}
                        />
                        <YAxis
                            stroke="#525252"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={yAxisFormatter}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.02)" }}
                            content={<CustomTooltip formatter={tooltipFormatter} />}
                        />
                        <Bar
                            dataKey="value"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                            maxBarSize={60}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill="url(#barGradient)"
                                    className="dark:[transition:fill_0.3s] hover:fill-[url(#barHover)]"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
