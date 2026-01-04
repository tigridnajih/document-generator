"use client";

import { Search, Calendar } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

export function DashboardSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const searchQuery = searchParams.get("q") || "";
    const dateFrom = searchParams.get("dateFrom") || "";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (term: string) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("q", term)}`);
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("dateFrom", e.target.value)}`);
        });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-800/50">
            {/* Search Input */}
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-orange-500 transition-colors duration-300" />
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

            {/* Date Filter */}
            <div className="w-full sm:w-auto sm:min-w-[200px] relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none group-focus-within:text-orange-500 transition-colors duration-300" />
                <input
                    type="date"
                    defaultValue={dateFrom}
                    onChange={handleDateChange}
                    className="w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/60 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all text-neutral-300 [color-scheme:dark] shadow-sm hover:border-neutral-700 hover:bg-neutral-900/70"
                />
            </div>

            {/* Optional Loading Indicator for Search/Date */}
            {isPending && (
                <div className="absolute top-0 right-0 p-4 pointer-events-none">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
