"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, FileSpreadsheet, Plus, AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { InteractiveBarChart } from "@/components/dashboard/InteractiveBarChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { DocumentTable, Document } from "@/components/dashboard/DocumentTable";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { supabase } from "@/lib/supabase";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const q = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";
    const dateFrom = searchParams.get("dateFrom") || "";

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);

            try {
                let query = supabase
                    .from("documents")
                    .select("*")
                    .order("generated_at", { ascending: false });

                // Filter by Type
                if (type && type !== "all") {
                    query = query.eq("document_type", type);
                }

                // Filter by Date (Single Date Match)
                if (dateFrom) {
                    const startDate = new Date(dateFrom);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(dateFrom);
                    endDate.setHours(23, 59, 59, 999);

                    query = query.gte("generated_at", startDate.toISOString()).lte("generated_at", endDate.toISOString());
                }

                // Filter by Search Term (Client Name, Company, Number)
                if (q) {
                    query = query.or(`client_name.ilike.%${q}%,client_company.ilike.%${q}%,document_number.ilike.%${q}%`);
                }

                const { data, error } = await query;

                if (error) {
                    throw error;
                }

                setDocuments((data as Document[]) ?? []);
            } catch (err: any) {
                console.error("Supabase Error:", err);
                setError(err.message || "Failed to load documents");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [q, type, dateFrom]);

    // Compute Aggregates for UI
    const totalCount = documents.length;
    const totalValue = documents.reduce((sum, doc) => sum + Number(doc.amount || 0), 0);

    // Compute Chart Data using useMemo
    const chartData = useMemo(() => {
        const chartMap = new Map<string, number>();
        documents.forEach(doc => {
            const d = new Date(doc.generated_at);
            const key = `${d.getMonth() + 1}/${d.getDate()}`;
            chartMap.set(key, (chartMap.get(key) || 0) + Number(doc.amount));
        });
        return Array.from(chartMap.entries()).map(([name, value]) => ({ name, value }));
    }, [documents]);


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
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-xl tracking-tighter shadow-lg shadow-white/10 group-hover:scale-105 transition-transform duration-300">
                                    T
                                </div>
                                <span className="font-bold text-lg tracking-tight text-neutral-200 group-hover:text-white transition-colors">Tigrid</span>
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
                    {/* Type Filters moved to align with title or just below suitable for layout */}
                    <div className="self-start sm:self-auto">
                        <DashboardControls />
                    </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <InteractiveBarChart
                            data={chartData}
                            label={`Document Velocity (${type})`}
                        />
                    </div>
                    <div className="space-y-6 flex flex-col justify-between h-full">
                        <StatCard
                            label="Total Documents"
                            value={totalCount}
                            icon={FileText}
                            trend="+12% vs last month"
                        />
                        <StatCard
                            label="Total Value"
                            value={`$${totalValue.toLocaleString()}`}
                            icon={FileSpreadsheet}
                            trend="+8.5% vs last month"
                        />
                    </div>
                </div>

                {/* Search & Date Controls (Moved below Graph) */}
                <div className="space-y-6">
                    <DashboardSearch />
                    {/* Table */}
                    <DocumentTable documents={documents} />
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
