"use strict";

import { Download, ExternalLink, FileText } from "lucide-react";
import { DashboardDocument } from "@/lib/mock-dashboard-data";
import { StatusBadge } from "./StatusBadge";

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
                            <tr key={doc.id} className="group hover:bg-neutral-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-white font-mono text-xs">
                                    {doc.number}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-neutral-200">{doc.clientName}</span>
                                        <span className="text-xs text-neutral-500">{doc.clientCompany}</span>
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
