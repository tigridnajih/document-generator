"use client";

import { Download, ExternalLink, FileText, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Document } from "./DocumentTable";

interface LatestDocumentCardProps {
    document?: Document;
    type: string;
    className?: string;
}

function getRelativeTime(dateString: string) {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 0) return "Just now";
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return then.toLocaleDateString("en-GB", { day: 'numeric', month: 'short' });
}

export function LatestDocumentCard({ document, type, className }: LatestDocumentCardProps) {
    if (!document) {
        return (
            <div className={cn(
                "bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2",
                className
            )}>
                <p className="text-neutral-500 text-sm font-medium italic">
                    No {type}s generated yet
                </p>
                <div className="w-8 h-[1px] bg-neutral-800" />
            </div>
        );
    }

    return (
        <div className={cn(
            "bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-5 relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-500",
            className
        )}>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -z-10 group-hover:bg-orange-500/10 transition-all" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                {/* Left: Info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                        <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-neutral-200 text-sm font-bold tracking-tight">Latest {type}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-[9px] font-mono text-neutral-400 uppercase">
                                {document.document_number}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-white font-medium truncate">{document.client_name}</span>
                            <span className="text-neutral-600 font-bold">•</span>
                            <span className="text-neutral-500 truncate">{document.client_company}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Data & Actions */}
                <div className="flex items-center gap-8 justify-between sm:justify-end flex-1">
                    <div className="flex flex-col items-end">
                        <span className="text-neutral-500 text-[9px] uppercase font-bold tracking-widest">Amount</span>
                        <span className="text-white font-mono font-bold text-lg">₹{Number(document.amount).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={document.download_url} target="_blank">
                            <button className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/5">
                                <Download className="w-3.5 h-3.5" />
                                Download
                            </button>
                        </Link>
                        {document.preview_url && (
                            <Link href={document.preview_url} target="_blank">
                                <button className="w-9 h-9 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center justify-center border border-neutral-700 transition-all" title="Preview">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom timestamp */}
            <div className="absolute bottom-2 right-5">
                <span className="text-neutral-600 text-[9px] font-mono uppercase tracking-tighter">
                    Generated {getRelativeTime(document.generated_at)}
                </span>
            </div>
        </div>
    );
}
