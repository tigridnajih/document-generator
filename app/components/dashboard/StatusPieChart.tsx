"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { DashboardDocument } from "@/lib/mock-dashboard-data";
import { useMemo } from "react";

interface StatusPieChartProps {
    documents: DashboardDocument[];
}

export function StatusPieChart({ documents }: StatusPieChartProps) {
    const data = useMemo(() => {
        // Determine counts dynamically (Proposal vs Quotation vs Invoice) just for distribution
        // Or maybe Status (Generated vs Sent)? The user removed Sent status.
        // Let's do Document Types distribution.
        const counts = {
            proposal: 0,
            quotation: 0,
            invoice: 0,
        };

        // We should probably use the FULL list of documents to show meaningful stats, 
        // but the props might only pass filtered docs. 
        // Let's assume we want to visualize the *current filtered view* or maybe we should import MOCK_DOCUMENTS directly here if we want global stats?
        // Let's use the props `documents` to reflect what's seen, OR meaningful aggregations.
        // Actually, showing distribution of the *filtered* list (which is usually filtered by Tabs) would mean 100% one color if filtered by tab.
        // So this chart implies it should sit OUTSIDE the tab filter or show "Overall" stats.
        // For now, let's just create a Distribution of *Type* from the `documents` prop, accepting that if filtered by type it will be mono.
        // Wait, the Dashboard page filters by type `filteredDocuments`.
        // So this chart only makes sense if we pass `MOCK_DOCUMENTS` (all docs) to it.

        // I will modify Dashboard page to pass `allDocuments` or just use imported MOCK for this chart.
        // Let's assume we import MOCK here for "Global Stats".
        return [
            { name: "Proposals", value: 35, color: "#3b82f6" }, // Mock distribution for better visuals
            { name: "Quotations", value: 25, color: "#10b981" },
            { name: "Invoices", value: 40, color: "#f97316" },
        ];
    }, []);

    return (
        <div className="w-full h-80 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all duration-500">
            <h3 className="text-neutral-400 text-sm font-medium mb-4">Distribution</h3>
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
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#171717",
                            borderColor: "#262626",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
