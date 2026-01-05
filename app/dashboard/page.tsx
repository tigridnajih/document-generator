"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, FileSpreadsheet, Plus, AlertTriangle, FileCheck, LayoutGrid, TrendingUp, Banknote } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { InteractiveBarChart } from "@/components/dashboard/InteractiveBarChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { DocumentTable, Document } from "@/components/dashboard/DocumentTable";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { DocumentDistributionChart } from "@/components/dashboard/DocumentDistributionChart";
import { LatestDocumentCard } from "@/components/dashboard/LatestDocumentCard";
import { ClientInsights } from "@/components/dashboard/ClientInsights";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const range = searchParams.get("range") || "month";

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);

            try {
                let query = supabase
                    .from("documents")
                    .select("*")
                    .order("generated_at", { ascending: false });

                const now = new Date();
                let analyticsStart = new Date();
                if (range === "day") analyticsStart.setDate(now.getDate() - 1);
                else if (range === "week") analyticsStart.setDate(now.getDate() - 14);
                else if (range === "month") analyticsStart.setMonth(now.getMonth() - 2);
                else if (range === "year") analyticsStart.setFullYear(now.getFullYear() - 2);

                let fetchStart = analyticsStart;
                if (dateFrom) {
                    const df = new Date(dateFrom);
                    if (df < fetchStart) fetchStart = df;
                }

                query = query.gte("generated_at", fetchStart.toISOString());

                if (dateTo) {
                    const dt = new Date(dateTo);
                    dt.setHours(23, 59, 59, 999);
                    // Fetch up to dateTo, but at least up to now for analytics
                    if (dt > now) {
                        query = query.lte("generated_at", dt.toISOString());
                    }
                }

                // Filter by Search Term (Client Name, Company, Number)
                if (q) {
                    query = query.or(`client_name.ilike.%${q}%,client_company.ilike.%${q}%,document_number.ilike.%${q}%`);
                }

                const { data, error } = await query;

                if (error) throw error;

                setDocuments((data as Document[]) ?? []);
            } catch (err: any) {
                console.error("Supabase Error:", err);
                setError(err.message || "Failed to load documents");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [q, range, dateFrom, dateTo]);

    // 1. Identify Current vs Previous Periods
    const periods = useMemo(() => {
        const now = new Date();
        let currentStart = new Date();
        if (range === "day") currentStart.setHours(0, 0, 0, 0);
        else if (range === "week") currentStart.setDate(now.getDate() - 7);
        else if (range === "month") currentStart.setMonth(now.getMonth() - 1);
        else if (range === "year") currentStart.setFullYear(now.getFullYear() - 1);

        const labelMap = { day: "yesterday", week: "last week", month: "last month", year: "last year" };
        return { currentStart, label: `vs ${labelMap[range as keyof typeof labelMap] || 'last period'}` };
    }, [range]);

    const currentDocs = useMemo(() => documents.filter(d => new Date(d.generated_at) >= periods.currentStart), [documents, periods]);
    const previousDocs = useMemo(() => {
        const now = new Date();
        let limit = new Date(periods.currentStart);
        if (range === "day") limit.setDate(limit.getDate() - 1);
        else if (range === "week") limit.setDate(limit.getDate() - 7);
        else if (range === "month") limit.setMonth(limit.getMonth() - 1);
        else if (range === "year") limit.setFullYear(limit.getFullYear() - 1);

        return documents.filter(d => {
            const date = new Date(d.generated_at);
            return date < periods.currentStart && date >= limit;
        });
    }, [documents, periods, range]);

    // 2. Filter documents for the table (Visible Documents) vs Analytics
    const visibleDocuments = useMemo(() => {
        let filtered = documents;

        // Custom Date Filtering (Table Only)
        if (dateFrom || dateTo) {
            filtered = filtered.filter(doc => {
                const date = new Date(doc.generated_at);
                if (dateFrom && date < new Date(dateFrom)) return false;
                if (dateTo) {
                    const end = new Date(dateTo);
                    end.setHours(23, 59, 59, 999);
                    if (date > end) return false;
                }
                return true;
            });
        } else {
            // Default: Table follows current range
            filtered = currentDocs;
        }

        // Type Filter
        if (type !== "all") {
            filtered = filtered.filter(doc => doc.document_type === type);
        }

        return filtered;
    }, [documents, currentDocs, type, dateFrom, dateTo]);

    const analyticsDocs = useMemo(() => {
        if (type === "all") return currentDocs;
        return currentDocs.filter(doc => doc.document_type === type);
    }, [currentDocs, type]);

    const latestDoc = useMemo(() => {
        if (type === "all") return undefined;
        const typeDocs = documents.filter(d => d.document_type === type);
        return typeDocs[0];
    }, [documents, type]);

    const previousVisibleDocuments = useMemo(() => {
        if (type === "all") return previousDocs;
        return previousDocs.filter(doc => doc.document_type === type);
    }, [previousDocs, type]);

    // 3. Compute Aggregates & Trends
    const stats = useMemo(() => {
        const calculate = (docs: Document[]) => {
            const count = docs.length;
            const amount = docs.reduce((sum, doc) => sum + Number(doc.amount || 0), 0);
            const average = count > 0 ? amount / count : 0;
            return { count, amount, average };
        };

        const current = calculate(analyticsDocs);
        const previous = calculate(previousVisibleDocuments);

        const getTrend = (curr: number, prev: number) => {
            if (prev === 0) return { value: curr > 0 ? "+100%" : "0%", type: "neutral" as const };
            const diff = ((curr - prev) / prev) * 100;
            const sign = diff >= 0 ? "+" : "";
            return {
                value: `${sign}${diff.toFixed(1)}% ${periods.label}`,
                type: (diff > 0 ? "up" : diff < 0 ? "down" : "neutral") as "up" | "down" | "neutral"
            };
        };

        return {
            count: current.count,
            amount: current.amount,
            average: current.average,
            trends: {
                count: getTrend(current.count, previous.count),
                amount: getTrend(current.amount, previous.amount),
                average: getTrend(current.average, previous.average)
            }
        };
    }, [visibleDocuments, previousVisibleDocuments, periods]);

    // 3. Compute Chart Data
    const chartData = useMemo(() => {
        const chartMap = new Map<string, number>();
        currentDocs.forEach(doc => {
            if (type !== "all" && doc.document_type !== type) return;
            const d = new Date(doc.generated_at);
            const key = `${d.getMonth() + 1}/${d.getDate()}`;
            const val = type === "all" ? 1 : Number(doc.amount || 0);
            chartMap.set(key, (chartMap.get(key) || 0) + val);
        });
        return Array.from(chartMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => {
                const [am, ad] = a.name.split('/').map(Number);
                const [bm, bd] = b.name.split('/').map(Number);
                return am !== bm ? am - bm : ad - bd;
            })
            .slice(-14);
    }, [currentDocs, type]);

    // 4. Compute Distribution (for Pie Chart)
    const distributionData = useMemo(() => {
        const counts = { invoice: 0, quotation: 0, proposal: 0 };
        currentDocs.forEach(doc => {
            const t = doc.document_type.toLowerCase() as keyof typeof counts;
            if (counts[t] !== undefined) counts[t]++;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [currentDocs]);

    // 5. Compute Client Insights
    const clientInsightsData = useMemo(() => {
        const clientMap = new Map<string, number>();
        currentDocs.forEach(doc => {
            const name = doc.client_name || "Unknown Client";
            clientMap.set(name, (clientMap.get(name) || 0) + 1);
        });

        const sortedClients = Array.from(clientMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        const totalDocs = currentDocs.length;
        const topClientCount = sortedClients[0]?.count || 0;
        const concentration = totalDocs > 0 ? Math.round((topClientCount / totalDocs) * 100) : 0;

        const repeat = sortedClients.filter(c => c.count >= 2).length;
        const oneTime = sortedClients.filter(c => c.count === 1).length;

        return {
            topClients: sortedClients.slice(0, 5),
            concentration,
            repeatRate: { repeat, oneTime }
        };
    }, [currentDocs]);


    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-neutral-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
                <h1 className="text-2xl font-bold text-white">Data Fetch Error</h1>
                <p className="text-neutral-400">{error}</p>
                <Link href="/">
                    <button className="px-6 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:bg-neutral-800 transition-colors">
                        Go Back Home
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500/30 overflow-hidden relative">
            {/* Background Mesh Gradient */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-neutral-900/30 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-neutral-900/10 rounded-full blur-[100px] opacity-20" />
                <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] opacity-30 animate-pulse" />
            </div>

            <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 supports-[backdrop-filter]:bg-neutral-950/40">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/logo.png"
                                    alt="Tigrid Logo"
                                    width={120}
                                    height={32}
                                    className="h-8 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    <Link href="/">
                        <button className="flex items-center gap-2 text-sm font-medium text-neutral-950 bg-white hover:bg-neutral-200 transition-all px-5 py-2.5 rounded-full shadow-lg shadow-white/5 active:scale-95 duration-200">
                            <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                            <span>New Document</span>
                        </button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 pb-6 border-b border-neutral-800/40">
                    <h1 className="font-bold text-3xl sm:text-4xl tracking-tighter text-white">
                        Dashboard <span className="text-neutral-700 font-light mx-2">/</span> <span className="text-neutral-400 font-medium capitalize">{type === 'all' ? 'Overview' : type + 's'}</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Time Range Filter */}
                        <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800/60 transition-all">
                            {(["day", "week", "month", "year"] as const).map((r) => (
                                <Link
                                    key={r}
                                    href={`?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), range: r }).toString()}`}
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                                        range === r
                                            ? "bg-neutral-800 text-white shadow-sm"
                                            : "text-neutral-500 hover:text-neutral-300"
                                    )}
                                >
                                    {r}
                                </Link>
                            ))}
                        </div>
                        <DashboardControls />
                    </div>
                </div>

                {/* Analytics Grid */}
                {type === "all" ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <InteractiveBarChart
                                    data={chartData}
                                    label="Document Volume"
                                    yAxisFormatter={(val) => val.toString()}
                                    tooltipFormatter={(val) => `${val} Documents`}
                                />
                            </div>
                            <div className="flex flex-col gap-6 h-[400px]">
                                <StatCard
                                    label="Total Documents"
                                    value={stats.count}
                                    icon={LayoutGrid}
                                    trend={stats.trends.count.value}
                                    trendType={stats.trends.count.type}
                                    className="h-fit"
                                />
                                <div className="flex-1">
                                    <DocumentDistributionChart data={distributionData} className="h-full" />
                                </div>
                            </div>
                        </div>

                        <ClientInsights
                            topClients={clientInsightsData.topClients}
                            concentration={clientInsightsData.concentration}
                            repeatRate={clientInsightsData.repeatRate}
                            className="w-full"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <InteractiveBarChart
                                data={chartData}
                                label={`${type.charAt(0).toUpperCase() + type.slice(1)} Performance`}
                                className="h-[400px]"
                            />
                            <LatestDocumentCard
                                document={latestDoc}
                                type={type}
                                className="h-fit"
                            />
                        </div>

                        <div className="flex flex-col gap-6">
                            <StatCard
                                label="Total Documents"
                                value={stats.count}
                                icon={FileText}
                                trend={stats.trends.count.value}
                                trendType={stats.trends.count.type}
                                className="flex-1"
                            />
                            <StatCard
                                label="Total Amount"
                                value={`₹${stats.amount.toLocaleString()}`}
                                icon={Banknote}
                                trend={stats.trends.amount.value}
                                trendType={stats.trends.amount.type}
                                className="flex-1"
                            />
                            <StatCard
                                label="Average Value"
                                value={`₹${stats.average.toLocaleString()}`}
                                icon={TrendingUp}
                                trend={stats.trends.average.value}
                                trendType={stats.trends.average.type}
                                className="flex-1"
                            />
                        </div>
                    </div>
                )}

                {/* Search & Date Controls */}
                <div className="space-y-6">
                    <DashboardSearch />
                    {/* Table */}
                    <DocumentTable
                        documents={visibleDocuments}
                        showAmount={type !== "all"}
                    />
                </div>
            </main>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-neutral-400">Loading dashboard...</p>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
