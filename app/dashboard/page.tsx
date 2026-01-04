"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Calendar, FileText, FileCheck, FileSpreadsheet, Plus, ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { ShineButton } from "@/components/ui/ShineButton";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { DocumentTable } from "@/components/dashboard/DocumentTable";
import { MOCK_CHART_DATA, MOCK_DOCUMENTS, DocumentType, TimeRange } from "@/lib/mock-dashboard-data";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<DocumentType>("proposal");
    const [timeRange, setTimeRange] = useState<TimeRange>("Weekly");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter documents based on active tab and search query
    const filteredDocuments = useMemo(() => {
        return MOCK_DOCUMENTS.filter((doc) => {
            const matchesType = doc.type === activeTab;
            const matchesSearch =
                searchQuery === "" ||
                doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.number.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesType && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    // Calculate stats
    const totalCount = filteredDocuments.length;
    const totalValue = filteredDocuments.reduce((sum, doc) => sum + doc.amount, 0);

    // Get chart data
    const chartData = MOCK_CHART_DATA[timeRange][activeTab];

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-xl tracking-tight">
                        Dashboard <span className="text-neutral-600 mx-2">/</span> <span className="text-orange-500 capitalize">{activeTab}s</span>
                    </h1>

                    <Link href="/">
                        <button className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2 rounded-full">
                            <Plus className="w-4 h-4" />
                            <span>New Document</span>
                        </button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

                {/* Top Controls: Tabs & Time Range */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Tabs */}
                    <div className="flex p-1 bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden self-start">
                        {(["proposal", "quotation", "invoice"] as DocumentType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={cn(
                                    "px-6 py-2.5 text-sm font-medium rounded-lg transition-all capitalize flex items-center gap-2",
                                    activeTab === type
                                        ? "bg-neutral-800 text-white shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                                )}
                            >
                                {type === "proposal" && <FileText className="w-4 h-4" />}
                                {type === "quotation" && <FileCheck className="w-4 h-4" />}
                                {type === "invoice" && <FileSpreadsheet className="w-4 h-4" />}
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Time Range */}
                    <div className="flex items-center gap-2 bg-neutral-900/30 border border-neutral-800 p-1 rounded-lg self-start">
                        {(["Daily", "Weekly", "Monthly", "Yearly"] as TimeRange[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                    timeRange === range
                                        ? "bg-neutral-800 text-white"
                                        : "text-neutral-500 hover:text-neutral-300"
                                )}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <AnalyticsChart
                            data={chartData}
                            timeRange={timeRange}
                            color={activeTab === "proposal" ? "bg-blue-500" : activeTab === "quotation" ? "bg-emerald-500" : "bg-orange-500"}
                        />
                    </div>
                    <div className="space-y-4">
                        <StatCard
                            label="Total Documents"
                            value={totalCount}
                            icon={FileText}
                            trend="+12% vs last period"
                        />
                        <StatCard
                            label="Total Value"
                            value={`$${totalValue.toLocaleString()}`}
                            icon={FileSpreadsheet}
                            trend="+5.4%"
                        />
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search by client, company or ID..."
                            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder:text-neutral-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Date filter placeholder - keeping it simple for now as requested */}
                    <div className="hidden sm:block w-48 relative opacity-50 cursor-not-allowed">
                        <input disabled type="date" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500" />
                    </div>
                </div>

                {/* Table */}
                <DocumentTable documents={filteredDocuments} />

            </main>
        </div>
    );
}

// Simple icon wrapper for stats
