"use client";

import { Search, Calendar, X } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

export function DashboardSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const searchQuery = searchParams.get("q") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    const createQueryString = useCallback(
        (paramsToUpdate: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(paramsToUpdate).forEach(([name, value]) => {
                if (value) params.set(name, value);
                else params.delete(name);
            });
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (term: string) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ q: term })}`);
        });
    };

    const handleParamChange = (name: string, value: string) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ [name]: value })}`);
        });
    };

    const handleReset = () => {
        startTransition(() => {
            router.push(pathname);
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 pt-4 border-t border-neutral-800/50 relative">
            {/* Search Input */}
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 group-focus-within:text-orange-500 transition-colors duration-300" />
                <input
                    type="text"
                    placeholder="Search by client, company or ID..."
                    className="w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/60 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder:text-neutral-600 text-white shadow-sm hover:border-neutral-700 hover:bg-neutral-900/70"
                    defaultValue={searchQuery}
                    onChange={(e) => {
                        const value = e.target.value;
                        const handler = setTimeout(() => handleSearch(value), 300);
                        return () => clearTimeout(handler);
                    }}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                {/* Date From */}
                <div className="w-full sm:w-[180px] relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none group-focus-within:text-orange-500 transition-colors duration-300" />
                    <input
                        type="date"
                        defaultValue={dateFrom}
                        onChange={(e) => handleParamChange("dateFrom", e.target.value)}
                        className="w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/60 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all text-neutral-300 [color-scheme:dark] shadow-sm hover:border-neutral-700 hover:bg-neutral-900/70"
                    />
                    <span className="absolute -top-2 left-3 px-1 text-[9px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-950">From</span>
                </div>

                {/* Date To */}
                <div className="w-full sm:w-[180px] relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none group-focus-within:text-orange-500 transition-colors duration-300" />
                    <input
                        type="date"
                        defaultValue={dateTo}
                        onChange={(e) => handleParamChange("dateTo", e.target.value)}
                        className="w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/60 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all text-neutral-300 [color-scheme:dark] shadow-sm hover:border-neutral-700 hover:bg-neutral-900/70"
                    />
                    <span className="absolute -top-2 left-3 px-1 text-[9px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-950">To</span>
                </div>

                {/* Reset Button */}
                {(searchQuery || dateFrom || dateTo) && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-xl text-neutral-400 hover:text-white transition-all flex items-center gap-2 text-xs font-medium"
                    >
                        <X className="w-4 h-4" />
                        <span>Clear Filters</span>
                    </button>
                )}
            </div>

            {/* Optional Loading Indicator for Search/Date */}
            {isPending && (
                <div className="absolute -top-1 right-0 p-4 pointer-events-none">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
