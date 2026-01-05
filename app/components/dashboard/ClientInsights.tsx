"use client";

interface ClientInsight {
    name: string;
    count: number;
}

interface ClientInsightsProps {
    topClients: ClientInsight[];
    concentration: number;
    repeatRate: {
        repeat: number;
        oneTime: number;
    };
}

import { cn } from "@/lib/utils";

export function ClientInsights({ topClients, concentration, repeatRate, className }: ClientInsightsProps & { className?: string }) {
    return (
        <div className={cn(
            "bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-500 flex flex-col",
            className
        )}>
            <div className="space-y-1 mb-6">
                <h3 className="text-neutral-200 text-sm font-semibold tracking-tight">
                    Client Insights
                </h3>
                <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-medium">Behavorial Analysis</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Top Clients */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800/50 pb-2">Top Clients</p>
                    <div className="space-y-3">
                        {topClients.map((client) => (
                            <div key={client.name} className="flex justify-between items-center group/item">
                                <span className="text-xs text-neutral-400 group-hover/item:text-neutral-300 transition-colors truncate flex-1 mr-4">{client.name}</span>
                                <div className="flex items-center gap-3">
                                    <div className="h-1 w-20 bg-neutral-800 rounded-full overflow-hidden hidden sm:block">
                                        <div
                                            className="h-full bg-orange-500/40"
                                            style={{ width: `${(client.count / (topClients[0]?.count || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-neutral-600 font-mono w-4 text-right">{client.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Concentration */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800/50 pb-2">Client Concentration</p>
                    <div className="bg-neutral-800/10 border border-neutral-800/40 rounded-xl p-4 flex flex-col justify-center h-[100px]">
                        <p className="text-xs text-neutral-400 leading-relaxed italic text-center">
                            "Top client accounts for <span className="text-orange-500/80 font-bold text-sm"> {concentration}%</span> of all documents"
                        </p>
                    </div>
                </div>

                {/* Retention */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em] border-b border-neutral-800/50 pb-2">Retention</p>
                    <div className="grid grid-cols-2 gap-4 h-[100px]">
                        <div className="p-3 bg-neutral-800/10 border border-neutral-800/40 rounded-xl flex flex-col justify-center">
                            <p className="text-[10px] text-neutral-500 uppercase mb-1">Repeat</p>
                            <p className="text-xl font-bold text-white leading-none">{repeatRate.repeat}</p>
                        </div>
                        <div className="p-3 bg-neutral-800/10 border border-neutral-800/40 rounded-xl flex flex-col justify-center">
                            <p className="text-[10px] text-neutral-500 uppercase mb-1">One-time</p>
                            <p className="text-xl font-bold text-white leading-none">{repeatRate.oneTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
