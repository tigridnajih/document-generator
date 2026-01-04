"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DocumentFormData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react"; // Added useMemo here

// Format currency - moved outside LiveTotal so CountUp can access it
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(amount);
};

// Simple CountUp component for financial precision
function CountUp({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        const end = value;
        if (start === end) return;

        const duration = 600;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = start + (end - start) * ease;
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]); // minimal dependency to avoid jitter

    return <>{formatCurrency(displayValue).replace(/[^0-9.,]/g, '')}</>;
}

export function LiveTotal() {
    const { control } = useFormContext<DocumentFormData>();

    // Watch all relevant fields to trigger re-renders
    const items = useWatch({ control, name: "items" }) || [];
    const gstList = useWatch({ control, name: "gstList" }) || [];

    // Calculate totals using useMemo for performance
    const subTotal = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + (Number(item.rate) || 0) * (Number(item.quantity) || 0);
        }, 0);
    }, [items]);

    const gstTotal = useMemo(() => {
        return gstList.reduce((sum, gst) => {
            return sum + (subTotal * (Number(gst.rate) || 0)) / 100;
        }, 0);
    }, [subTotal, gstList]);

    const grandTotal = useMemo(() => {
        return subTotal + gstTotal;
    }, [subTotal, gstTotal]);

    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900/90 backdrop-blur-3xl border border-neutral-800/50 rounded-2xl py-10 px-8 space-y-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] relative overflow-hidden group"
        >
            {/* Background Atmosphere - Balanced & Serious */}
            <div className="absolute top-[-25%] right-[-5%] w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-4 text-sm relative z-10">
                <div className="flex justify-between items-center text-neutral-400 font-medium">
                    <span className="tracking-wide">Subtotal</span>
                    <span className="font-mono text-neutral-100">{formatCurrency(subTotal)}</span>
                </div>

                <AnimatePresence>
                    {gstList.map((gst, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-center text-neutral-400 overflow-hidden"
                        >
                            <span className="flex items-center gap-2">
                                {gst.type}
                                <span className="text-[10px] text-neutral-600 font-bold px-1.5 py-0.5 rounded bg-neutral-800/50 uppercase">
                                    {gst.rate}%
                                </span>
                            </span>
                            <span className="font-mono text-neutral-300">{formatCurrency((subTotal * (Number(gst.rate) || 0)) / 100)}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="pt-10 flex flex-col items-end gap-3 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">Total Payable</span>
                <span className="text-5xl sm:text-6xl font-bold tracking-[-0.03em] text-white flex items-baseline gap-4 drop-shadow-2xl">
                    <span className="text-neutral-500 text-xl sm:text-2xl font-semibold tracking-normal">INR</span>
                    <CountUp value={grandTotal} />
                </span>
            </div>
        </motion.div>
    );
}
