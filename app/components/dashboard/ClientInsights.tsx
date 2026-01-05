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

export function ClientInsights({ topClients, concentration, repeatRate }: ClientInsightsProps) {
    return (
        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-500 flex flex-col h-full">
            <div className="space-y-1 mb-6">
                <h3 className="text-neutral-200 text-sm font-semibold tracking-tight">
                    Client Insights
                </h3>
                <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-medium">Behavorial Analysis</p>
            </div>

            <div className="space-y-8 flex-1">
                {/* Top Clients */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em]">Top Clients</p>
                    <div className="space-y-2">
                        {topClients.map((client) => (
                            <div key={client.name} className="flex justify-between items-center group/item">
                                <span className="text-xs text-neutral-400 group-hover/item:text-neutral-300 transition-colors truncate max-w-[140px]">{client.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-24 bg-neutral-800 rounded-full overflow-hidden">
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
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em]">Client Concentration</p>
                    <p className="text-xs text-neutral-400 leading-relaxed italic">
                        "Top client accounts for <span className="text-orange-500/80 font-semibold">{concentration}%</span> of all documents"
                    </p>
                </div>

                {/* Repeat rate */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em]">Retention</p>
                    <div className="flex gap-4">
                        <div className="flex-1 p-3 bg-neutral-800/10 border border-neutral-800/40 rounded-xl">
                            <p className="text-[10px] text-neutral-500 uppercase mb-1">Repeat</p>
                            <p className="text-lg font-bold text-white leading-none">{repeatRate.repeat}</p>
                        </div>
                        <div className="flex-1 p-3 bg-neutral-800/10 border border-neutral-800/40 rounded-xl">
                            <p className="text-[10px] text-neutral-500 uppercase mb-1">One-time</p>
                            <p className="text-lg font-bold text-white leading-none">{repeatRate.oneTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
