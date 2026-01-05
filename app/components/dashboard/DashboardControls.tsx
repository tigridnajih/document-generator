"use client";

import { FileText, FileCheck, FileSpreadsheet, LayoutGrid } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";

type DocumentType = "all" | "proposal" | "quotation" | "invoice";

export function DashboardControls() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const currentType = (searchParams.get("type") as DocumentType) || "all";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleTypeChange = (type: DocumentType) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("type", type)}`);
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex space-x-1 bg-neutral-900/50 p-1.5 rounded-xl border border-neutral-800/60 backdrop-blur-sm self-start overflow-hidden">
                    {(["all", "proposal", "quotation", "invoice"] as DocumentType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={cn(
                                "px-4 sm:px-6 py-2 text-sm font-medium rounded-lg transition-all capitalize flex items-center gap-2 whitespace-nowrap outline-none focus:ring-2 focus:ring-orange-500/20",
                                currentType === type
                                    ? "bg-neutral-800 text-white shadow-sm ring-1 ring-white/5"
                                    : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                            )}
                        >
                            {type === "all" && <LayoutGrid className="w-4 h-4" />}
                            {type === "proposal" && <FileText className="w-4 h-4" />}
                            {type === "quotation" && <FileCheck className="w-4 h-4" />}
                            {type === "invoice" && <FileSpreadsheet className="w-4 h-4" />}
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {isPending && (
                <div className="absolute top-0 right-0 p-4 pointer-events-none">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
