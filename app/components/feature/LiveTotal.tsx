"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { DocumentFormData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export function LiveTotal() {
    const { control } = useFormContext<DocumentFormData>();

    // Watch all relevant fields to trigger re-renders
    const items = useWatch({ control, name: "items" }) || [];
    const gstList = useWatch({ control, name: "gstList" }) || [];

    // Calculate totals
    const subTotal = items.reduce((sum, item) => {
        return sum + (Number(item.rate) || 0) * (Number(item.quantity) || 0);
    }, 0);

    const gstTotal = gstList.reduce((sum, gst) => {
        return sum + (subTotal * (Number(gst.rate) || 0)) / 100;
    }, 0);

    const grandTotal = subTotal + gstTotal;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900/90 backdrop-blur-2xl border border-neutral-800/80 rounded-2xl p-8 space-y-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
            {/* Subtle top glow for authority */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-50" />

            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center text-neutral-400">
                    <span className="font-medium tracking-wide">Subtotal</span>
                    <span className="font-mono text-neutral-200">{formatCurrency(subTotal)}</span>
                </div>

                <AnimatePresence>
                    {gstList.map((gst, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-center text-neutral-500"
                        >
                            <span>{gst.type} <span className="text-xs text-neutral-600 ml-1">({gst.rate}%)</span></span>
                            <span className="font-mono">{formatCurrency((subTotal * (Number(gst.rate) || 0)) / 100)}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="pt-6 flex flex-col items-end gap-1 relative z-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Total Payable</span>
                <span className="text-4xl sm:text-5xl font-bold tracking-tighter text-white flex items-baseline gap-2 drop-shadow-lg">
                    <span className="text-neutral-600 text-lg font-medium tracking-normal mr-1">INR</span>
                    {formatCurrency(grandTotal).replace(/[^0-9.,]/g, '')}
                </span>
            </div>
        </motion.div>
    );
}
