"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Calendar, FileText, FileCheck, FileSpreadsheet, Plus, ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { ShineButton } from "@/components/ui/ShineButton";
import { InteractiveBarChart } from "@/components/dashboard/InteractiveBarChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { DocumentTable } from "@/components/dashboard/DocumentTable";
import { motion } from "framer-motion";
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
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30 overflow-hidden relative">
            {/* Background Mesh Gradient */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] opacity-50 animate-pulse" />
                <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
            </div>

            <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo.png"
                            alt="Tigrid"
                            width={100}
                            height={24}
                            priority
                            className="hidden sm:block"
                        />
                        <Image
                            src="/logo.png"
                            alt="Tigrid"
                            width={80}
                            height={20}
                            priority
                            className="block sm:hidden"
                        />
                        <div className="h-6 w-px bg-neutral-800 mx-2 hidden sm:block" />
                        <h1 className="font-bold text-lg tracking-tight hidden sm:block">
                            Dashboard <span className="text-neutral-600 mx-2">/</span> <span className="text-orange-500 capitalize">{activeTab}s</span>
                        </h1>
                    </div>

                    <Link href="/">
                        <button className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-orange-500/50 hover:border-orange-500 px-4 py-2 rounded-full whitespace-nowrap shadow-[0_0_10px_-3px_rgba(249,115,22,0.3)]">
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>New Document</span>
                        </button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

                {/* Top Controls: Tabs & Time Range */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Tabs */}
                    <div className="flex p-1 bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-x-auto self-start max-w-full no-scrollbar">
                        {(["proposal", "quotation", "invoice"] as DocumentType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={cn(
                                    "px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-all capitalize flex items-center gap-2 whitespace-nowrap",
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-3"
                    >
                        <InteractiveBarChart
                            data={chartData}
                            timeRange={timeRange}
                            color="bg-orange-500"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-4"
                    >
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
                    </motion.div>
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
                    {/* Date filter - now visible on mobile */}
                    <div className="w-full sm:w-48 relative opacity-50 cursor-not-allowed">
                        <input disabled type="date" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500" />
                    </div>
                </div>

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <DocumentTable documents={filteredDocuments} />
                </motion.div>

            </main>
        </div>
    );
}

// Simple icon wrapper for stats
