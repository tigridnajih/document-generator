"use client";

import { useMemo } from "react";
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
import { TimeRange } from "@/lib/mock-dashboard-data";
import { cn } from "@/lib/utils";

interface InteractiveBarChartProps {
    data: number[];
    timeRange: TimeRange;
    color: string;
}

export function InteractiveBarChart({ data, timeRange, color }: InteractiveBarChartProps) {
    // Generate labels based on time range
    const chartData = useMemo(() => {
        let labels: string[] = [];
        if (timeRange === "Daily") labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        else if (timeRange === "Weekly") labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        else if (timeRange === "Monthly") labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        else labels = ["2021", "2022", "2023", "2024"];

        return data.map((val, idx) => ({
            name: labels[idx] || `${idx + 1}`,
            value: val,
        }));
    }, [data, timeRange]);

    // Extract color class to hex for Recharts (simplified mapping)
    const hexColor = useMemo(() => {
        if (color.includes("blue")) return "#3b82f6";
        if (color.includes("emerald")) return "#10b981";
        if (color.includes("orange")) return "#f97316";
        return "#f97316"; // default
    }, [color]);

    return (
        <div className="w-full h-80 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all duration-500">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

            <h3 className="text-neutral-400 text-sm font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-current opacity-70" style={{ color: hexColor }} />
                Document Velocity
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#525252"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#525252"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        contentStyle={{
                            backgroundColor: "#171717",
                            borderColor: "#262626",
                            borderRadius: "8px",
                            color: "#fff",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        itemStyle={{ color: hexColor }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={hexColor} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
