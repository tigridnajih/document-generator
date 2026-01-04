"use strict";

import { Download, ExternalLink, FileText } from "lucide-react";
import { DashboardDocument } from "@/lib/mock-dashboard-data";
import { StatusBadge } from "./StatusBadge";

const COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500",
    "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500",
    "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
    "bg-pink-500", "bg-rose-500"
];

function getAvatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
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
    documents: DashboardDocument[];
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
                            <th className="px-6 py-4">Document ID</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="group hover:bg-neutral-800/50 transition-all hover:scale-[1.01] hover:shadow-lg border-b border-neutral-800/50 hover:border-transparent cursor-default">
                                <td className="px-6 py-4 font-medium text-white font-mono text-xs">
                                    {doc.number}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${getAvatarColor(doc.clientName)}`}>
                                            {getInitials(doc.clientName)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-neutral-200 font-medium">{doc.clientName}</span>
                                            <span className="text-xs text-neutral-500">{doc.clientCompany}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-neutral-400">
                                    {new Date(doc.createdDate).toLocaleDateString("en-GB", {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-neutral-300 font-mono">
                                    ${doc.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-neutral-700/50 rounded-lg text-neutral-400 hover:text-white transition-colors" title="Download PDF">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-neutral-700/50 rounded-lg text-neutral-400 hover:text-white transition-colors" title="Open in Drive">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
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
