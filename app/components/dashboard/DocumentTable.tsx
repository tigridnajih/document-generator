"use strict";

import { Download, ExternalLink, FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";

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

const COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500",
    "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500",
    "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
    "bg-pink-500", "bg-rose-500"
];

function getAvatarColor(name: string) {
    // Consistent color based on name length/char code to avoid hydration mismatches if random
    // For now, just a fixed color or simple deterministic logic
    return "bg-orange-500";
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

interface DocumentTableProps {
    documents: Document[];
}

export function DocumentTable({ documents }: DocumentTableProps) {
    if (documents.length === 0) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center text-neutral-500 space-y-4 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20">
                <FileText className="w-8 h-8 opacity-20" />
                <p>No documents found matching your filters</p>
            </div>
        );
    }

    return (
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-900/80 border-b border-neutral-800 text-neutral-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">Document Type</th>
                            <th className="px-6 py-4">Number</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="group hover:bg-neutral-800/50 transition-all hover:scale-[1.01] hover:shadow-lg border-b border-neutral-800/50 hover:border-transparent cursor-default">
                                <td className="px-6 py-4">
                                    <span className="capitalize text-neutral-300 bg-neutral-800 px-2 py-1 rounded text-xs border border-neutral-700">
                                        {doc.document_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-white font-mono text-xs">
                                    {doc.document_number}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${getAvatarColor(doc.client_name)}`}>
                                            {getInitials(doc.client_name)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-neutral-200 font-medium">{doc.client_name}</span>
                                            <span className="text-xs text-neutral-500">{doc.client_company}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-neutral-400 text-xs">
                                    {new Date(doc.generated_at).toLocaleDateString("en-GB", {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-neutral-400 text-xs font-mono">
                                    {new Date(doc.generated_at).toLocaleTimeString("en-US", {
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-neutral-300 font-mono">
                                    ${Number(doc.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Link href={doc.download_url} target="_blank" rel="noopener noreferrer">
                                            <button className="p-2 hover:bg-neutral-700/50 rounded-lg text-neutral-400 hover:text-white transition-colors" title="Download PDF">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        {doc.preview_url ? (
                                            <Link href={doc.preview_url} target="_blank" rel="noopener noreferrer">
                                                <button className="p-2 hover:bg-neutral-700/50 rounded-lg text-neutral-400 hover:text-white transition-colors" title="Preview">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        ) : (
                                            <button className="p-2 text-neutral-600 cursor-not-allowed" title="No Preview Available" disabled>
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
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
