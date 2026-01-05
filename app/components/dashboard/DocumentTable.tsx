"use strict";

import { Download, ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Document {
    id: string;
    document_type: string;
    document_number: string;
    client_name: string;
    client_company: string;
    amount: number;
    download_url: string;
    preview_url: string | null;
    generated_at: string;
}

function getAvatarColor(name: string) {
    return "bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600";
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function getTypeStyle(type: string) {
    if (type === 'invoice') return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (type === 'proposal') return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (type === 'quotation') return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    return "bg-neutral-800 text-neutral-400 border-neutral-700";
}

interface DocumentTableProps {
    documents: Document[];
    showAmount?: boolean;
}

export function DocumentTable({ documents, showAmount = true }: DocumentTableProps) {
    if (documents.length === 0) {
        return (
            <div className="w-full py-32 flex flex-col items-center justify-center text-neutral-500 space-y-6 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
                <div className="p-4 rounded-full bg-neutral-900 shadow-sm border border-neutral-800">
                    <FileText className="w-8 h-8 opacity-20" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium text-neutral-300">No documents found</p>
                    <p className="text-sm text-neutral-600">Adjust filters to see results</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-neutral-800/60 rounded-2xl overflow-hidden bg-neutral-900/20 backdrop-blur-sm shadow-2xl shadow-black/20">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-900/90 border-b border-neutral-800 text-neutral-500 font-semibold text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Number</th>
                            <th className="px-6 py-4 font-medium">Client</th>
                            <th className="px-6 py-4 font-medium">Date Issued</th>
                            {showAmount && <th className="px-6 py-4 font-medium text-right">Amount</th>}
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/40">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="group hover:bg-neutral-800/30 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-medium border uppercase tracking-wide", getTypeStyle(doc.document_type))}>
                                        {doc.document_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-neutral-300 font-mono text-xs whitespace-nowrap">
                                    {doc.document_number}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-300 shadow-sm", getAvatarColor(doc.client_name))}>
                                            {getInitials(doc.client_name)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-neutral-200 font-medium text-sm">{doc.client_name}</span>
                                            <span className="text-[11px] text-neutral-500">{doc.client_company}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-neutral-400 text-xs whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-neutral-300">
                                            {new Date(doc.generated_at).toLocaleDateString("en-GB", {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                        <span className="text-[10px] text-neutral-600 font-mono">
                                            {new Date(doc.generated_at).toLocaleTimeString("en-US", {
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </td>
                                {showAmount && (
                                    <td className="px-6 py-4 text-white font-medium font-mono text-right whitespace-nowrap tabular-nums">
                                        ${Number(doc.amount).toLocaleString()}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link href={doc.download_url} target="_blank" rel="noopener noreferrer">
                                            <button className="p-2 hover:bg-neutral-700/50 rounded-lg text-neutral-500 hover:text-white transition-colors" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        {doc.preview_url && (
                                            <Link href={doc.preview_url} target="_blank" rel="noopener noreferrer">
                                                <button className="p-2 hover:bg-neutral-700/50 rounded-lg text-neutral-500 hover:text-white transition-colors" title="Open Preview">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
