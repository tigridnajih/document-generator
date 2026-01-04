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
                        <span className="font-bold text-xl tracking-tight sm:hidden">Tigrid</span>
                    </div>

                    <Link href="/">
                        <button className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-orange-500/50 hover:border-orange-500 px-4 py-2 rounded-full whitespace-nowrap shadow-[0_0_10px_-3px_rgba(249,115,22,0.3)]">
                            <Plus className="w-4 h-4 shrink-0" />
                            <span>Document Generator</span>
                        </button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
                <h1 className="font-bold text-2xl sm:text-3xl tracking-tight">
                    Dashboard <span className="text-neutral-600 mx-2">/</span> <span className="text-orange-500 capitalize">{type === 'all' ? 'All' : type + 's'}</span>
                </h1>

                {/* Type Filters */}
                <DashboardControls />

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <InteractiveBarChart
                            data={chartData}
                            label={`Total Amount (${type})`}
                        />
                    </div>
                    <div className="space-y-4">
                        <StatCard
                            label="Total Documents"
                            value={totalCount}
                            icon={FileText}
                            trend="Based on current filters"
                        />
                        <StatCard
                            label="Total Value"
                            value={`$${totalValue.toLocaleString()}`}
                            icon={FileSpreadsheet}
                            trend="Based on current filters"
                        />
                    </div>
                </div>

                {/* Search & Date Controls (Moved below Graph) */}
                <DashboardSearch />

                {/* Table */}
                <div>
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
