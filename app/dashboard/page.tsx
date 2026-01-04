
import Image from "next/image";
import Link from "next/link";
import { FileText, FileSpreadsheet, Plus } from "lucide-react";

import { InteractiveBarChart } from "@/components/dashboard/InteractiveBarChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { DocumentTable, Document } from "@/components/dashboard/DocumentTable";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function Dashboard({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Await searchParams in Next.js 15+ if needed, but for 13/14 it's direct. 
    // Assuming standard behavior for now. If Next.js 15, might need await. Package.json said next 16? 
    // Next 16 doesn't exist yet, it said "next": "16.0.10" in package.json... Wait.
    // Reviewing package.json from step 19: "next": "16.0.10". That must be a typo in the user workspace or a canary version? 
    // React 19 is also listed. This is likely a very new/canary build.
    // In Next 15+, searchParams is a Promise. I should await it.

    const params = await searchParams;
    const q = (params?.q as string) || "";
    const type = (params?.type as string) || "all";
    const dateFrom = (params?.dateFrom as string) || "";

    // Build Query
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
        // Filter: generated_at >= dateFrom 00:00 AND generated_at <= dateFrom 23:59:59
        // or just simple string matching if formatted? No, it's timestamp.
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

    // Execute Query
    const { data: documents, error } = await query;

    if (error) {
        console.error("Supabase Error:", error);
        // Handle error gracefully or throw
    }

    const docs = (documents || []) as Document[];

    // Compute Aggregates for UI
    const totalCount = docs.length;
    const totalValue = docs.reduce((sum, doc) => sum + Number(doc.amount || 0), 0);

    // Compute Chart Data (Group by "Day" from generated_at)
    // We'll show last 7 days or just the distribution of the current filtered set
    // prompt: "Charts should automatically respect: Selected document type, Date range filter"
    // So we just visualize the `docs` we fetched.
    // Grouping by Date (YYYY-MM-DD)
    const chartMap = new Map<string, number>();

    docs.forEach(doc => {
        const dateKey = new Date(doc.generated_at).toLocaleDateString('en-US', { weekday: 'short' });
        // Using weekday name for better visual if few days, or just date.
        // Let's use simplified date format for the chart keys.
        // If many docs, maybe date string.
        const d = new Date(doc.generated_at);
        const key = `${d.getMonth() + 1}/${d.getDate()}`;
        chartMap.set(key, (chartMap.get(key) || 0) + Number(doc.amount));
    });

    // Convert to array and sort? Or just take usage.
    // For a nice chart, we might want to fill in gaps or just show what's there.
    // Showing what's there is safest for "respecting filters".
    const chartData = Array.from(chartMap.entries()).map(([name, value]) => ({ name, value }));

    // If chartData is empty (no docs), maybe show empty state or defaults?
    // InteractiveBarChart handles empty array fine.

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

                {/* Page Title */}
                <h1 className="font-bold text-2xl sm:text-3xl tracking-tight">
                    Dashboard <span className="text-neutral-600 mx-2">/</span> <span className="text-orange-500 capitalize">{type}s</span>
                </h1>

                {/* Client Controls (Filters, Search, Date) */}
                <DashboardControls />

                {/* Analytics Section */}
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

                {/* Table */}
                <div>
                    <DocumentTable documents={docs} />
                </div>

            </main>
        </div>
    );
}
